'use strict'

const APIPATH = 'api/v3/'

// npm
require('dotenv-safe').load()
const got = require('got')
const WebSocket = require('ws')

// core
const resolveUrl = require('url').resolve
const api = (path) => resolveUrl(resolveUrl(process.env.API, APIPATH), path)
const isoNow = () => new Date().toISOString()

const onMsg = (() => {
  var mates
  const showTeamMates = (tm) => { mates = JSON.parse(tm.body) }

  return (s, opt, data) => {
    const msg = JSON.parse(data)
    if (msg.team_id) {
      got(api('users/profiles/' + msg.team_id), opt)
        .then(showTeamMates)
        .catch(console.error)
    } else if (msg.user_id && (msg.event === 'new_user' || msg.event === 'status_change' || msg.event === 'hello')) {
      let out = msg.data.status || '-'
      s[msg.user_id] = (mates && mates[msg.user_id] && mates[msg.user_id].username)
        ? (out + ' ' + mates[msg.user_id].username)
        : out
    } else {
      console.log(isoNow(), JSON.stringify(msg, null, ' '))
    }
  }
})()

const onOpen = () => { console.log(isoNow(), 'open!') }

const doLogin = () => {
  const login = { login_id: process.env.LOGIN_ID, password: process.env.PASSWORD }
  const opt = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(login)
  }
  return got(api('users/login'), opt)
}

const usersWS = (s, a) => {
  const opt = { headers: { Authorization: 'Bearer ' + a.headers.token } }
  const ws = new WebSocket(api('users/websocket').replace('https://', 'wss://'), opt)
  const bnd = onMsg.bind(null, s, opt)
  ws.on('open', onOpen)
  ws.on('message', bnd)
  return {
    seen: s,
    ws: ws
  }
}

const onTimer = (s) => {
  let r
  let tot = 0
  const tots = {}
  for (r in s) {
    ++tot
    if (tots[s[r]]) {
      ++tots[s[r]]
    } else {
      tots[s[r]] = 1
    }
  }
  console.log(isoNow(), tot, tots)
}

module.exports = () => {
  const seen = { }
  setTimeout(onTimer, 5000, seen)
  setInterval(onTimer, 30000, seen)
  return doLogin().then(usersWS.bind(null, seen))
}

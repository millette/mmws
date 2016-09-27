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

var mates
const seen = { }

const showTeamMates = (tm) => {
  mates = JSON.parse(tm.body)
  // console.log(isoNow(), 'mates:', mates)
  // console.log(tm.headers)
}

const onOpen = () => { console.log(isoNow(), 'open!') }
const onMsg = (opt, data) => {
  const msg = JSON.parse(data)
  // console.log(isoNow(), msg)
  if (msg.team_id && !mates) {
    got(api('users/profiles/' + msg.team_id), opt)
      .then(showTeamMates)
      .catch(console.error)
  } else if (msg.user_id && ('status_change' === msg.event || 'hello' === msg.event)) {
    seen[msg.user_id] = msg.data
  }
}

const doLogin = () => {
  const login = { login_id: process.env.LOGIN_ID, password: process.env.PASSWORD }
  const opt = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(login)
  }

  return got(api('users/login'), opt)
}

const usersWS = (a) => {
  const opt = { headers: { Authorization: 'Bearer ' + a.headers.token } }
  const ws = new WebSocket(api('users/websocket').replace('https://', 'wss://'), opt)
  const bnd = onMsg.bind(null, opt)
  ws.on('open', onOpen)
  ws.on('message', bnd)
}

setInterval(() => {
  console.log(isoNow(), Object.keys(seen).length, JSON.stringify(seen, null, ' '))
}, 10000)

doLogin().then(usersWS).catch(console.error)

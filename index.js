'use strict'

const APIPATH = 'api/v3/'

// npm
require('dotenv-safe').load()
const got = require('got')
const WebSocket = require('ws')
// const MattermostClient = require('mattermost').Client
// const MattermostWsClient = require('mattermost').WebSocketClient

// core
const resolveUrl = require('url').resolve

var mates
const api = (path) => resolveUrl(resolveUrl(process.env.API, APIPATH), path)
const isoNow = () => new Date().toISOString()
const showTeamMates = (tm) => { mates = JSON.parse(tm.body) }
const onOpen = () => { console.log(isoNow(), 'open!') }

const onMsg = (s, opt, data) => {
  const msg = JSON.parse(data)
  let out
  if (msg.team_id) {
    got(api('users/profiles/' + msg.team_id), opt)
      .then(showTeamMates)
      .catch(console.error)
  } else if (msg.user_id && (msg.event === 'status_change' || msg.event === 'hello')) {
    if (msg.data.status) {
      out = msg.data.status
    } else if (msg.data.server_version) {
      out = '-'
    } else {
      out = msg.data
    }

    if (mates && mates[msg.user_id] && mates[msg.user_id].username) {
      s[msg.user_id] = out + ' ' + mates[msg.user_id].username
    } else {
      s[msg.user_id] = out
    }
  } else {
    console.log(isoNow(), JSON.stringify(msg, null, ' '))
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

const lengthSort = (a, b) => {
  const la = a.length
  const lb = b.length
  if (la > lb) { return 1 }
  if (la < lb) { return -1 }
  return 0
}

const onTimer = (s) => {
  let r
  const tot = []
  for (r in s) { tot.push(s[r]) }
  console.log(isoNow(), tot.length, tot.sort(lengthSort).join(', '))
}

// const doit = () => {
module.exports = () => {
  const seen = { }
  setInterval(onTimer, 15000, seen)
  return doLogin().then(usersWS.bind(null, seen))
}

// doit()

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

const showTeamMates = (tm) => {
  mates = JSON.parse(tm.body)
  console.log(isoNow(), 'mates:', mates)
  console.log(tm.headers)
}

const onOpen = () => { console.log(isoNow(), 'open!') }
const onMsg = (opt, data) => {
  const msg = JSON.parse(data)
  console.log(isoNow(), msg)
  if (msg.team_id && !mates) {
    got(api('users/profiles/' + msg.team_id), opt)
      .then(showTeamMates)
      .catch(console.error)
  } else if (msg.user_id && mates) {
    console.log(isoNow(), 'who', mates[msg.user_id])
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
  const ws = new WebSocket('wss://framateam.org/api/v3/users/websocket', opt)
  const bnd = onMsg.bind(null, opt)
  ws.on('open', onOpen)
  ws.on('message', bnd)
}

doLogin().then(usersWS).catch(console.error)

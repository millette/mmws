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

const onOpen = () => { console.log(isoNow(), 'open!') }
const onMsg = (data, flags) => {
  console.log('flags', Object.keys(flags))
  console.log(isoNow(), JSON.parse(data))
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
  ws.on('open', onOpen)
  ws.on('message', onMsg)
}

doLogin().then(usersWS).catch(console.error)

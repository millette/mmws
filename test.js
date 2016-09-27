'use strict'
import test from 'ava'
import fn from './'

test('large', async t => {
  const result = await fn()
  t.truthy(result.ws)
  t.truthy(result.seen)
})

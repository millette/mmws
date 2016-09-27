'use strict'
import test from 'ava'
import fn from './'

test('large', async t => {
  const result = await fn()
  console.log(result)
  t.truthy(true)
})

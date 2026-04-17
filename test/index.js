import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import ltsv, { GetNodeLTS } from '../index.js'

describe('index', function () {
  it('creates a GetNodeLTS', function () {
    assert.equal(ltsv.constructor.name, 'GetNodeLTS')
  })

  it('fetch populates majorsLatest', async function () {
    await ltsv.fetchLTS()
    assert.ok(Object.keys(ltsv.majorsLatest).length)
  })

  it('prints a report of maintained LTS versions', async function () {
    await ltsv.fetchLTS()
    ltsv.print('lts')
  })

  it('prints a YAML list of maintained LTS versions', async function () {
    await ltsv.fetchLTS()
    console.log(ltsv.yaml())
  })

  it('prints a JSON list of maintained LTS versions', async function () {
    await ltsv.fetchLTS()
    console.log(ltsv.json('lts'))
  })
})

describe('deltaDate', function () {
  const start = `2022-04-19T00:00:00.000`

  it('adds 1 day to a date', function () {
    assert.equal(
      ltsv.deltaDate(start, [0, 0, 1]).toISOString(),
      '2022-04-20T00:00:00.000Z',
    )
  })

  it('adds 6 months to a date', function () {
    assert.equal(
      ltsv.deltaDate(start, [0, 6, 0]).toISOString(),
      '2022-10-19T00:00:00.000Z',
    )
  })

  it('adds 1 year to a date', function () {
    assert.equal(
      ltsv.deltaDate(start, [1, 0, 0]).toISOString(),
      '2023-04-19T00:00:00.000Z',
    )
  })

  it('adds 36 months to a date', function () {
    assert.equal(
      ltsv.deltaDate(start, [0, 36, 0]).toISOString(),
      '2025-04-19T00:00:00.000Z',
    )
  })

  it('gets the last day of a future date', function () {
    assert.equal(
      ltsv.deltaDate(start, [0, 36, 31]).toISOString(),
      '2025-04-30T00:00:00.000Z',
    )
  })
})

describe('get', function () {
  it('fetches active version', async function () {
    await ltsv.fetchLTS()
    const active = ltsv.get('active')
    console.log(active)
    assert.ok(active[0])
    // The exact length might change depending on the current date and node versions
    // but at least one should be active in 2026.
  })

  it('fetches maintenance versions', async function () {
    await ltsv.fetchLTS()
    const maint = ltsv.get('maintenance')
    console.log(maint)
    assert.ok(maint.length)
  })

  it('fetches the current version', async function () {
    await ltsv.fetchLTS()
    const current = ltsv.get('current')
    // current can be empty between Node.js release cycles
    console.log(current)
    assert.ok(Array.isArray(current))
    assert.ok(current.every((version) => typeof version === 'string' && /^\d+$/.test(version)))
  })

  it('fetches the LTS versions', async function () {
    await ltsv.fetchLTS()
    const lts = ltsv.get('lts')
    console.log(lts)
    assert.ok(lts.length)
  })
})

describe('exports', function () {
  it('exports GetNodeLTS', function () {
    assert.equal(typeof GetNodeLTS, 'function')
    const ltsv2 = new GetNodeLTS()
    assert.equal(ltsv2.constructor.name, 'GetNodeLTS')
  })
})

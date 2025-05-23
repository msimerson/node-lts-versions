const assert = require('node:assert/strict')

const ltsv = require('../index')

describe('index', function () {
  this.timeout(3000)

  it('creates a getNodeLTS', function (done) {
    assert.equal(ltsv.constructor.name, 'getNodeLTS')
    done()
  })

  it('fetch populates majorsLatest', function (done) {
    ltsv
      .fetchLTS()
      .then(() => {
        assert.ok(Object.keys(ltsv.majorsLatest).length)
        done()
      })
      .catch(done)
  })

  it('prints a report of maintained LTS versions', function (done) {
    ltsv.fetchLTS().then(() => {
      ltsv.print('lts')
      done()
    })
  })

  it('prints a YAML list of maintained LTS versions', function (done) {
    ltsv.fetchLTS().then(() => {
      console.log(ltsv.yaml())
      done()
    })
  })

  it('prints a JSON list of maintained LTS versions', function (done) {
    ltsv.fetchLTS().then(() => {
      console.log(ltsv.json('lts'))
      done()
    })
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
    assert.equal(ltsv.deltaDate(start, [0, 6, 0]).toISOString(), '2022-10-19T00:00:00.000Z')
  })

  it('adds 1 year to a date', function () {
    assert.equal(
      ltsv.deltaDate(start, [1, 0, 0]).toISOString(),
      '2023-04-19T00:00:00.000Z',
    )
  })

  it('adds 36 months to a date', function () {
    assert.equal(ltsv.deltaDate(start, [0, 36, 0]).toISOString(), '2025-04-19T00:00:00.000Z')
  })

  it('gets the last day of a future date', function () {
    assert.equal(ltsv.deltaDate(start, [0, 36, 31]).toISOString(), '2025-04-30T00:00:00.000Z')
  })
})

describe('get', function () {
  it('fetches active version', async function () {
    await ltsv.fetchLTS()
    const active = ltsv.get('active')
    console.log(active)
    assert.ok(active[0])
    assert.equal(active.length, 1)
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
    console.log(current)
    assert.equal(current.length, 1)
  })

  it('fetches the LTS versions', async function () {
    await ltsv.fetchLTS()
    const lts = ltsv.get('lts')
    console.log(lts)
    assert.ok(lts.length)
  })
})
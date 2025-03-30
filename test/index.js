const assert = require('assert')

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
      ltsv.print()
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
      console.log(ltsv.json())
      done()
    })
  })
})

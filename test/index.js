
const assert = require('assert')

const ltsv = require('../index')

describe('index', function () {
  this.timeout(3000)
  it('creates a getNodeLTS', function (done) {
    assert.equal(ltsv.constructor.name, 'getNodeLTS')
    done()
  })

  it('fetch populates majorsLatest', function (done) {
    ltsv.fetch().then(() => {
      assert.ok(Object.keys(ltsv.majorsLatest).length)
      done()
    })
    .catch(done)
  })

  it('prints a report of maintained LTS versions', function (done) {
    ltsv.fetch().then(() => {
      ltsv.print()
      done()
    })
  })

  it('prints a list of maintained LTS versions', function (done) {
    ltsv.fetch().then(() => {
      console.log(ltsv.yaml())
      done()
    })
  })
})
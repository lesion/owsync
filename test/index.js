/* global it, describe */
'use strict'
var chai = require('chai')
chai.use(require('chai-as-promised'))
var expect = chai.expect
var Owsync = require('../dist/index').default
var sync = new Owsync()

let item = { a: 1, b: 2, c: 3, d: { a: 1, b: 2 } }
let items = [1]

describe('owsync', function () {
  it('should be save atoms', function () {
    sync.add(item, item)
    expect(sync.get(item)).to.be.eq(item)
  })

  it('should not add an equal item', function () {
    sync.add(item, item)
    expect(sync.gets().size).to.be.eq(1)
  })

  it('should add multiple items', function () {
    items.forEach(item => sync.add(item, item))
    expect(sync.gets().size).to.be.eq(6)
  })

  it('should sync', function (done) {
    this.timeout(15000)

    // expect(sync.sync()).to.eventually.be.equal
    sync.sync().then(
      function (ret) {
        console.error(ret)
        done()
      })
  })
})

var should = require('chai').should(),
    position = require('../position')

describe('position', function() {
  it('creates ńew position', function() {
    var x = 4, y = 5
    var p = new position(x, y)
    p.x.should.equal(x)
    p.y.should.equal(y)
  })

  it('creates new position from old position', function() {
    var x = 4, y = 5, xModifier = 2, yModifier = -2
    var p = new position(x, y).newPosition(xModifier, yModifier)
    p.x.should.equal(x + xModifier)
    p.y.should.equal(y + yModifier)
  })
})
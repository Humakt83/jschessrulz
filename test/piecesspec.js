var should = require('chai').should(),
    pieces = require('../pieces')

describe('pieces', function() {

  it('creates white pawn', function() {
    pieces.createPawn(true).should.equal(1)
  })

  it('creates black pawn', function() {
    pieces.createPawn(false).should.equal(-1)
  })

  it('creates white knight', function() {
    pieces.createKnight(true).should.equal(2)
  })

  it('creates black knight', function() {
    pieces.createKnight(false).should.equal(-2)
  })

  it('creates white bishop', function() {
    pieces.createBishop(true).should.equal(3)
  })

  it('creates black bishop', function() {
    pieces.createBishop(false).should.equal(-3)
  })

  it('creates white rook', function() {
    pieces.createRook(true).should.equal(4)
  })

  it('creates black rook', function() {
    pieces.createRook(false).should.equal(-4)
  })

  it('creates white queen', function() {
    pieces.createQueen(true).should.equal(5)
  })

  it('creates black queen', function() {
    pieces.createQueen(false).should.equal(-5)
  })

  it('creates white king', function() {
    pieces.createKing(true).should.equal(6)
  })

  it('creates black bishop', function() {
    pieces.createKing(false).should.equal(-6)
  })
})
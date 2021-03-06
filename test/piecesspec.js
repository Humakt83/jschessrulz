var should = require('chai').should(),
    pieces = require('../pieces'),
    Chess = require('../index').Chess

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

  it('css does not contain black for white piece', function() {
    pieces.getCssName(1).should.not.contain('_black')
  })

  it('css contains black for black piece', function() {
    pieces.getCssName(-1).should.contain('_black')
  })

  describe('moves for pieces', function() {

    it('all white pawns have two moves at start of the game', function() {
      new Chess().allowedMoves.map(function(move) {
        return move.piece
      }).filter(function(piece) {
        return piece === 1
      }).length.should.equal(16)
    })

    it('all black pawns have two moves at start of the game', function() {
      var game = new Chess()
      game.makeMove(game.allowedMoves[0])
      game.allowedMoves.map(function(move) {
        return move.piece
      }).filter(function(piece) {
        return piece === -1
      }).length.should.equal(16)
    })

  })

})
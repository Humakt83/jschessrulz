var should = require('chai').should(),
    index = require('../index')

describe('Chess', function() {

  it('Is a checkmate', function() {
    let chess = new index.Chess()
    chess.board = [[ -4, 6, 0, -5, -6, -3, -2, -4 ],
        [ -1, 0, -1, -1, -1, -1, -1, -1 ],
        [ 0, 0, -3, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 1, 1, 1, 1, 0, 1, 1, 1 ],
        [ 4, 2, 3, 5, 0, 3, 2, 4 ]]
    chess.setAllowedMoves()
    chess.isCheckMate().should.equal(true)
  })

  it('Is a stalemate', function() {
    let chess = new index.Chess()
    chess.board = [[ -4, 0, 0, 0, -6, -3, -2, -4 ],
        [ -1, 0, -1, -1, -1, 0, -1, -1 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, -5, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, -1 ],
        [ 0, 0, 0, 0, 0, 0, 0, 1 ],
        [ 0, 0, 0, 0, 0, 0, 0, 6 ]]
    chess.setAllowedMoves()
    chess.isStaleMate().should.equal(true)
  })

  it('Is neither checkmate or stalemate', function() {
    let chess = new index.Chess()
    chess.isStaleMate().should.equal(false)
    chess.isCheckMate().should.equal(false)
  })

  it('King is not allowed to castle when threatened', function() {
    let chess = new index.Chess()
    chess.board = [[ -6, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, -1, 0, 0, 0 ],
        [ 0, 0, 0, -1, -4, -1, 0, 0 ],
        [ 0, 0, 0, 1, 0, 1, 0, 1 ],
        [ 0, 0, 0, 0, 6, 0, 0, 4 ]]
    index.Piece.getMoves(6, new index.Position(4, 7), chess).length.should.equal(2)
  })

  it('King is not allowed to castle when line is threatened', function() {
    let chess = new index.Chess()
    chess.board = [[ -6, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, -4, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 1 ],
        [ 0, 0, 0, 0, 6, 0, 0, 4 ]]
    index.Piece.getMoves(6, new index.Position(4, 7), chess).length.should.equal(3)
  })

  it('King is not allowed to make long castle when line is threatened', function() {
    let chess = new index.Chess()
    chess.board = [[ -6, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, -4, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 1 ],
        [ 4, 0, 0, 0, 6, 0, 0, 0 ]]
    index.Piece.getMoves(6, new index.Position(4, 7), chess).length.should.equal(5)
  })

  it('King is allowed to castle when unthreatened', function() {
    let chess = new index.Chess()
    chess.board = [[ -6, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, -4, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 1 ],
        [ 0, 0, 0, 0, 6, 0, 0, 4 ]]
    index.Piece.getMoves(6, new index.Position(4, 7), chess).length.should.equal(4)
  })
})
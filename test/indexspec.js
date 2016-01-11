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
})
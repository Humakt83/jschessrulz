'use strict'

import _ from 'lodash'
const cssNames = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king']

function Move(piece, oldPosition, newPosition, chess, effect) {
	this.piece = piece
	this.originalPosition = oldPosition
	this.position = newPosition
	this.boardBeforeMove = chess.board
	this.boardAfterMove = chess.boardAfterMove(oldPosition, newPosition)
	this.effect = effect ? effect : function(){}
	this.castlingState = {blockers: chess.getCastlingState().blockers.slice()}
}

var filterOutOfBoardMoves = function(moves, chess) {
	return _.compact(_.filter(moves, function(move) {
		return chess.isPositionInsideBoard(move.position ? move.position : move)
	}))
}

var filterMovesThatCollideWithOwnPiece = function(moves, whitePiece, chess) {
	return _.compact(_.filter(moves, function(move) {
		var slot = chess.getSlot(move.position)
		return !((whitePiece && slot > 0) || (!whitePiece && slot < 0))
	}))
}

var filterMovesThatCauseMate = function(moves, whitePiece, chess) {
	if (chess.aiTurn) return moves
	var pieceToLookFor = whitePiece ? 6 : -6
	return _.compact(_.filter(moves, function(move) {
		if (chess.doNotCheckForCheck) return true
		chess.doNotCheckForCheck = true
		chess.makeMove(move, true)
		var noKingRemains = _.find(_.flatten(chess.getFutureMoves()), function(futureMove) {
			return !_.chain(futureMove.boardAfterMove).flatten().includes(pieceToLookFor).value()
		})
		chess.undoMove(true)
		chess.doNotCheckForCheck = false
		return noKingRemains === undefined
	}))
}

var filterIllegalMoves = function(moves, whitePiece, chess) {
	return _.compact(filterMovesThatCauseMate(filterMovesThatCollideWithOwnPiece(filterOutOfBoardMoves(moves, chess), whitePiece, chess), whitePiece, chess))
}

var getMovesUntilBlocked = function(chess, position, xModifier, yModifier, pieceBeingMoved) {
	var moves = [], blocked = false
	var newPosition = position.newPosition(xModifier, yModifier)
	while (chess.isPositionInsideBoard(newPosition) && !blocked) {
		moves.push(new Move(pieceBeingMoved, position, newPosition, chess))
		blocked = blocked || chess.getSlot(newPosition) != 0
		newPosition = newPosition.newPosition(xModifier, yModifier)
	}
	return moves
}

var diagonalMoves = function(chess, position, piece) {
	return getMovesUntilBlocked(chess, position, 1, 1, piece)
		.concat(getMovesUntilBlocked(chess, position, -1, -1, piece))
		.concat(getMovesUntilBlocked(chess, position, 1, -1, piece))
		.concat(getMovesUntilBlocked(chess,position, -1, 1, piece))
}

var horizontalAndVerticalMoves = function(chess, position, piece) {
	return getMovesUntilBlocked(chess, position, 0, 1, piece)
		.concat(getMovesUntilBlocked(chess, position, 0, -1, piece))
		.concat(getMovesUntilBlocked(chess, position, 1, 0, piece))
		.concat(getMovesUntilBlocked(chess, position, -1, 0, piece))
}

var getPawnMoves = function(position, pieceBeingMoved, chess, whitePiece) {
	function blocked(move) {
		return chess.getSlot(move) != 0
	}
	function addLevelupForMove(move) {
		if (move.y === 7 || move.y === 0) {
			return function() {
				chess.pawnIsLeveled()
			}
		}
		return function() {}
	}
	function handleMovesForward(moves, sign) {
		var moveForward = position.newPosition(0, sign)
		if (!blocked(moveForward)) { 
			moves.push(new Move(pieceBeingMoved, position, moveForward, chess, addLevelupForMove(moveForward)))
			if ((position.y === 6 && whitePiece) || (position.y === 1 && !whitePiece)) {
				var movesForwardTwice = position.newPosition(0, (sign * 2))
				if (!blocked(movesForwardTwice)) {
					var move = new Move(pieceBeingMoved, position, movesForwardTwice, chess)
					move.pawnDoubleForward = true
					moves.push(move)
				}
			}
		}
	}
	function handleDiagonalAttacks(moves, sign) {
		var diagonalAttacks = [position.newPosition(-1, sign), position.newPosition(1, sign)]
		_.each(filterOutOfBoardMoves(diagonalAttacks, chess), function (attack) {
			var piece = chess.getSlot(attack)
			if ((piece < 0 && whitePiece ) || (piece > 0 && !whitePiece )) {
				moves.push(new Move(pieceBeingMoved, position, attack, chess, addLevelupForMove(attack)))
			} else if (chess.madeMoves.length > 0 && _.last(chess.madeMoves).pawnDoubleForward) {
				var previousMove = _.last(chess.madeMoves)
				if (previousMove.position.y === position.y && previousMove.position.x === attack.x) {
					moves.push(new Move(pieceBeingMoved, position, attack, chess, function() {
						chess.board[previousMove.position.y][previousMove.position.x] = 0
					}))
				}
			}
		})
	}
	var moves = []
	var sign = whitePiece ? -1 : 1
	handleMovesForward(moves, sign)
	handleDiagonalAttacks(moves, sign)
	return moves
}

var getBishopMoves = function(position, piece, chess) {
	return diagonalMoves(chess, position, piece)
}

var getKnightMoves = function(position, piece, chess) {
	return [new Move(piece, position, position.newPosition(1,2), chess), new Move(piece, position, position.newPosition(1,-2), chess), new Move(piece, position, position.newPosition(-1,2), chess), 
		new Move(piece, position, position.newPosition(-1,-2), chess), new Move(piece, position, position.newPosition(2,1), chess), 
		new Move(piece, position, position.newPosition(2,-1), chess), new Move(piece, position, position.newPosition(-2,1), chess), new Move(piece, position, position.newPosition(-2,-1), chess)]
}

var getRookMoves = function(position, piece, chess) {
	return _.chain(horizontalAndVerticalMoves(chess, position, piece)).each(function(move) {
		let moveType
		if (piece > 0) moveType = position.x === 0 ? 'WHITE_LEFT_ROOK_MOVED' : 'WHITE_RIGHT_ROOK_MOVED'
		else moveType = position.x === 0 ? 'BLACK_LEFT_ROOK_MOVED' : 'BLACK_RIGHT_ROOK_MOVED'
		move.castlingState.blockers.push(moveType)
	}).value()
}

var getQueenMoves = function(position, piece, chess) {
	return diagonalMoves(chess,position, piece)
		.concat(horizontalAndVerticalMoves(chess, position, piece))
}

var getKingMoves = function(position, piece, chess, whitePiece) {
	var positionCanBeReachedByEnemy = function(positions) {
		chess.turnOfWhite = !whitePiece
		chess.doNotCheckForCheck = true
		let canBeReached = _.chain(chess.getFutureMoves())
			.flatten()
			.map(function(move) { 
				return move.position
			})
			.filter(function(position) {
				return _.find(positions, position) != undefined
			})
			.value().length > 0
		chess.turnOfWhite = whitePiece
		chess.doNotCheckForCheck = false
		return canBeReached
	}
	var toweringMoves = []
	if (!chess.castlingMoveMadeOfType(whitePiece ? 'WHITE_KING_MOVED' : 'BLACK_KING_MOVED')) {
		var rookLeftPosition = position.newPosition(-4,0)			
		var rookRightPosition = position.newPosition(3,0)
		var rookLeft = chess.getSlot(rookLeftPosition)
		var rookRight = chess.getSlot(rookRightPosition)
		var rook = whitePiece? 4: -4
		var leftRookMoved = chess.castlingMoveMadeOfType(whitePiece ? 'WHITE_LEFT_ROOK_MOVED' : 'BLACK_LEFT_ROOK_MOVED')
		var rightRookMoved = chess.castlingMoveMadeOfType(whitePiece ? 'WHITE_RIGHT_ROOK_MOVED' : 'BLACK_RIGHT_ROOK_MOVED')
		if (rookLeft === rook && !leftRookMoved && chess.getSlot(position.newPosition(-1,0)) === 0 && chess.getSlot(position.newPosition(-2,0)) === 0 && chess.getSlot(position.newPosition(-3,0)) === 0) {
			if (chess.doNotCheckForCheck || !positionCanBeReachedByEnemy([position, position.newPosition(-1,0), position.newPosition(-2, 0), position.newPosition(-3,0)])) {
				toweringMoves.push(new Move(piece, position, position.newPosition(-2,0), chess, function() {
					chess.board[rookLeftPosition.y][rookLeftPosition.x] = 0
					var newRookPosition = rookLeftPosition.newPosition(3, 0)
					chess.board[newRookPosition.y][newRookPosition.x] = rookLeft
				}))
			}
		}
		if (rookRight === rook && !rightRookMoved && chess.getSlot(position.newPosition(1,0)) === 0 && chess.getSlot(position.newPosition(2,0)) === 0) {
			if (chess.doNotCheckForCheck || !positionCanBeReachedByEnemy([position, position.newPosition(1,0), position.newPosition(2, 0)])) {
				toweringMoves.push(new Move(piece, position, position.newPosition(2,0), chess, function() {
					chess.board[rookRightPosition.y][rookRightPosition.x] = 0
					var newRookPosition = rookRightPosition.newPosition(-2, 0)
					chess.board[newRookPosition.y][newRookPosition.x] = rookRight
				}))
			}
		}
	}
	var moves = toweringMoves.concat([new Move(piece, position, position.newPosition(0,1), chess), new Move(piece, position, position.newPosition(0,-1), chess), 
		new Move(piece, position, position.newPosition(1,0), chess), new Move(piece, position, position.newPosition(-1,0), chess),
		new Move(piece, position, position.newPosition(1,1), chess), new Move(piece, position, position.newPosition(-1,-1), chess), 
		new Move(piece, position, position.newPosition(1,-1), chess), new Move(piece, position, position.newPosition(-1,1), chess)])
	_.each(moves, function(move) { move.castlingState.blockers.push(whitePiece ? 'WHITE_KING_MOVED' : 'BLACK_KING_MOVED')})
	return moves
}

const movesForPiece = [getPawnMoves, getKnightMoves, getBishopMoves, getRookMoves, getQueenMoves, getKingMoves]

class ChessPiece {
		
	createPawn(whitePiece) {
		return whitePiece ? 1 : -1
	}
	
	createBishop(whitePiece) {
		return whitePiece ? 3 : -3
	}
	
	createKnight(whitePiece) {
		return whitePiece ? 2 : -2
	}
	
	createRook(whitePiece) {
		return whitePiece ? 4 : -4
	}
	
	createQueen(whitePiece) {
		return whitePiece ? 5 : -5
	}
		
	createKing(whitePiece) {
		return whitePiece ? 6 : -6
	}
	
	getMoves(piece, position, chess) {
		var whitePiece = piece > 0
		return filterIllegalMoves(movesForPiece[Math.abs(piece) - 1](position, piece, chess, whitePiece), whitePiece, chess)
	}
	
	getCssName(piece) {
		var blackPiece = piece < 0 ? '_black' : ''
		return cssNames[Math.abs(piece) - 1] + blackPiece
	}
	
}

module.exports = new ChessPiece()
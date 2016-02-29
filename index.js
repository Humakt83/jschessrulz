'use strict'

import _ from 'lodash'
import ChessPiece from './pieces'
import Position from './position'

const xMin = 0, yMin = 0, xMax = 7, yMax = 7

function initBoard() {
	function determinePiece(x, y) {
		if (y === 1 || y === 6) return ChessPiece.createPawn(y === 6)
		if ((x === 0 || x === 7) && (y === 7 || y === 0)) return ChessPiece.createRook(y === 7)
		if ((x === 1 || x === 6) && (y === 7 || y === 0)) return ChessPiece.createKnight(y === 7)
		if ((x === 2 || x === 5) && (y === 7 || y === 0)) return ChessPiece.createBishop(y === 7)
		if (x === 3 && (y === 7 || y === 0)) return ChessPiece.createQueen(y === 7)
		if (x === 4 && (y === 7 || y === 0)) return ChessPiece.createKing(y === 7)
		return 0
	}
	var board = []
	for (var y = yMin; y <= yMax; y++) {
		board.push([])
		for (var x = xMin; x <= xMax; x++) {
			board[y].push(determinePiece(x,y))
		}
	}
	return board
}

class Chess {
		
	constructor() {
		this.board = initBoard()
		this.selected = undefined
		this.turnOfWhite = true
		this.madeMoves = []
		this.aiTurn = false
		this.allowedMoves = []
		this.setAllowedMoves()
	}	
		
	getSlot(position) {
		if (!this.isPositionInsideBoard(position)) return
		return this.board[position.y][position.x]
	}
		
	pawnIsLeveled() {
		var position = _.last(this.madeMoves).position
		var queen = this.turnOfWhite ? 5 : - 5
		this.board[position.y][position.x] = queen
	}
		
	movePiece(from, to) {
		var move = _.find(this.allowedMoves, function(move) {
			return move.position.x === to.x && move.position.y === to.y
				&& move.originalPosition.x === from.x && move.originalPosition.y === from.y
		})
		this.makeMove(move)			
	}
		
	makeMove(move, doNotSetMoves) {
		this.madeMoves.push(move)
		this.board = move.boardAfterMove
		move.effect()
		this.turnOfWhite = !this.turnOfWhite
		this.selected = undefined
		if (!doNotSetMoves) this.setAllowedMoves()
	}

	makeAIMove(board) {
		let previousBoard = this.madeMoves.length > 0 ? _.last(this.madeMoves).boardAfterMove : null
		this.madeMoves.push({
			originalPosition: board.lastMove.original,
			position: board.lastMove.position,
			boardBeforeMove: previousBoard,
			boardAfterMove: board.board,
			pawnDoubleForward: board.lastMove.pawnDoubleForward,
			castlingState: board.castlingState
		})
		this.board = board.board
		this.turnOfWhite = !this.turnOfWhite
		this.selected = undefined
		this.setAllowedMoves()
	}
		
	getFutureMoves() {
		var futureMoves = []
		for (var y = 0; y <= yMax; y++) {
			for (var x = 0; x <= xMax; x++) {
				var piece = this.board[y][x]
				if ((piece > 0 && this.turnOfWhite) || (piece < 0 && !this.turnOfWhite)) {
					futureMoves.push(ChessPiece.getMoves(piece, new Position(x, y), this))
				}
			}
		}
		return futureMoves
	}
	
	setAllowedMoves() {
		this.allowedMoves = []
		for (var y = 0; y <= yMax; y++) {
			for (var x = 0; x <= xMax; x++) {
				var piece = this.board[y][x]
				if ((piece > 0 && this.turnOfWhite) || (piece < 0 && !this.turnOfWhite)) {
					this.allowedMoves.push(ChessPiece.getMoves(piece, new Position(x, y), this))
				}
			}
		}		
		this.selected = undefined
		this.allowedMoves = _.compact(_.flatten(this.allowedMoves))		
	}
		
	boardAfterMove(from, to) {
		if (to.y > yMax || to.x > xMax || to.y < 0 || to.x < 0) return
		var copyBoard = _.clone(this.board)
		for (var x = 0; x <= xMax; x++) { copyBoard[x] = _.clone(this.board[x])}
		copyBoard[to.y][to.x] = copyBoard[from.y][from.x]
		copyBoard[from.y][from.x] = 0			
		return copyBoard
	}
		
	castlingMoveMadeOfType(moveType) {
		return this.madeMoves.length > 0 && _.contains(_.last(this.madeMoves).castlingState.blockers, moveType)
	}
			
	isPositionInsideBoard(position) {
		return position.x >= xMin && position.x <= xMax && position.y >= yMin && position.y <= yMax
	}
		
	getPieces(whitePieces) {
		return _.chain(this.board).flatten().flatten().filter(function(slot) {
				return (slot > 0 && whitePieces) || (slot < 0 && !whitePieces)
			}).sort().reverse().value()
	}
		
	isMovable(x, y) {
		if (this.selected) {
			var sel = this.selected
			return _.find(this.allowedMoves, function(move) {
				return move.originalPosition.x === sel.x && move.originalPosition.y === sel.y
					&& move.position.x === x && move.position.y === y
			})
		}
		return _.find(this.allowedMoves, function(move) {
			return move.originalPosition.x === x && move.originalPosition.y === y
		})
	}
		
	canSetSelected(x, y) {
		var movable = _.find(this.allowedMoves, function(move) {
			return move.originalPosition.x === x && move.originalPosition.y === y
		})
		return movable && ((this.turnOfWhite && this.board[y][x] > 0) || (!this.turnOfWhite && this.board[y][x] < 0))
	}
		
	undoMove(doNotSetMoves) {
		this.board = _.last(this.madeMoves).boardBeforeMove
		this.madeMoves.pop()
		this.turnOfWhite = !this.turnOfWhite
		if (!doNotSetMoves) this.setAllowedMoves()
	}
		
	getWhitePieces() {
		return this.getPieces(true)
	}
		
	getBlackPieces() {
		return this.getPieces(false)
	}
		
	isStaleMate() {
		if (this.isCheckMate()) return false
		return this.allowedMoves.length <= 0
	}
		
	isCheckMate() {
		this.turnOfWhite = !this.turnOfWhite
		let futureMoves = this.getFutureMoves()
		this.turnOfWhite = !this.turnOfWhite
		let kingToFind = this.turnOfWhite ? 6 : -6
		let noKing = _.chain(futureMoves)
			.flatten()
			.map(function(move) {
				return move.boardAfterMove
			})
			.map(function(board) {
				return _.reduce(board, function(a, b) {
					return a.concat(b)
				})
			})
			.filter(function(board) { 
				return !_.find(board, function(piece) { return kingToFind == piece })
			})
			.value().length > 0
		return noKing && this.allowedMoves.length <= 0
	}
	
	isInsufficientMaterial() {
		function hasEnoughMaterial(pieces) {
			return Math.abs(_.sum(pieces)) >= 10 || _.find(pieces, function(piece) { return piece === 1 || piece === -1 })
		}
		return !(hasEnoughMaterial(this.getWhitePieces()) || hasEnoughMaterial(this.getBlackPieces()))
	}
	
	isThreefoldRepetition() {
		if (this.madeMoves.length < 9) return false
		return _.chain(this.madeMoves)
			.takeRight(10)
			.map(function(madeMove) { return madeMove.boardAfterMove})
			.countBy(_.identity)
			.includes(3)
			.value()
	}
	
	isOverMoveLimit() {
		return this.madeMoves.length >= 300
	}
		
	isGameOver() {
		return this.allowedMoves.length <= 0 || this.isInsufficientMaterial() || this.isThreefoldRepetition() || this.isOverMoveLimit()
	}
		
	setSelected(x, y) {
		this.selected = new Position(x, y)
	}
	
	getCastlingState() {
		if (this.madeMoves.length > 0) {
			let previousMove = _.last(this.madeMoves)
			if (!previousMove.castlingState) previousMove.castlingState = {blockers:[]}
			return previousMove.castlingState
		}
		return {blockers:[]}
	}
	
	getGameResultForCheckMate() {
		let winnerIsWhite = !this.turnOfWhite
		let boardStates = _.map(this.madeMoves, function(madeMove) { return madeMove.boardAfterMove })
		return { 'winnerIsWhite': winnerIsWhite, 'boardStates' : boardStates }
	}
}

module.exports = {
	Chess: Chess,
	Piece: ChessPiece,
	Position: Position
}

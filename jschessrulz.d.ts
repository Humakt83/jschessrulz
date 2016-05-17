interface Move {}

interface Chess {

    getSlot(position: Position): number;
    
    pawnIsLeveled: boolean;
    
    movePiece(from: Position, to: Position);
    
    makeMove(move: Move, doNotSetMoves: boolean);
    
    makeAIMove(board: number[][]);
    
    getFutureMoves: Move[];
    
    setAllowedMoves;
    
    boardAfterMove(from: Position, to: Position): number[][];
    
    castlingMoveMadeOfType(moveType: string): boolean;
    
    isPositionInsideBoard(position: Position): boolean;
    
    getPieces(whitePieces: boolean): number[];
    
    isMovable(x: number, y: number): boolean;
    
    canSetSelected(x: number, y: number): boolean;
    
    undoMove(doNotSetMoves: boolean);
    
    getWhitePieces: number[];
    
    getBlackPieces: number[];
    
    isStaleMate: boolean;
    
    isCheckMate: boolean;
    
    isInsufficientMaterial: boolean;
    
    isThreefoldRepetition: boolean;
    
    isOverMoveLimit: boolean;
    
    isGameOver: boolean;
    
    setSelected(x: number, y: number);
    
    getCastlingState: any;
    
    getGameResultForCheckMate: any;
    
}

interface Position {
        
    newPosition(xModifier: number, yModifier, number): Position;
    
}

interface ChessPiece {
    
    createPawn(whitePiece: boolean) : number;
    
    createBishop(whitePiece: boolean) : number;
    
    createKnight(whitePiece: boolean) : number;
    
    createRook(whitePiece: boolean) : number;
    
    createQueen(whitePiece: boolean) : number;
    
    createKing(whitePiece: boolean) : number;
    
    getMoves(piece : number, position: Position, chess: Chess): Move[];
    
    getCssName(piece: number);

}
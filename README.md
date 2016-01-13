# jschessrulz
JavaScript chess rules library

###Requirements
Node.js (https://nodejs.org/en/)

Note that jschessrulz is written with some es2015 features, so your project's build system has to be able to handle those.

###Installation
npm install jschessrulz --save

###Usage

import or require jschessrulz in your js-file

To start a new chess game simply declare: 
```JavaScript
  var chess = new Chess()
```

To select or move a piece use coordinates (0-7 for both x and y):

```JavaScript
selectPiece(x, y) {
	if (!this.chess.selected || this.chess.canSetSelected(x, y)) {
		this.chess.setSelected(x, y)
	} else if (this.chess.isMovable(x, y)) {
		this.chess.movePiece(this.chess.selected, new Position(x, y))
	}
}
```

To determine whether game is over call: 
```JavaScript
  chess.isGameOver()
```

See the following js-file for complete example on how to use this library:

http://github.com/Humakt83/learning-chess-front/blob/master/app/js/chesscomponent.js

Two projects that use this library:
- **Learning Chess** (http://github.com/Humakt83/learning-chess-front)
- **Ng-chess** (http://github.com/Humakt83/ng-chess) (with min-max evaluating JavaScript AI)

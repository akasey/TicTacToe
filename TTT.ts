class TicTacToeRender {
    context:CanvasRenderingContext2D;
    tGame:TicTacToe;
    algorithm:NegaMax;
    constructor(_ctx:CanvasRenderingContext2D) {
        this.context = _ctx;
        me = 'x', turn='o';
        this.tGame = new TicTacToe(me,turn);
        this.algorithm = new NegaMax();
        this.draw();
        if (me==turn) {
            this.makeOurMove();
        }
    }

    theirTurn() {
        return this.tGame.whoseTurn != this.tGame.me;
    }

    makeOurMove() : any {
        var ret = this.algorithm.negamax(this.tGame, 10, "-Infinity", "Infinity");
        if (ret[1] == null) {
            return false;
        }
        else if (ret[1].data == "over") {
            return "Game Over";
        }
        this.tGame.makeMove(ret[1]);
        this.draw();
        return true;
    }

    handle(x:number, y:number):any {
        if (this.theirTurn()) {
            var idx = (y * 3) + x;
            var move = new Move(idx);
            if (this.tGame.isOver()) {
                return "Game Over";
            }
            else if (this.tGame.canMakeMove(move)) {
                this.tGame.makeMove(move);
                this.draw();
                return this.makeOurMove();
            }
            else {
                return "Not Blank";
            }
            return true;
        }
        return false;
    }

    draw() {
        this.context.clearRect(0, 0, canvas.width, canvas.height);
        var i = 0, x, y, pos;
        this.context.beginPath();
        for (; i < 2; i++) {
            x = 100 + 100*i;
            this.context.moveTo(x, 0);
            this.context.lineTo(x, 300);
        }
        for (i = 0; i < 2; i++) {
            y = 100 + 100*i;
            this.context.moveTo(0, y);
            this.context.lineTo(300, y);
        }

        this.context.strokeStyle = '#000000';
        this.context.stroke();
        this.context.closePath();

        pos = this.tGame.getPositions();
        for (i = 0; i < 9; i ++) {
            x = i % 3 | 0;
            y = i / 3 | 0;
            if (pos[i] === 'x') {
                this.drawX(x, y);
            } else if (pos[i] === 'o') {
                this.drawO(x, y);
            }
        }
    }

    drawX(cellX, cellY) {
        var i = 0, dx, dy;
        this.context.beginPath();
        for (i = 0; i < 2; i++) {
            dx = (cellX * 100) + 10 + (80*i);
            dy = (cellY * 100) + 10;
            this.context.moveTo(dx, dy);
            dx = (cellX * 100) + 90 - (80*i);
            dy = (cellY * 100) + 90;
            this.context.lineTo(dx, dy);
        }
        this.context.strokeStyle = '#ff0000';
        this.context.stroke();
        this.context.closePath();
    }

    drawO (cellX, cellY) {
        this.context.beginPath();
        this.context.arc(cellX*100 + 50,
                cellY*100 + 50,
                40, 0, 6.28, false);
        this.context.strokeStyle = '#00ff00';
        this.context.stroke();
        this.context.closePath();
    }
}

class Move {
    constructor(d:any) {
        this.data = d;
    }
    data:any;
}

interface Game {
    isOver(): boolean;
    getMoves(): Move[];
    makeMove(move:Move): void;
    unMakeMove(move:Move): void;
    getUtility():number;
    changePlayer():void;
}

class TicTacToe implements Game {
    positions:[string];
    me:string;
    whoseTurn:string;

    constructor(_me:string, _turn:string) {
        this.positions = ['','','','','','','','',''];
        this.me = _me;
        this.whoseTurn = _turn;
    }

    isOver(): boolean {
        return this.getUtility() != null
    }

    getMoves(): Move[] {
        var emptySpaces = this.locations('');
        var ret:Move[] = [];
        for (let e of emptySpaces) {
            var move:Move = new Move();
            move.data = e;
            ret.push(move);
        }
        return ret;
    }

    makeMove(move:Move) : void {
        this.positions[move.data] = this.whoseTurn;
        this.changePlayer();
    }

    unMakeMove(move:Move) : void {
        this.positions[move.data] = '';
        this.changePlayer();
    }

    changePlayer() : void {
        this.whoseTurn = this.whoseTurn=='x' ? 'o' : 'x';
    }

    locations(c:string):number[] {
        var ret:number[] = [];
        for (var i=0; i<9; i++) {
            if (this.positions[i] == c)
                ret.push(i);
        }
        return ret;
    }

    checkWinner(winPlaces:number[][], placesIn:number[]) {
        for (let win of winPlaces) {
            var allPresent:boolean = win.every(function(v) {
                return placesIn.indexOf(v) >=0;
            });
            if (allPresent) return true;
        }
        return false;
    }

    getUtility(): number {
        if (this.positions.indexOf('') < 0)
            return 0;

        var wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]];
        var placeX = this.locations('x');
        var placeO = this.locations('o');
        if (this.checkWinner(wins, placeX)) {
            if (this.whoseTurn=='x') return 1; else return -1;
        }
        else if (this.checkWinner(wins, placeO)) {
            if (this.whoseTurn=='o') return 1; else return -1;
        }
        else
            return null;
    }

    getPositions() : number[] {
        return this.positions;
    }

    canMakeMove(move:Move) : boolean {
        return this.positions[move.data]=='';
    }
}

class NegaMax {
    negamax(game:Game, depthLimit:number, alpha:number, beta:number):[number, Move] {
        if (game.isOver() || depthLimit == 0) {
            return [game.getUtility(), null];
        }
        var bestValue = "-Infinity";
        var bestMove = null;
        for (let move of game.getMoves()) {
            game.makeMove(move);
            var ret = this.negamax(game, depthLimit-1, -beta, -alpha);
            game.unMakeMove(move);
            if (ret[0]==null)
                continue;
            ret[0] = -ret[0];
            if (ret[0] > bestValue) {
                bestValue = ret[0];
                bestMove = move;
            }
            alpha = Math.max(bestValue, alpha);
            if (alpha >= beta)
                break;
        }
        return [bestValue, bestMove]
    }
}

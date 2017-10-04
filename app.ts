
window.onload = () => {
    var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
    var ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    var ttt:TicTacToeRender = new TicTacToeRender(ctx);
    var messageBoard = document.getElementById('game-msg');

    handleClick = (e) => {
        var x, y;
        x = e.offsetX / 100 | 0;
        y = e.offsetY / 100 | 0;
        var ret = ttt.handle(x,y);
        console.log("return", ret);
        if (typeof ret == 'string')
            messageBoard.innerHTML = ret;
        return true;
    }

    reset = () => {
        ttt = new TicTacToeRender(ctx);
        messageBoard.innerHTML = "";
    }

    canvas.addEventListener('click', handleClick, false);
}

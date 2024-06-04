import Animate from "./animate";
import Connect from "./connect";
import Board from "./board";
import Balloon from "./balloon";

interface IDataFromServer {
    board: Array<Array<string>>,
    balloons: Array<Balloon>
}

const connection: Connect = new Connect("ws://torvan-bomberman.ct8.pl:1984/sockets/server.php");
const socket: WebSocket = connection.getWebSocket();

const img = new Image();
img.src = "./res/spritesheet.png";

img.onload = function () {
    const gameBoard: Board = new Board(img);
    socket.onmessage = (ev: MessageEvent) => {
        if (ev.data != "") {
            const dataFromServer: IDataFromServer = JSON.parse(ev.data);
            gameBoard.setBoard(dataFromServer.board);
            gameBoard.setBalloonsBoard(dataFromServer.balloons);
        }
    }
}
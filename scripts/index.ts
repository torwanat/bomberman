import Connect from "./connect";
import Board from "./board";
import Balloon from "./balloon";
import Player from "./player";

interface IDataFromServer {
    board: Array<Array<string>>,
    balloons: Array<Balloon>
}

const connection: Connect = new Connect("ws://torvan-bomberman.ct8.pl:1984/sockets/server.php");
const socket: WebSocket = connection.getWebSocket();

const img = new Image();
img.src = "./res/spritesheet.png";

const playerId: number = 0;
const players: Array<Player> = [
    new Player(0, 0, 16 * 11, 16 * 5, true, false)
];

img.onload = function () {
    const gameBoard: Board = new Board(img);

    document.addEventListener("keydown", (e: KeyboardEvent) => {
        const key: string = e.key;
        if (key == "ArrowLeft" || key == "ArrowRight" || key == "ArrowUp" || key == "ArrowDown") {
            e.preventDefault();
            gameBoard.movePlayer(playerId, key);
        }
    });

    document.addEventListener("keyup", () => {
        gameBoard.stopPlayer(playerId);
    });

    socket.onmessage = (ev: MessageEvent) => {
        if (ev.data != "") {
            const dataFromServer: IDataFromServer = JSON.parse(ev.data);
            gameBoard.setBoard(dataFromServer.board);
            gameBoard.setBalloonsBoard(dataFromServer.balloons);
            gameBoard.setPlayersBoard(players);
        }
    }
}
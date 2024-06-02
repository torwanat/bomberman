import Canvas from "./canvas";
import data from "../res/data.json";
import Animate from "./animate";
import Connect from "./connect";

type Balloon = {
    id: number,
    direction: number,
    x: number,
    y: number,
    alive: boolean
}

interface IDataFromServer {
    board: Array<Array<string>>,
    balloons: Array<Balloon>
}

const drawBoard = (board: Array<Array<string>>) => {
    const boardAnimations: Array<Animate> = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            switch (board[i][j]) {
                case "W":
                    boardAnimations.push(new Animate(img, data.wall, data.dimensions, true, { "x": i * 16, "y": j * 16 }, w));
                    break;
                case "B":
                    boardAnimations.push(new Animate(img, data.bricks.solid, data.dimensions, true, { "x": i * 16, "y": j * 16 }, w));
                    break;
                default:
                    break;
            }
        }
    }
    return boardAnimations;
}

const drawBalloons = (balloons: Array<Balloon>) => {
    const balloonsAnimations: Array<Animate> = [];
    for (let i: number = 0; i < balloons.length; i++) {
        const balloon: Balloon = balloons[i];
        if (balloon.alive) {
            balloonsAnimations.push(new Animate(img, balloon.direction > 1 ? data.balloon.left : data.balloon.right, data.dimensions, true, { "x": balloon.x, "y": balloon.y }, w));
        } else {
            balloonsAnimations.push(new Animate(img, data.balloon.death, data.dimensions, false, { "x": balloon.x, "y": balloon.y }, w));
        }
    }
    return balloonsAnimations;
}

const connection: Connect = new Connect("ws://torvan-bomberman.ct8.pl:1984/sockets/server.php");
const socket: WebSocket = connection.getWebSocket();

const w: Canvas = new Canvas();
// w.drawWorld();

let boardAnimations: Array<Animate> = [];
let balloonsAnimations: Array<Animate> = [];
const img = new Image();
img.src = "./res/spritesheet.png";
Animate.incrementTick();

img.onload = function () {
    socket.onmessage = (ev: MessageEvent) => {
        if (ev.data != "") {
            const dataFromServer: IDataFromServer = JSON.parse(ev.data);
            boardAnimations = drawBoard(dataFromServer.board);
            balloonsAnimations = drawBalloons(dataFromServer.balloons);
            Animate.animations = boardAnimations.concat(balloonsAnimations);
        }
    }
}
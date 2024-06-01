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

const connection: Connect = new Connect("ws://torvan-bomberman.ct8.pl:1984/sockets/server.php");
const socket: WebSocket = connection.getWebSocket();

const w = new Canvas();
w.drawWorld();


const imgsArray: Animate[] = [];
const img = new Image();
img.src = "./res/spritesheet.png";
Animate.incrementTick();

img.onload = function () {
    socket.onmessage = (ev: MessageEvent) => {
        if (ev.data != "") {
            Animate.clearArrayAnimations(imgsArray);
            imgsArray.length = 0;
            const dataFromServer: IDataFromServer = JSON.parse(ev.data);
            const staticPropsBoard: Array<Array<string>> = dataFromServer.board;
            const balloons: Array<Balloon> = dataFromServer.balloons;
            for (let i = 0; i < staticPropsBoard.length; i++) {
                for (let j = 0; j < staticPropsBoard[i].length; j++) {
                    switch (staticPropsBoard[i][j]) {
                        case "W":
                            imgsArray.push(new Animate(img, data.wall, data.dimensions, true, { "x": i * 16, "y": j * 16 }, w));
                            break;
                        case "B":
                            imgsArray.push(new Animate(img, data.bricks.solid, data.dimensions, true, { "x": i * 16, "y": j * 16 }, w));
                            break;
                        default:
                            break;
                    }
                }
            }
            for (let i: number = 0; i < balloons.length; i++) {
                const balloon: Balloon = balloons[i];
                if (balloon.alive) {
                    imgsArray.push(new Animate(img, balloon.direction > 1 ? data.balloon.left : data.balloon.right, data.dimensions, true, { "x": balloon.x, "y": balloon.y }, w));
                } else {
                    imgsArray.push(new Animate(img, data.balloon.death, data.dimensions, false, { "x": balloon.x, "y": balloon.y }, w));
                }
            }
            Animate.animateArray(imgsArray);
        }
    }


}
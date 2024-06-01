import Canvas from "./canvas";
import data from "../res/data.json";
import Animate from "./animate";
import Connect from "./connect";

const anim = () => {
    for (let i = 0; i < imgsArray.length; i++) {
        imgsArray[i].startAnimation();
    }
    setTimeout(window.requestAnimationFrame, 1000 / 60, anim) // ~60 klatek/s
}

const connection: Connect = new Connect("ws://torvan-bomberman.ct8.pl:1984/sockets/server.php");
const socket: WebSocket = connection.getWebSocket();

const w = new Canvas();
w.drawWorld();

const imgsArray: Animate[] = [];
const img = new Image();
img.src = "./res/spritesheet.png";

img.onload = function () {
    socket.onmessage = (ev: MessageEvent) => {
        if (ev.data != "") {
            const board: Array<Array<string>> = JSON.parse(ev.data);
            console.log(board);
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    switch (board[i][j]) {
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
            anim();
        }
    }


}
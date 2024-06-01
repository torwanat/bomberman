import Canvas from "./canvas";
import data from "../res/data.json";
import Animate from "./animate";

const anim = () => {
    for (let i = 0; i < imgsArray.length; i++) {
        imgsArray[i].startAnimation();
    }
    setTimeout(window.requestAnimationFrame, 1000 / 60, anim) // ~60 klatek/s
}

const prepareStaticBoard = () => {
    const board: Array<Array<string>> = [];

    for (let i: number = 0; i < 33; i++) {
        board.push([]);
        for (let j: number = 0; j < 13; j++) {
            board[i][j] = "";
        }
    }



    for (let i: number = 0; i < 33; i++) {
        if (i == 0 || i == 32) {
            for (let j: number = 0; j < 13; j++) {
                board[i][j] = "W";
            }
        } else if (i % 2 == 0) {
            for (let j: number = 0; j < 13; j += 2) {
                board[i][j] = "W";
            }
        } else {
            board[i][0] = "W";
            board[i][12] = "W";
        }
    }

    let counter: number = 40;
    while (counter > 0) {
        const x = Math.floor(Math.random() * 32);
        const y = Math.floor(Math.random() * 12);

        if (board[x][y] == "") {
            board[x][y] = "B";
            counter--;
        }
    }

    return board;
}

const staticBoard: Array<Array<string>> = prepareStaticBoard();
console.log(staticBoard);


const w = new Canvas();
w.drawWorld();

const imgsArray: Animate[] = [];
const img = new Image();
img.src = "./res/spritesheet.png";

img.onload = function () {
    for (let i = 0; i < staticBoard.length; i++) {
        for (let j = 0; j < staticBoard[i].length; j++) {
            switch (staticBoard[i][j]) {
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
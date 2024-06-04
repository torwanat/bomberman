import Animate from "./animate";
import data from "../res/data.json";
import Canvas from "./canvas";
import Balloon from "./balloon";


export default class Board {
    private board: Array<Array<string>> = [];
    private balloonsBoard: Array<Balloon> = [];
    private canvas: Canvas;
    private img: CanvasImageSource;
    private animations: Array<Animate> = [];
    public currentTick: number = 0;

    constructor(img: CanvasImageSource) {
        this.canvas = new Canvas();
        this.img = img;
        this.incrementTick();
    }

    private incrementTick = () => {
        this.animations.forEach((e: Animate) => {
            e.startAnimation();
        });
        this.currentTick++;
        if (this.currentTick % 15 == 0) {
            this.moveBalloons();
        }
        setTimeout(window.requestAnimationFrame, 1000 / 60, this.incrementTick) // ~60 klatek/s
    }

    public setBoard(board: Array<Array<string>>) {
        this.board = board;
        this.updateAnimations();
    }

    public setBalloonsBoard(balloonsBoard: Array<Balloon>) {
        this.balloonsBoard = balloonsBoard;
        this.updateAnimations();
    }

    private updateAnimations() {
        this.animations = []

        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                switch (this.board[i][j]) {
                    case "W":
                        this.animations.push(new Animate(this.img, data.wall, data.dimensions, true, { "x": i * 16, "y": j * 16 }, this.canvas, this));
                        break;
                    case "B":
                        this.animations.push(new Animate(this.img, data.bricks.solid, data.dimensions, true, { "x": i * 16, "y": j * 16 }, this.canvas, this));
                        break;
                    default:
                        this.animations.push(new Animate(this.img, data.grass, data.dimensions, true, { "x": i * 16, "y": j * 16 }, this.canvas, this));
                        break;
                }
            }
        }

        for (let i: number = 0; i < this.balloonsBoard.length; i++) {
            const balloon: Balloon = this.balloonsBoard[i];
            if (balloon.alive) {
                this.animations.push(new Animate(this.img, balloon.direction > 1 ? data.balloon.left : data.balloon.right, data.dimensions, true, { "x": balloon.x, "y": balloon.y }, this.canvas, this));
            } else {
                this.animations.push(new Animate(this.img, data.balloon.death, data.dimensions, false, { "x": balloon.x, "y": balloon.y }, this.canvas, this));
            }
        }
    }

    private moveBalloons() {
        this.checkForCollisions();

        this.balloonsBoard.forEach((balloon: Balloon) => {
            if (balloon.collides) return;

            switch (balloon.direction) {
                case 0:
                    balloon.y++;
                    break;
                case 1:
                    balloon.x++;
                    break;
                case 2:
                    balloon.y--;
                    break;
                case 3:
                    balloon.x--;
                    break;
                default:
                    break;
            }
        });

        this.updateAnimations();
    }

    private checkForCollisions() {
        this.balloonsBoard.forEach((balloon: Balloon) => {
            let positionX: number = Math.floor(balloon.x / 16);
            let positionY: number = Math.floor(balloon.y / 16);

            if (positionX != balloon.x / 16 || positionY != balloon.y / 16) return;

            switch (balloon.direction) {
                case 0:
                    positionY++;
                    break;
                case 1:
                    positionX++;
                    break;
                case 2:
                    positionY--;
                    break;
                case 3:
                    positionX--;
                    break;
                default:
                    break;
            }

            balloon.collides = false;

            if (this.board[positionX][positionY] == "W" || this.board[positionX][positionY] == "B") {
                balloon.collides = true;
                balloon.direction = balloon.direction == 0 ? 3 : balloon.direction--;
            }
        });
    }
}
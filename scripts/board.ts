import Animate from "./animate";
import data from "../res/data.json";
import Canvas from "./canvas";
import Balloon from "./balloon";
import Player from "./player";


export default class Board {
    private board: Array<Array<string>> = [];
    private balloonsBoard: Array<Balloon> = [];
    private playersBoard: Array<Player> = [];
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
        if (this.currentTick % 2 == 0) {
            this.moveBalloons();
        }
        this.movePlayers();
        setTimeout(window.requestAnimationFrame, 1000 / 20, this.incrementTick) // ~60 klatek/s
    }

    public setBoard(board: Array<Array<string>>) {
        this.board = board;
        this.updateAnimations();
    }

    public setBalloonsBoard(balloonsBoard: Array<Balloon>) {
        this.balloonsBoard = balloonsBoard;
        this.updateAnimations();
    }

    public setPlayersBoard(playersBoard: Array<Player>) {
        this.playersBoard = playersBoard;
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

        for (let i: number = 0; i < this.playersBoard.length; i++) {
            const player: Player = this.playersBoard[i];
            if (player.moving) {
                let facing;
                switch (player.direction) {
                    case 0:
                        facing = data.player.down;
                        break;
                    case 1:
                        facing = data.player.right;
                        break;
                    case 2:
                        facing = data.player.up;
                        break;
                    case 3:
                        facing = data.player.left;
                        break;
                    default:
                        break;
                }
                this.animations.push(new Animate(this.img, facing!, data.dimensions, true, { "x": player.x, "y": player.y }, this.canvas, this));
            } else if (!player.alive) {
                this.animations.push(new Animate(this.img, data.player.death, data.dimensions, false, { "x": player.x, "y": player.y }, this.canvas, this));
            } else {
                this.animations.push(new Animate(this.img, data.player.stop, data.dimensions, true, { "x": player.x, "y": player.y }, this.canvas, this));
            }
        }
    }

    private moveBalloons() {
        this.checkForCollisions();

        this.balloonsBoard.forEach((balloon: Balloon) => {
            if (balloon.collides) return;

            switch (balloon.direction) {
                case 0:
                    balloon.y += 1;
                    break;
                case 1:
                    balloon.x += 1;
                    break;
                case 2:
                    balloon.y -= 1;
                    break;
                case 3:
                    balloon.x -= 1;
                    break;
                default:
                    break;
            }
        });

        this.updateAnimations();
    }

    private movePlayers() {
        for (let i = 0; i < this.playersBoard.length; i++) {
            const player = this.playersBoard[i];
            if (player.moving) {
                this.movePlayer(player);
            }
        }
    }

    public movePlayer(player: Player) {
        let positionX: number = Math.round(player.x / 16);
        let positionY: number = Math.round(player.y / 16);

        switch (player.direction) {
            case 0:
                positionY += 1;
                break;
            case 1:
                positionX += 1;
                break;
            case 2:
                positionY -= 1;
                break;
            case 3:
                positionX -= 1;
                break;
            default:
                break;
        }

        switch (player.direction) {
            case 0:
            case 2:
                if ((this.board[positionX][positionY] == "W" || this.board[positionX][positionY] == "B") && player.y % 16 == 0) {
                    player.collides = true;
                } else {
                    player.x = Math.round(player.x / 16) * 16;
                    player.direction == 0 ? player.y += 1 : player.y -= 1;
                }
                break;
            case 1:
            case 3:
                if ((this.board[positionX][positionY] == "W" || this.board[positionX][positionY] == "B") && player.x % 16 == 0) {
                    player.collides = true;
                } else {
                    player.y = Math.round(player.y / 16) * 16;
                    player.direction == 1 ? player.x += 1 : player.x -= 1;
                }
                break;
            default:
                break;
        }
    }

    public startPlayer(id: number, key: string) {
        for (let i = 0; i < this.playersBoard.length; i++) {
            const player = this.playersBoard[i];
            if (player.id == id) {
                player.moving = true;
                switch (key) {
                    case "ArrowDown":
                        player.direction = 0;
                        break;
                    case "ArrowRight":
                        player.direction = 1;
                        break;
                    case "ArrowUp":
                        player.direction = 2;
                        break;
                    case "ArrowLeft":
                        player.direction = 3;
                        break;
                    default:
                        break;
                }
                break;
            }
        }
        this.updateAnimations()
    }

    public stopPlayer(id: number) {
        for (let i = 0; i < this.playersBoard.length; i++) {
            const player = this.playersBoard[i];
            if (player.id == id) {
                player.moving = false;
                break;
            }
        }
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

            if (balloon.wait == 0) {
                balloon.collides = false;
            } else {
                balloon.wait--;
            }

            if (this.board[positionX][positionY] == "W" || this.board[positionX][positionY] == "B") {
                balloon.collides = true;
                balloon.wait += 16;
                balloon.direction = balloon.direction == 0 ? 3 : balloon.direction--;
            }
        });
    }
}
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./scripts/animate.ts":
/*!****************************!*\
  !*** ./scripts/animate.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Animate {
    constructor(img, instructions, dimensions, repeat, coordinates, canvas, board) {
        this.spritesheet = img;
        this.frames = instructions.frames;
        this.times = instructions.times;
        this.dimensions = dimensions;
        this.repeat = repeat;
        this.coordinates = coordinates;
        this.canvas = canvas;
        this.board = board;
    }
    startAnimation() {
        const currentFrame = Math.floor((this.board.currentTick / this.times[0]) % this.times.length);
        this.renderFrame(currentFrame);
    }
    renderFrame(frameNumber) {
        this.canvas.getCanvasContext().drawImage(this.spritesheet, this.frames[frameNumber].x0, this.frames[frameNumber].y0, this.dimensions.width, this.dimensions.height, this.coordinates.x, this.coordinates.y, this.dimensions.width, this.dimensions.height);
    }
}
exports["default"] = Animate;


/***/ }),

/***/ "./scripts/board.ts":
/*!**************************!*\
  !*** ./scripts/board.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const animate_1 = __importDefault(__webpack_require__(/*! ./animate */ "./scripts/animate.ts"));
const data_json_1 = __importDefault(__webpack_require__(/*! ../res/data.json */ "./res/data.json"));
const canvas_1 = __importDefault(__webpack_require__(/*! ./canvas */ "./scripts/canvas.ts"));
class Board {
    constructor(img) {
        this.board = [];
        this.balloonsBoard = [];
        this.playersBoard = [];
        this.animations = [];
        this.currentTick = 0;
        this.incrementTick = () => {
            this.animations.forEach((e) => {
                e.startAnimation();
            });
            this.currentTick++;
            if (this.currentTick % 2 == 0) {
                this.moveBalloons();
            }
            this.movePlayers();
            setTimeout(window.requestAnimationFrame, 1000 / 20, this.incrementTick); // ~60 klatek/s
        };
        this.canvas = new canvas_1.default();
        this.img = img;
        this.incrementTick();
    }
    setBoard(board) {
        this.board = board;
        this.updateAnimations();
    }
    setBalloonsBoard(balloonsBoard) {
        this.balloonsBoard = balloonsBoard;
        this.updateAnimations();
    }
    setPlayersBoard(playersBoard) {
        this.playersBoard = playersBoard;
        this.updateAnimations();
    }
    updateAnimations() {
        this.animations = [];
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                switch (this.board[i][j]) {
                    case "W":
                        this.animations.push(new animate_1.default(this.img, data_json_1.default.wall, data_json_1.default.dimensions, true, { "x": i * 16, "y": j * 16 }, this.canvas, this));
                        break;
                    case "B":
                        this.animations.push(new animate_1.default(this.img, data_json_1.default.bricks.solid, data_json_1.default.dimensions, true, { "x": i * 16, "y": j * 16 }, this.canvas, this));
                        break;
                    default:
                        this.animations.push(new animate_1.default(this.img, data_json_1.default.grass, data_json_1.default.dimensions, true, { "x": i * 16, "y": j * 16 }, this.canvas, this));
                        break;
                }
            }
        }
        for (let i = 0; i < this.balloonsBoard.length; i++) {
            const balloon = this.balloonsBoard[i];
            if (balloon.alive) {
                this.animations.push(new animate_1.default(this.img, balloon.direction > 1 ? data_json_1.default.balloon.left : data_json_1.default.balloon.right, data_json_1.default.dimensions, true, { "x": balloon.x, "y": balloon.y }, this.canvas, this));
            }
            else {
                this.animations.push(new animate_1.default(this.img, data_json_1.default.balloon.death, data_json_1.default.dimensions, false, { "x": balloon.x, "y": balloon.y }, this.canvas, this));
            }
        }
        for (let i = 0; i < this.playersBoard.length; i++) {
            const player = this.playersBoard[i];
            if (player.moving) {
                let facing;
                switch (player.direction) {
                    case 0:
                        facing = data_json_1.default.player.down;
                        break;
                    case 1:
                        facing = data_json_1.default.player.right;
                        break;
                    case 2:
                        facing = data_json_1.default.player.up;
                        break;
                    case 3:
                        facing = data_json_1.default.player.left;
                        break;
                    default:
                        break;
                }
                this.animations.push(new animate_1.default(this.img, facing, data_json_1.default.dimensions, true, { "x": player.x, "y": player.y }, this.canvas, this));
            }
            else if (!player.alive) {
                this.animations.push(new animate_1.default(this.img, data_json_1.default.player.death, data_json_1.default.dimensions, false, { "x": player.x, "y": player.y }, this.canvas, this));
            }
            else {
                this.animations.push(new animate_1.default(this.img, data_json_1.default.player.stop, data_json_1.default.dimensions, true, { "x": player.x, "y": player.y }, this.canvas, this));
            }
        }
    }
    moveBalloons() {
        this.checkForCollisions();
        this.balloonsBoard.forEach((balloon) => {
            if (balloon.collides)
                return;
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
    movePlayers() {
        for (let i = 0; i < this.playersBoard.length; i++) {
            const player = this.playersBoard[i];
            if (player.moving) {
                this.movePlayer(player);
            }
        }
    }
    movePlayer(player) {
        let positionX = Math.round(player.x / 16);
        let positionY = Math.round(player.y / 16);
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
                }
                else {
                    player.x = Math.round(player.x / 16) * 16;
                    player.direction == 0 ? player.y += 1 : player.y -= 1;
                }
                break;
            case 1:
            case 3:
                if ((this.board[positionX][positionY] == "W" || this.board[positionX][positionY] == "B") && player.x % 16 == 0) {
                    player.collides = true;
                }
                else {
                    player.y = Math.round(player.y / 16) * 16;
                    player.direction == 1 ? player.x += 1 : player.x -= 1;
                }
                break;
            default:
                break;
        }
    }
    startPlayer(id, key) {
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
        this.updateAnimations();
    }
    stopPlayer(id) {
        for (let i = 0; i < this.playersBoard.length; i++) {
            const player = this.playersBoard[i];
            if (player.id == id) {
                player.moving = false;
                break;
            }
        }
    }
    checkForCollisions() {
        this.balloonsBoard.forEach((balloon) => {
            let positionX = Math.floor(balloon.x / 16);
            let positionY = Math.floor(balloon.y / 16);
            if (positionX != balloon.x / 16 || positionY != balloon.y / 16)
                return;
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
            }
            else {
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
exports["default"] = Board;


/***/ }),

/***/ "./scripts/canvas.ts":
/*!***************************!*\
  !*** ./scripts/canvas.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Canvas {
    constructor() {
        this.CELL_SIZE = 16;
        this.CANVAS_WIDTH = 33 * this.CELL_SIZE;
        this.CANVAS_HEIGHT = 13 * this.CELL_SIZE;
        this.createCanvas();
    }
    createCanvas() {
        this.canvas = document.createElement("canvas");
        this.canvas.className = "main-canvas";
        this.canvas.width = this.CANVAS_WIDTH;
        this.canvas.height = this.CANVAS_HEIGHT;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        document.getElementById("main-container").appendChild(this.canvas);
    }
    clearCanvas() {
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    }
    drawWorld() {
        this.ctx.beginPath();
        // first draw rows
        for (let x = 0; x < this.CANVAS_WIDTH + 1; x++) {
            this.ctx.moveTo(this.CELL_SIZE * x, 0);
            // this will draw the line
            this.ctx.lineTo(this.CELL_SIZE * x, this.CANVAS_WIDTH * this.CELL_SIZE);
        }
        for (let y = 0; y < this.CANVAS_WIDTH + 1; y++) {
            this.ctx.moveTo(0, this.CELL_SIZE * y);
            this.ctx.lineTo(this.CANVAS_WIDTH * this.CELL_SIZE, this.CELL_SIZE * y);
        }
        this.ctx.stroke();
    }
    getCanvasContext() {
        return this.ctx;
    }
}
exports["default"] = Canvas;


/***/ }),

/***/ "./scripts/connect.ts":
/*!****************************!*\
  !*** ./scripts/connect.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Connect {
    constructor(uri) {
        this.websocket = new WebSocket(uri);
        this.init();
    }
    init() {
        this.websocket.onopen = () => {
            console.log("open");
        };
        this.websocket.onerror = (ev) => {
            console.log(ev);
        };
    }
    getWebSocket() {
        return this.websocket;
    }
}
exports["default"] = Connect;


/***/ }),

/***/ "./scripts/index.ts":
/*!**************************!*\
  !*** ./scripts/index.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const connect_1 = __importDefault(__webpack_require__(/*! ./connect */ "./scripts/connect.ts"));
const board_1 = __importDefault(__webpack_require__(/*! ./board */ "./scripts/board.ts"));
const player_1 = __importDefault(__webpack_require__(/*! ./player */ "./scripts/player.ts"));
const connection = new connect_1.default("ws://torvan-bomberman.ct8.pl:1984/sockets/server.php");
const socket = connection.getWebSocket();
const img = new Image();
img.src = "./res/spritesheet.png";
const playerId = 0;
const players = [
    new player_1.default(0, 0, 16 * 11, 16 * 5, true, false)
];
img.onload = function () {
    const gameBoard = new board_1.default(img);
    document.addEventListener("keydown", (e) => {
        const key = e.key;
        if (key == "ArrowLeft" || key == "ArrowRight" || key == "ArrowUp" || key == "ArrowDown") {
            e.preventDefault();
            gameBoard.startPlayer(playerId, key);
        }
    });
    document.addEventListener("keyup", () => {
        gameBoard.stopPlayer(playerId);
    });
    socket.onmessage = (ev) => {
        if (ev.data != "") {
            const dataFromServer = JSON.parse(ev.data);
            gameBoard.setBoard(dataFromServer.board);
            gameBoard.setBalloonsBoard(dataFromServer.balloons);
            gameBoard.setPlayersBoard(players);
        }
    };
};


/***/ }),

/***/ "./scripts/player.ts":
/*!***************************!*\
  !*** ./scripts/player.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Player {
    constructor(id, direction, x, y, alive, moving) {
        this.collides = false;
        this.id = id;
        this.direction = direction;
        this.x = x;
        this.y = y;
        this.alive = alive;
        this.moving = moving;
    }
}
exports["default"] = Player;


/***/ }),

/***/ "./res/data.json":
/*!***********************!*\
  !*** ./res/data.json ***!
  \***********************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"dimensions":{"width":16,"height":16},"player":{"left":{"frames":[{"x0":0,"y0":0},{"x0":16,"y0":0},{"x0":32,"y0":0}],"times":[5,5,5]},"right":{"frames":[{"x0":0,"y0":16},{"x0":16,"y0":16},{"x0":32,"y0":16}],"times":[5,5,5]},"up":{"frames":[{"x0":48,"y0":16},{"x0":64,"y0":16},{"x0":80,"y0":16}],"times":[5,5,5]},"down":{"frames":[{"x0":48,"y0":0},{"x0":64,"y0":0},{"x0":80,"y0":0}],"times":[5,5,5]},"stop":{"frames":[{"x0":48,"y0":0}],"times":[30]},"death":{"frames":[{"x0":0,"y0":32},{"x0":16,"y0":32},{"x0":32,"y0":32},{"x0":48,"y0":32},{"x0":64,"y0":32},{"x0":80,"y0":32},{"x0":96,"y0":32}],"times":[5,5,5,5,5,5,5]}},"bomb":{"charge":{"frames":[{"x0":0,"y0":48},{"x0":16,"y0":48},{"x0":32,"y0":48}],"times":[30,30,30]},"explosion":{}},"wall":{"frames":[{"x0":48,"y0":48}],"times":[30]},"bricks":{"solid":{"frames":[{"x0":64,"y0":48}],"times":[30]},"destruction":{"frames":[{"x0":80,"y0":48},{"x0":96,"y0":48},{"x0":112,"y0":48},{"x0":128,"y0":48},{"x0":144,"y0":48},{"x0":160,"y0":48}],"times":[30,30,30,30,30,30]}},"balloon":{"left":{"frames":[{"x0":48,"y0":240},{"x0":64,"y0":240},{"x0":80,"y0":240}],"times":[10,10,10]},"right":{"frames":[{"x0":0,"y0":240},{"x0":16,"y0":240},{"x0":32,"y0":240}],"times":[10,10,10]},"death":{"frames":[{"x0":96,"y0":240},{"x0":112,"y0":240},{"x0":128,"y0":240},{"x0":144,"y0":240}],"times":[10,10,10,10]}},"powerup":{"frames":[{"x0":0,"y0":224}],"times":[30]},"grass":{"frames":[{"x0":0,"y0":64}],"times":[30]}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./scripts/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFlOzs7Ozs7Ozs7OztBQ3JCRjtBQUNiO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGtDQUFrQyxtQkFBTyxDQUFDLHVDQUFXO0FBQ3JELG9DQUFvQyxtQkFBTyxDQUFDLHlDQUFrQjtBQUM5RCxpQ0FBaUMsbUJBQU8sQ0FBQyxxQ0FBVTtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUZBQXFGO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQyw0QkFBNEIsMEJBQTBCO0FBQ3REO0FBQ0E7QUFDQSwrSUFBK0ksMEJBQTBCO0FBQ3pLO0FBQ0E7QUFDQSx1SkFBdUosMEJBQTBCO0FBQ2pMO0FBQ0E7QUFDQSxnSkFBZ0osMEJBQTBCO0FBQzFLO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLCtCQUErQjtBQUN2RDtBQUNBO0FBQ0EsMk1BQTJNLGdDQUFnQztBQUMzTztBQUNBO0FBQ0EsaUpBQWlKLGdDQUFnQztBQUNqTDtBQUNBO0FBQ0Esd0JBQXdCLDhCQUE4QjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFIQUFxSCw4QkFBOEI7QUFDbko7QUFDQTtBQUNBLGdKQUFnSiw4QkFBOEI7QUFDOUs7QUFDQTtBQUNBLDhJQUE4SSw4QkFBOEI7QUFDNUs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw4QkFBOEI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDhCQUE4QjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw4QkFBOEI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLGtCQUFlOzs7Ozs7Ozs7OztBQ3JQRjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMkJBQTJCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDJCQUEyQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBZTs7Ozs7Ozs7Ozs7QUN6Q0Y7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFlOzs7Ozs7Ozs7OztBQ25CRjtBQUNiO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGtDQUFrQyxtQkFBTyxDQUFDLHVDQUFXO0FBQ3JELGdDQUFnQyxtQkFBTyxDQUFDLG1DQUFTO0FBQ2pELGlDQUFpQyxtQkFBTyxDQUFDLHFDQUFVO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3BDYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7O1VDYmY7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NjcmlwdHMvYW5pbWF0ZS50cyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2JvYXJkLnRzIiwid2VicGFjazovLy8uL3NjcmlwdHMvY2FudmFzLnRzIiwid2VicGFjazovLy8uL3NjcmlwdHMvY29ubmVjdC50cyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NjcmlwdHMvcGxheWVyLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBBbmltYXRlIHtcbiAgICBjb25zdHJ1Y3RvcihpbWcsIGluc3RydWN0aW9ucywgZGltZW5zaW9ucywgcmVwZWF0LCBjb29yZGluYXRlcywgY2FudmFzLCBib2FyZCkge1xuICAgICAgICB0aGlzLnNwcml0ZXNoZWV0ID0gaW1nO1xuICAgICAgICB0aGlzLmZyYW1lcyA9IGluc3RydWN0aW9ucy5mcmFtZXM7XG4gICAgICAgIHRoaXMudGltZXMgPSBpbnN0cnVjdGlvbnMudGltZXM7XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XG4gICAgICAgIHRoaXMucmVwZWF0ID0gcmVwZWF0O1xuICAgICAgICB0aGlzLmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgICAgICB0aGlzLmJvYXJkID0gYm9hcmQ7XG4gICAgfVxuICAgIHN0YXJ0QW5pbWF0aW9uKCkge1xuICAgICAgICBjb25zdCBjdXJyZW50RnJhbWUgPSBNYXRoLmZsb29yKCh0aGlzLmJvYXJkLmN1cnJlbnRUaWNrIC8gdGhpcy50aW1lc1swXSkgJSB0aGlzLnRpbWVzLmxlbmd0aCk7XG4gICAgICAgIHRoaXMucmVuZGVyRnJhbWUoY3VycmVudEZyYW1lKTtcbiAgICB9XG4gICAgcmVuZGVyRnJhbWUoZnJhbWVOdW1iZXIpIHtcbiAgICAgICAgdGhpcy5jYW52YXMuZ2V0Q2FudmFzQ29udGV4dCgpLmRyYXdJbWFnZSh0aGlzLnNwcml0ZXNoZWV0LCB0aGlzLmZyYW1lc1tmcmFtZU51bWJlcl0ueDAsIHRoaXMuZnJhbWVzW2ZyYW1lTnVtYmVyXS55MCwgdGhpcy5kaW1lbnNpb25zLndpZHRoLCB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0LCB0aGlzLmNvb3JkaW5hdGVzLngsIHRoaXMuY29vcmRpbmF0ZXMueSwgdGhpcy5kaW1lbnNpb25zLndpZHRoLCB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0KTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBBbmltYXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhbmltYXRlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vYW5pbWF0ZVwiKSk7XG5jb25zdCBkYXRhX2pzb25fMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vcmVzL2RhdGEuanNvblwiKSk7XG5jb25zdCBjYW52YXNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9jYW52YXNcIikpO1xuY2xhc3MgQm9hcmQge1xuICAgIGNvbnN0cnVjdG9yKGltZykge1xuICAgICAgICB0aGlzLmJvYXJkID0gW107XG4gICAgICAgIHRoaXMuYmFsbG9vbnNCb2FyZCA9IFtdO1xuICAgICAgICB0aGlzLnBsYXllcnNCb2FyZCA9IFtdO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbnMgPSBbXTtcbiAgICAgICAgdGhpcy5jdXJyZW50VGljayA9IDA7XG4gICAgICAgIHRoaXMuaW5jcmVtZW50VGljayA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5mb3JFYWNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5zdGFydEFuaW1hdGlvbigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUaWNrKys7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50VGljayAlIDIgPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZUJhbGxvb25zKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm1vdmVQbGF5ZXJzKCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUsIDEwMDAgLyAyMCwgdGhpcy5pbmNyZW1lbnRUaWNrKTsgLy8gfjYwIGtsYXRlay9zXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2FudmFzID0gbmV3IGNhbnZhc18xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5pbWcgPSBpbWc7XG4gICAgICAgIHRoaXMuaW5jcmVtZW50VGljaygpO1xuICAgIH1cbiAgICBzZXRCb2FyZChib2FyZCkge1xuICAgICAgICB0aGlzLmJvYXJkID0gYm9hcmQ7XG4gICAgICAgIHRoaXMudXBkYXRlQW5pbWF0aW9ucygpO1xuICAgIH1cbiAgICBzZXRCYWxsb29uc0JvYXJkKGJhbGxvb25zQm9hcmQpIHtcbiAgICAgICAgdGhpcy5iYWxsb29uc0JvYXJkID0gYmFsbG9vbnNCb2FyZDtcbiAgICAgICAgdGhpcy51cGRhdGVBbmltYXRpb25zKCk7XG4gICAgfVxuICAgIHNldFBsYXllcnNCb2FyZChwbGF5ZXJzQm9hcmQpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJzQm9hcmQgPSBwbGF5ZXJzQm9hcmQ7XG4gICAgICAgIHRoaXMudXBkYXRlQW5pbWF0aW9ucygpO1xuICAgIH1cbiAgICB1cGRhdGVBbmltYXRpb25zKCkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuYm9hcmRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMuYm9hcmRbaV1bal0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIldcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdCh0aGlzLmltZywgZGF0YV9qc29uXzEuZGVmYXVsdC53YWxsLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IGkgKiAxNiwgXCJ5XCI6IGogKiAxNiB9LCB0aGlzLmNhbnZhcywgdGhpcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJCXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQodGhpcy5pbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQuYnJpY2tzLnNvbGlkLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IGkgKiAxNiwgXCJ5XCI6IGogKiAxNiB9LCB0aGlzLmNhbnZhcywgdGhpcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQodGhpcy5pbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQuZ3Jhc3MsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgdHJ1ZSwgeyBcInhcIjogaSAqIDE2LCBcInlcIjogaiAqIDE2IH0sIHRoaXMuY2FudmFzLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJhbGxvb25zQm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGJhbGxvb24gPSB0aGlzLmJhbGxvb25zQm9hcmRbaV07XG4gICAgICAgICAgICBpZiAoYmFsbG9vbi5hbGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdCh0aGlzLmltZywgYmFsbG9vbi5kaXJlY3Rpb24gPiAxID8gZGF0YV9qc29uXzEuZGVmYXVsdC5iYWxsb29uLmxlZnQgOiBkYXRhX2pzb25fMS5kZWZhdWx0LmJhbGxvb24ucmlnaHQsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgdHJ1ZSwgeyBcInhcIjogYmFsbG9vbi54LCBcInlcIjogYmFsbG9vbi55IH0sIHRoaXMuY2FudmFzLCB0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQodGhpcy5pbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQuYmFsbG9vbi5kZWF0aCwgZGF0YV9qc29uXzEuZGVmYXVsdC5kaW1lbnNpb25zLCBmYWxzZSwgeyBcInhcIjogYmFsbG9vbi54LCBcInlcIjogYmFsbG9vbi55IH0sIHRoaXMuY2FudmFzLCB0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnNCb2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy5wbGF5ZXJzQm9hcmRbaV07XG4gICAgICAgICAgICBpZiAocGxheWVyLm1vdmluZykge1xuICAgICAgICAgICAgICAgIGxldCBmYWNpbmc7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChwbGF5ZXIuZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2luZyA9IGRhdGFfanNvbl8xLmRlZmF1bHQucGxheWVyLmRvd247XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjaW5nID0gZGF0YV9qc29uXzEuZGVmYXVsdC5wbGF5ZXIucmlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjaW5nID0gZGF0YV9qc29uXzEuZGVmYXVsdC5wbGF5ZXIudXA7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjaW5nID0gZGF0YV9qc29uXzEuZGVmYXVsdC5wbGF5ZXIubGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdCh0aGlzLmltZywgZmFjaW5nLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IHBsYXllci54LCBcInlcIjogcGxheWVyLnkgfSwgdGhpcy5jYW52YXMsIHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCFwbGF5ZXIuYWxpdmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQodGhpcy5pbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQucGxheWVyLmRlYXRoLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIGZhbHNlLCB7IFwieFwiOiBwbGF5ZXIueCwgXCJ5XCI6IHBsYXllci55IH0sIHRoaXMuY2FudmFzLCB0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQodGhpcy5pbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQucGxheWVyLnN0b3AsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgdHJ1ZSwgeyBcInhcIjogcGxheWVyLngsIFwieVwiOiBwbGF5ZXIueSB9LCB0aGlzLmNhbnZhcywgdGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIG1vdmVCYWxsb29ucygpIHtcbiAgICAgICAgdGhpcy5jaGVja0ZvckNvbGxpc2lvbnMoKTtcbiAgICAgICAgdGhpcy5iYWxsb29uc0JvYXJkLmZvckVhY2goKGJhbGxvb24pID0+IHtcbiAgICAgICAgICAgIGlmIChiYWxsb29uLmNvbGxpZGVzKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHN3aXRjaCAoYmFsbG9vbi5kaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIGJhbGxvb24ueSArPSAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGJhbGxvb24ueCArPSAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIGJhbGxvb24ueSAtPSAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIGJhbGxvb24ueCAtPSAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlQW5pbWF0aW9ucygpO1xuICAgIH1cbiAgICBtb3ZlUGxheWVycygpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnNCb2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy5wbGF5ZXJzQm9hcmRbaV07XG4gICAgICAgICAgICBpZiAocGxheWVyLm1vdmluZykge1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZVBsYXllcihwbGF5ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIG1vdmVQbGF5ZXIocGxheWVyKSB7XG4gICAgICAgIGxldCBwb3NpdGlvblggPSBNYXRoLnJvdW5kKHBsYXllci54IC8gMTYpO1xuICAgICAgICBsZXQgcG9zaXRpb25ZID0gTWF0aC5yb3VuZChwbGF5ZXIueSAvIDE2KTtcbiAgICAgICAgc3dpdGNoIChwbGF5ZXIuZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgcG9zaXRpb25ZICs9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcG9zaXRpb25YICs9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcG9zaXRpb25ZIC09IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgcG9zaXRpb25YIC09IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAocGxheWVyLmRpcmVjdGlvbikge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGlmICgodGhpcy5ib2FyZFtwb3NpdGlvblhdW3Bvc2l0aW9uWV0gPT0gXCJXXCIgfHwgdGhpcy5ib2FyZFtwb3NpdGlvblhdW3Bvc2l0aW9uWV0gPT0gXCJCXCIpICYmIHBsYXllci55ICUgMTYgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuY29sbGlkZXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnggPSBNYXRoLnJvdW5kKHBsYXllci54IC8gMTYpICogMTY7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5kaXJlY3Rpb24gPT0gMCA/IHBsYXllci55ICs9IDEgOiBwbGF5ZXIueSAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBpZiAoKHRoaXMuYm9hcmRbcG9zaXRpb25YXVtwb3NpdGlvblldID09IFwiV1wiIHx8IHRoaXMuYm9hcmRbcG9zaXRpb25YXVtwb3NpdGlvblldID09IFwiQlwiKSAmJiBwbGF5ZXIueCAlIDE2ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmNvbGxpZGVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci55ID0gTWF0aC5yb3VuZChwbGF5ZXIueSAvIDE2KSAqIDE2O1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZGlyZWN0aW9uID09IDEgPyBwbGF5ZXIueCArPSAxIDogcGxheWVyLnggLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXJ0UGxheWVyKGlkLCBrZXkpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnNCb2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy5wbGF5ZXJzQm9hcmRbaV07XG4gICAgICAgICAgICBpZiAocGxheWVyLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLm1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkFycm93RG93blwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmRpcmVjdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkFycm93UmlnaHRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5kaXJlY3Rpb24gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJBcnJvd1VwXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZGlyZWN0aW9uID0gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dMZWZ0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZGlyZWN0aW9uID0gMztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlQW5pbWF0aW9ucygpO1xuICAgIH1cbiAgICBzdG9wUGxheWVyKGlkKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzQm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMucGxheWVyc0JvYXJkW2ldO1xuICAgICAgICAgICAgaWYgKHBsYXllci5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgIHBsYXllci5tb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGVja0ZvckNvbGxpc2lvbnMoKSB7XG4gICAgICAgIHRoaXMuYmFsbG9vbnNCb2FyZC5mb3JFYWNoKChiYWxsb29uKSA9PiB7XG4gICAgICAgICAgICBsZXQgcG9zaXRpb25YID0gTWF0aC5mbG9vcihiYWxsb29uLnggLyAxNik7XG4gICAgICAgICAgICBsZXQgcG9zaXRpb25ZID0gTWF0aC5mbG9vcihiYWxsb29uLnkgLyAxNik7XG4gICAgICAgICAgICBpZiAocG9zaXRpb25YICE9IGJhbGxvb24ueCAvIDE2IHx8IHBvc2l0aW9uWSAhPSBiYWxsb29uLnkgLyAxNilcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBzd2l0Y2ggKGJhbGxvb24uZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblkrKztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblgrKztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblktLTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblgtLTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmFsbG9vbi53YWl0ID09IDApIHtcbiAgICAgICAgICAgICAgICBiYWxsb29uLmNvbGxpZGVzID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBiYWxsb29uLndhaXQtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3Bvc2l0aW9uWF1bcG9zaXRpb25ZXSA9PSBcIldcIiB8fCB0aGlzLmJvYXJkW3Bvc2l0aW9uWF1bcG9zaXRpb25ZXSA9PSBcIkJcIikge1xuICAgICAgICAgICAgICAgIGJhbGxvb24uY29sbGlkZXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJhbGxvb24ud2FpdCArPSAxNjtcbiAgICAgICAgICAgICAgICBiYWxsb29uLmRpcmVjdGlvbiA9IGJhbGxvb24uZGlyZWN0aW9uID09IDAgPyAzIDogYmFsbG9vbi5kaXJlY3Rpb24tLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gQm9hcmQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIENhbnZhcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuQ0VMTF9TSVpFID0gMTY7XG4gICAgICAgIHRoaXMuQ0FOVkFTX1dJRFRIID0gMzMgKiB0aGlzLkNFTExfU0laRTtcbiAgICAgICAgdGhpcy5DQU5WQVNfSEVJR0hUID0gMTMgKiB0aGlzLkNFTExfU0laRTtcbiAgICAgICAgdGhpcy5jcmVhdGVDYW52YXMoKTtcbiAgICB9XG4gICAgY3JlYXRlQ2FudmFzKCkge1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgIHRoaXMuY2FudmFzLmNsYXNzTmFtZSA9IFwibWFpbi1jYW52YXNcIjtcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLkNBTlZBU19XSURUSDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5DQU5WQVNfSEVJR0hUO1xuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJncmVlblwiO1xuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLkNBTlZBU19XSURUSCwgdGhpcy5DQU5WQVNfSEVJR0hUKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluLWNvbnRhaW5lclwiKS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gICAgfVxuICAgIGNsZWFyQ2FudmFzKCkge1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBcImdyZWVuXCI7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuQ0FOVkFTX1dJRFRILCB0aGlzLkNBTlZBU19IRUlHSFQpO1xuICAgIH1cbiAgICBkcmF3V29ybGQoKSB7XG4gICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAvLyBmaXJzdCBkcmF3IHJvd3NcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLkNBTlZBU19XSURUSCArIDE7IHgrKykge1xuICAgICAgICAgICAgdGhpcy5jdHgubW92ZVRvKHRoaXMuQ0VMTF9TSVpFICogeCwgMCk7XG4gICAgICAgICAgICAvLyB0aGlzIHdpbGwgZHJhdyB0aGUgbGluZVxuICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMuQ0VMTF9TSVpFICogeCwgdGhpcy5DQU5WQVNfV0lEVEggKiB0aGlzLkNFTExfU0laRSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLkNBTlZBU19XSURUSCArIDE7IHkrKykge1xuICAgICAgICAgICAgdGhpcy5jdHgubW92ZVRvKDAsIHRoaXMuQ0VMTF9TSVpFICogeSk7XG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8odGhpcy5DQU5WQVNfV0lEVEggKiB0aGlzLkNFTExfU0laRSwgdGhpcy5DRUxMX1NJWkUgKiB5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICB9XG4gICAgZ2V0Q2FudmFzQ29udGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IENhbnZhcztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQ29ubmVjdCB7XG4gICAgY29uc3RydWN0b3IodXJpKSB7XG4gICAgICAgIHRoaXMud2Vic29ja2V0ID0gbmV3IFdlYlNvY2tldCh1cmkpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy53ZWJzb2NrZXQub25vcGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvcGVuXCIpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLndlYnNvY2tldC5vbmVycm9yID0gKGV2KSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldik7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGdldFdlYlNvY2tldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2Vic29ja2V0O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IENvbm5lY3Q7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbm5lY3RfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9jb25uZWN0XCIpKTtcbmNvbnN0IGJvYXJkXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vYm9hcmRcIikpO1xuY29uc3QgcGxheWVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGxheWVyXCIpKTtcbmNvbnN0IGNvbm5lY3Rpb24gPSBuZXcgY29ubmVjdF8xLmRlZmF1bHQoXCJ3czovL3RvcnZhbi1ib21iZXJtYW4uY3Q4LnBsOjE5ODQvc29ja2V0cy9zZXJ2ZXIucGhwXCIpO1xuY29uc3Qgc29ja2V0ID0gY29ubmVjdGlvbi5nZXRXZWJTb2NrZXQoKTtcbmNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuaW1nLnNyYyA9IFwiLi9yZXMvc3ByaXRlc2hlZXQucG5nXCI7XG5jb25zdCBwbGF5ZXJJZCA9IDA7XG5jb25zdCBwbGF5ZXJzID0gW1xuICAgIG5ldyBwbGF5ZXJfMS5kZWZhdWx0KDAsIDAsIDE2ICogMTEsIDE2ICogNSwgdHJ1ZSwgZmFsc2UpXG5dO1xuaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBnYW1lQm9hcmQgPSBuZXcgYm9hcmRfMS5kZWZhdWx0KGltZyk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgY29uc3Qga2V5ID0gZS5rZXk7XG4gICAgICAgIGlmIChrZXkgPT0gXCJBcnJvd0xlZnRcIiB8fCBrZXkgPT0gXCJBcnJvd1JpZ2h0XCIgfHwga2V5ID09IFwiQXJyb3dVcFwiIHx8IGtleSA9PSBcIkFycm93RG93blwiKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBnYW1lQm9hcmQuc3RhcnRQbGF5ZXIocGxheWVySWQsIGtleSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKCkgPT4ge1xuICAgICAgICBnYW1lQm9hcmQuc3RvcFBsYXllcihwbGF5ZXJJZCk7XG4gICAgfSk7XG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IChldikgPT4ge1xuICAgICAgICBpZiAoZXYuZGF0YSAhPSBcIlwiKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhRnJvbVNlcnZlciA9IEpTT04ucGFyc2UoZXYuZGF0YSk7XG4gICAgICAgICAgICBnYW1lQm9hcmQuc2V0Qm9hcmQoZGF0YUZyb21TZXJ2ZXIuYm9hcmQpO1xuICAgICAgICAgICAgZ2FtZUJvYXJkLnNldEJhbGxvb25zQm9hcmQoZGF0YUZyb21TZXJ2ZXIuYmFsbG9vbnMpO1xuICAgICAgICAgICAgZ2FtZUJvYXJkLnNldFBsYXllcnNCb2FyZChwbGF5ZXJzKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBkaXJlY3Rpb24sIHgsIHksIGFsaXZlLCBtb3ZpbmcpIHtcbiAgICAgICAgdGhpcy5jb2xsaWRlcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICB0aGlzLmFsaXZlID0gYWxpdmU7XG4gICAgICAgIHRoaXMubW92aW5nID0gbW92aW5nO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFBsYXllcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NjcmlwdHMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
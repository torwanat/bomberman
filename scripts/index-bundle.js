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
            if ((this.currentTick % 16) % 4 == 0) {
                this.moveBalloons();
            }
            setTimeout(window.requestAnimationFrame, 1000 / 60, this.incrementTick); // ~60 klatek/s
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
    movePlayer(id, key) {
        for (let i = 0; i < this.playersBoard.length; i++) {
            const player = this.playersBoard[i];
            if (player.id == id) {
                player.moving = true;
                this.checkPlayerMove(player, key);
                if (player.collides)
                    break;
                switch (key) {
                    case "ArrowDown":
                        player.y += 1;
                        break;
                    case "ArrowRight":
                        player.x += 1;
                        break;
                    case "ArrowUp":
                        player.y -= 1;
                        break;
                    case "ArrowLeft":
                        player.x -= 1;
                        break;
                    default:
                        break;
                }
                break;
            }
            this.updateAnimations();
        }
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
    checkPlayerMove(player, key) {
        let positionX = Math.round(player.x / 16);
        let positionY = Math.round(player.y / 16);
        switch (key) {
            case "ArrowDown":
                player.direction = 0;
                positionY += 1;
                break;
            case "ArrowRight":
                player.direction = 1;
                positionX += 1;
                break;
            case "ArrowUp":
                player.direction = 2;
                positionY -= 1;
                break;
            case "ArrowLeft":
                player.direction = 3;
                positionX -= 1;
                break;
            default:
                break;
        }
        player.collides = false;
        switch (player.direction) {
            case 0:
            case 2:
                if ((this.board[positionX][positionY] == "W" || this.board[positionX][positionY] == "B") && player.y % 16 == 0) {
                    player.collides = true;
                }
                else {
                    player.x = Math.round(player.x / 16) * 16;
                }
                break;
            case 1:
            case 3:
                if ((this.board[positionX][positionY] == "W" || this.board[positionX][positionY] == "B") && player.x % 16 == 0) {
                    player.collides = true;
                }
                else {
                    player.y = Math.round(player.y / 16) * 16;
                }
                break;
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
            gameBoard.movePlayer(playerId, key);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hbmltYXRlLnRzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYm9hcmQudHMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9jYW52YXMudHMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9jb25uZWN0LnRzIiwid2VicGFjazovLy8uL3NjcmlwdHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9wbGF5ZXIudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIEFuaW1hdGUge1xuICAgIGNvbnN0cnVjdG9yKGltZywgaW5zdHJ1Y3Rpb25zLCBkaW1lbnNpb25zLCByZXBlYXQsIGNvb3JkaW5hdGVzLCBjYW52YXMsIGJvYXJkKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlc2hlZXQgPSBpbWc7XG4gICAgICAgIHRoaXMuZnJhbWVzID0gaW5zdHJ1Y3Rpb25zLmZyYW1lcztcbiAgICAgICAgdGhpcy50aW1lcyA9IGluc3RydWN0aW9ucy50aW1lcztcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gZGltZW5zaW9ucztcbiAgICAgICAgdGhpcy5yZXBlYXQgPSByZXBlYXQ7XG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICAgIHRoaXMuYm9hcmQgPSBib2FyZDtcbiAgICB9XG4gICAgc3RhcnRBbmltYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRGcmFtZSA9IE1hdGguZmxvb3IoKHRoaXMuYm9hcmQuY3VycmVudFRpY2sgLyB0aGlzLnRpbWVzWzBdKSAlIHRoaXMudGltZXMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJGcmFtZShjdXJyZW50RnJhbWUpO1xuICAgIH1cbiAgICByZW5kZXJGcmFtZShmcmFtZU51bWJlcikge1xuICAgICAgICB0aGlzLmNhbnZhcy5nZXRDYW52YXNDb250ZXh0KCkuZHJhd0ltYWdlKHRoaXMuc3ByaXRlc2hlZXQsIHRoaXMuZnJhbWVzW2ZyYW1lTnVtYmVyXS54MCwgdGhpcy5mcmFtZXNbZnJhbWVOdW1iZXJdLnkwLCB0aGlzLmRpbWVuc2lvbnMud2lkdGgsIHRoaXMuZGltZW5zaW9ucy5oZWlnaHQsIHRoaXMuY29vcmRpbmF0ZXMueCwgdGhpcy5jb29yZGluYXRlcy55LCB0aGlzLmRpbWVuc2lvbnMud2lkdGgsIHRoaXMuZGltZW5zaW9ucy5oZWlnaHQpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEFuaW1hdGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGFuaW1hdGVfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9hbmltYXRlXCIpKTtcbmNvbnN0IGRhdGFfanNvbl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9yZXMvZGF0YS5qc29uXCIpKTtcbmNvbnN0IGNhbnZhc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2NhbnZhc1wiKSk7XG5jbGFzcyBCb2FyZCB7XG4gICAgY29uc3RydWN0b3IoaW1nKSB7XG4gICAgICAgIHRoaXMuYm9hcmQgPSBbXTtcbiAgICAgICAgdGhpcy5iYWxsb29uc0JvYXJkID0gW107XG4gICAgICAgIHRoaXMucGxheWVyc0JvYXJkID0gW107XG4gICAgICAgIHRoaXMuYW5pbWF0aW9ucyA9IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnRUaWNrID0gMDtcbiAgICAgICAgdGhpcy5pbmNyZW1lbnRUaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLmZvckVhY2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICBlLnN0YXJ0QW5pbWF0aW9uKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRpY2srKztcbiAgICAgICAgICAgIGlmICgodGhpcy5jdXJyZW50VGljayAlIDE2KSAlIDQgPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZUJhbGxvb25zKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUsIDEwMDAgLyA2MCwgdGhpcy5pbmNyZW1lbnRUaWNrKTsgLy8gfjYwIGtsYXRlay9zXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2FudmFzID0gbmV3IGNhbnZhc18xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5pbWcgPSBpbWc7XG4gICAgICAgIHRoaXMuaW5jcmVtZW50VGljaygpO1xuICAgIH1cbiAgICBzZXRCb2FyZChib2FyZCkge1xuICAgICAgICB0aGlzLmJvYXJkID0gYm9hcmQ7XG4gICAgICAgIHRoaXMudXBkYXRlQW5pbWF0aW9ucygpO1xuICAgIH1cbiAgICBzZXRCYWxsb29uc0JvYXJkKGJhbGxvb25zQm9hcmQpIHtcbiAgICAgICAgdGhpcy5iYWxsb29uc0JvYXJkID0gYmFsbG9vbnNCb2FyZDtcbiAgICAgICAgdGhpcy51cGRhdGVBbmltYXRpb25zKCk7XG4gICAgfVxuICAgIHNldFBsYXllcnNCb2FyZChwbGF5ZXJzQm9hcmQpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJzQm9hcmQgPSBwbGF5ZXJzQm9hcmQ7XG4gICAgICAgIHRoaXMudXBkYXRlQW5pbWF0aW9ucygpO1xuICAgIH1cbiAgICB1cGRhdGVBbmltYXRpb25zKCkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuYm9hcmRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMuYm9hcmRbaV1bal0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIldcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdCh0aGlzLmltZywgZGF0YV9qc29uXzEuZGVmYXVsdC53YWxsLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IGkgKiAxNiwgXCJ5XCI6IGogKiAxNiB9LCB0aGlzLmNhbnZhcywgdGhpcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJCXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQodGhpcy5pbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQuYnJpY2tzLnNvbGlkLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IGkgKiAxNiwgXCJ5XCI6IGogKiAxNiB9LCB0aGlzLmNhbnZhcywgdGhpcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQodGhpcy5pbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQuZ3Jhc3MsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgdHJ1ZSwgeyBcInhcIjogaSAqIDE2LCBcInlcIjogaiAqIDE2IH0sIHRoaXMuY2FudmFzLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJhbGxvb25zQm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGJhbGxvb24gPSB0aGlzLmJhbGxvb25zQm9hcmRbaV07XG4gICAgICAgICAgICBpZiAoYmFsbG9vbi5hbGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdCh0aGlzLmltZywgYmFsbG9vbi5kaXJlY3Rpb24gPiAxID8gZGF0YV9qc29uXzEuZGVmYXVsdC5iYWxsb29uLmxlZnQgOiBkYXRhX2pzb25fMS5kZWZhdWx0LmJhbGxvb24ucmlnaHQsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgdHJ1ZSwgeyBcInhcIjogYmFsbG9vbi54LCBcInlcIjogYmFsbG9vbi55IH0sIHRoaXMuY2FudmFzLCB0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQodGhpcy5pbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQuYmFsbG9vbi5kZWF0aCwgZGF0YV9qc29uXzEuZGVmYXVsdC5kaW1lbnNpb25zLCBmYWxzZSwgeyBcInhcIjogYmFsbG9vbi54LCBcInlcIjogYmFsbG9vbi55IH0sIHRoaXMuY2FudmFzLCB0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnNCb2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy5wbGF5ZXJzQm9hcmRbaV07XG4gICAgICAgICAgICBpZiAocGxheWVyLm1vdmluZykge1xuICAgICAgICAgICAgICAgIGxldCBmYWNpbmc7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChwbGF5ZXIuZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2luZyA9IGRhdGFfanNvbl8xLmRlZmF1bHQucGxheWVyLmRvd247XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjaW5nID0gZGF0YV9qc29uXzEuZGVmYXVsdC5wbGF5ZXIucmlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjaW5nID0gZGF0YV9qc29uXzEuZGVmYXVsdC5wbGF5ZXIudXA7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjaW5nID0gZGF0YV9qc29uXzEuZGVmYXVsdC5wbGF5ZXIubGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdCh0aGlzLmltZywgZmFjaW5nLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IHBsYXllci54LCBcInlcIjogcGxheWVyLnkgfSwgdGhpcy5jYW52YXMsIHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCFwbGF5ZXIuYWxpdmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQodGhpcy5pbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQucGxheWVyLmRlYXRoLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIGZhbHNlLCB7IFwieFwiOiBwbGF5ZXIueCwgXCJ5XCI6IHBsYXllci55IH0sIHRoaXMuY2FudmFzLCB0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQodGhpcy5pbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQucGxheWVyLnN0b3AsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgdHJ1ZSwgeyBcInhcIjogcGxheWVyLngsIFwieVwiOiBwbGF5ZXIueSB9LCB0aGlzLmNhbnZhcywgdGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIG1vdmVCYWxsb29ucygpIHtcbiAgICAgICAgdGhpcy5jaGVja0ZvckNvbGxpc2lvbnMoKTtcbiAgICAgICAgdGhpcy5iYWxsb29uc0JvYXJkLmZvckVhY2goKGJhbGxvb24pID0+IHtcbiAgICAgICAgICAgIGlmIChiYWxsb29uLmNvbGxpZGVzKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHN3aXRjaCAoYmFsbG9vbi5kaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIGJhbGxvb24ueSArPSAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGJhbGxvb24ueCArPSAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIGJhbGxvb24ueSAtPSAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIGJhbGxvb24ueCAtPSAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlQW5pbWF0aW9ucygpO1xuICAgIH1cbiAgICBtb3ZlUGxheWVyKGlkLCBrZXkpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnNCb2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy5wbGF5ZXJzQm9hcmRbaV07XG4gICAgICAgICAgICBpZiAocGxheWVyLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLm1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja1BsYXllck1vdmUocGxheWVyLCBrZXkpO1xuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuY29sbGlkZXMpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJBcnJvd0Rvd25cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci55ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkFycm93UmlnaHRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci54ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkFycm93VXBcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci55IC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkFycm93TGVmdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLnggLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy51cGRhdGVBbmltYXRpb25zKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RvcFBsYXllcihpZCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVyc0JvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLnBsYXllcnNCb2FyZFtpXTtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIuaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIubW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2hlY2tQbGF5ZXJNb3ZlKHBsYXllciwga2V5KSB7XG4gICAgICAgIGxldCBwb3NpdGlvblggPSBNYXRoLnJvdW5kKHBsYXllci54IC8gMTYpO1xuICAgICAgICBsZXQgcG9zaXRpb25ZID0gTWF0aC5yb3VuZChwbGF5ZXIueSAvIDE2KTtcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJBcnJvd0Rvd25cIjpcbiAgICAgICAgICAgICAgICBwbGF5ZXIuZGlyZWN0aW9uID0gMDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvblkgKz0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJBcnJvd1JpZ2h0XCI6XG4gICAgICAgICAgICAgICAgcGxheWVyLmRpcmVjdGlvbiA9IDE7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25YICs9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQXJyb3dVcFwiOlxuICAgICAgICAgICAgICAgIHBsYXllci5kaXJlY3Rpb24gPSAyO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uWSAtPSAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkFycm93TGVmdFwiOlxuICAgICAgICAgICAgICAgIHBsYXllci5kaXJlY3Rpb24gPSAzO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uWCAtPSAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBwbGF5ZXIuY29sbGlkZXMgPSBmYWxzZTtcbiAgICAgICAgc3dpdGNoIChwbGF5ZXIuZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgaWYgKCh0aGlzLmJvYXJkW3Bvc2l0aW9uWF1bcG9zaXRpb25ZXSA9PSBcIldcIiB8fCB0aGlzLmJvYXJkW3Bvc2l0aW9uWF1bcG9zaXRpb25ZXSA9PSBcIkJcIikgJiYgcGxheWVyLnkgJSAxNiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5jb2xsaWRlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIueCA9IE1hdGgucm91bmQocGxheWVyLnggLyAxNikgKiAxNjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgaWYgKCh0aGlzLmJvYXJkW3Bvc2l0aW9uWF1bcG9zaXRpb25ZXSA9PSBcIldcIiB8fCB0aGlzLmJvYXJkW3Bvc2l0aW9uWF1bcG9zaXRpb25ZXSA9PSBcIkJcIikgJiYgcGxheWVyLnggJSAxNiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5jb2xsaWRlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIueSA9IE1hdGgucm91bmQocGxheWVyLnkgLyAxNikgKiAxNjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2hlY2tGb3JDb2xsaXNpb25zKCkge1xuICAgICAgICB0aGlzLmJhbGxvb25zQm9hcmQuZm9yRWFjaCgoYmFsbG9vbikgPT4ge1xuICAgICAgICAgICAgbGV0IHBvc2l0aW9uWCA9IE1hdGguZmxvb3IoYmFsbG9vbi54IC8gMTYpO1xuICAgICAgICAgICAgbGV0IHBvc2l0aW9uWSA9IE1hdGguZmxvb3IoYmFsbG9vbi55IC8gMTYpO1xuICAgICAgICAgICAgaWYgKHBvc2l0aW9uWCAhPSBiYWxsb29uLnggLyAxNiB8fCBwb3NpdGlvblkgIT0gYmFsbG9vbi55IC8gMTYpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgc3dpdGNoIChiYWxsb29uLmRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ZKys7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25YKys7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ZLS07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25YLS07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJhbGxvb24ud2FpdCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgYmFsbG9vbi5jb2xsaWRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYmFsbG9vbi53YWl0LS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5ib2FyZFtwb3NpdGlvblhdW3Bvc2l0aW9uWV0gPT0gXCJXXCIgfHwgdGhpcy5ib2FyZFtwb3NpdGlvblhdW3Bvc2l0aW9uWV0gPT0gXCJCXCIpIHtcbiAgICAgICAgICAgICAgICBiYWxsb29uLmNvbGxpZGVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBiYWxsb29uLndhaXQgKz0gMTY7XG4gICAgICAgICAgICAgICAgYmFsbG9vbi5kaXJlY3Rpb24gPSBiYWxsb29uLmRpcmVjdGlvbiA9PSAwID8gMyA6IGJhbGxvb24uZGlyZWN0aW9uLS07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEJvYXJkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBDYW52YXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkNFTExfU0laRSA9IDE2O1xuICAgICAgICB0aGlzLkNBTlZBU19XSURUSCA9IDMzICogdGhpcy5DRUxMX1NJWkU7XG4gICAgICAgIHRoaXMuQ0FOVkFTX0hFSUdIVCA9IDEzICogdGhpcy5DRUxMX1NJWkU7XG4gICAgICAgIHRoaXMuY3JlYXRlQ2FudmFzKCk7XG4gICAgfVxuICAgIGNyZWF0ZUNhbnZhcygpIHtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICB0aGlzLmNhbnZhcy5jbGFzc05hbWUgPSBcIm1haW4tY2FudmFzXCI7XG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5DQU5WQVNfV0lEVEg7XG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuQ0FOVkFTX0hFSUdIVDtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5DQU5WQVNfV0lEVEgsIHRoaXMuQ0FOVkFTX0hFSUdIVCk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1jb250YWluZXJcIikuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuICAgIH1cbiAgICBjbGVhckNhbnZhcygpIHtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJncmVlblwiO1xuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLkNBTlZBU19XSURUSCwgdGhpcy5DQU5WQVNfSEVJR0hUKTtcbiAgICB9XG4gICAgZHJhd1dvcmxkKCkge1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgLy8gZmlyc3QgZHJhdyByb3dzXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5DQU5WQVNfV0lEVEggKyAxOyB4KyspIHtcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbyh0aGlzLkNFTExfU0laRSAqIHgsIDApO1xuICAgICAgICAgICAgLy8gdGhpcyB3aWxsIGRyYXcgdGhlIGxpbmVcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLkNFTExfU0laRSAqIHgsIHRoaXMuQ0FOVkFTX1dJRFRIICogdGhpcy5DRUxMX1NJWkUpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5DQU5WQVNfV0lEVEggKyAxOyB5KyspIHtcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCB0aGlzLkNFTExfU0laRSAqIHkpO1xuICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMuQ0FOVkFTX1dJRFRIICogdGhpcy5DRUxMX1NJWkUsIHRoaXMuQ0VMTF9TSVpFICogeSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgfVxuICAgIGdldENhbnZhc0NvbnRleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN0eDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBDYW52YXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIENvbm5lY3Qge1xuICAgIGNvbnN0cnVjdG9yKHVyaSkge1xuICAgICAgICB0aGlzLndlYnNvY2tldCA9IG5ldyBXZWJTb2NrZXQodXJpKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMud2Vic29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3BlblwiKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy53ZWJzb2NrZXQub25lcnJvciA9IChldikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXYpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXRXZWJTb2NrZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndlYnNvY2tldDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBDb25uZWN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25uZWN0XzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vY29ubmVjdFwiKSk7XG5jb25zdCBib2FyZF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2JvYXJkXCIpKTtcbmNvbnN0IHBsYXllcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BsYXllclwiKSk7XG5jb25zdCBjb25uZWN0aW9uID0gbmV3IGNvbm5lY3RfMS5kZWZhdWx0KFwid3M6Ly90b3J2YW4tYm9tYmVybWFuLmN0OC5wbDoxOTg0L3NvY2tldHMvc2VydmVyLnBocFwiKTtcbmNvbnN0IHNvY2tldCA9IGNvbm5lY3Rpb24uZ2V0V2ViU29ja2V0KCk7XG5jb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbmltZy5zcmMgPSBcIi4vcmVzL3Nwcml0ZXNoZWV0LnBuZ1wiO1xuY29uc3QgcGxheWVySWQgPSAwO1xuY29uc3QgcGxheWVycyA9IFtcbiAgICBuZXcgcGxheWVyXzEuZGVmYXVsdCgwLCAwLCAxNiAqIDExLCAxNiAqIDUsIHRydWUsIGZhbHNlKVxuXTtcbmltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZ2FtZUJvYXJkID0gbmV3IGJvYXJkXzEuZGVmYXVsdChpbWcpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGtleSA9IGUua2V5O1xuICAgICAgICBpZiAoa2V5ID09IFwiQXJyb3dMZWZ0XCIgfHwga2V5ID09IFwiQXJyb3dSaWdodFwiIHx8IGtleSA9PSBcIkFycm93VXBcIiB8fCBrZXkgPT0gXCJBcnJvd0Rvd25cIikge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZ2FtZUJvYXJkLm1vdmVQbGF5ZXIocGxheWVySWQsIGtleSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKCkgPT4ge1xuICAgICAgICBnYW1lQm9hcmQuc3RvcFBsYXllcihwbGF5ZXJJZCk7XG4gICAgfSk7XG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IChldikgPT4ge1xuICAgICAgICBpZiAoZXYuZGF0YSAhPSBcIlwiKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhRnJvbVNlcnZlciA9IEpTT04ucGFyc2UoZXYuZGF0YSk7XG4gICAgICAgICAgICBnYW1lQm9hcmQuc2V0Qm9hcmQoZGF0YUZyb21TZXJ2ZXIuYm9hcmQpO1xuICAgICAgICAgICAgZ2FtZUJvYXJkLnNldEJhbGxvb25zQm9hcmQoZGF0YUZyb21TZXJ2ZXIuYmFsbG9vbnMpO1xuICAgICAgICAgICAgZ2FtZUJvYXJkLnNldFBsYXllcnNCb2FyZChwbGF5ZXJzKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBkaXJlY3Rpb24sIHgsIHksIGFsaXZlLCBtb3ZpbmcpIHtcbiAgICAgICAgdGhpcy5jb2xsaWRlcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICB0aGlzLmFsaXZlID0gYWxpdmU7XG4gICAgICAgIHRoaXMubW92aW5nID0gbW92aW5nO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFBsYXllcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NjcmlwdHMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
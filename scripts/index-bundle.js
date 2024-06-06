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
                switch (key) {
                    case "ArrowDown":
                        player.y += 1;
                        player.direction = 0;
                        break;
                    case "ArrowRight":
                        player.x += 1;
                        player.direction = 1;
                        break;
                    case "ArrowUp":
                        player.y -= 1;
                        player.direction = 2;
                        break;
                    case "ArrowLeft":
                        player.x -= 1;
                        player.direction = 3;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0Esa0JBQWU7Ozs7Ozs7Ozs7O0FDekNGO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBZTs7Ozs7Ozs7Ozs7QUNuQkY7QUFDYjtBQUNBLDZDQUE2QztBQUM3QztBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxrQ0FBa0MsbUJBQU8sQ0FBQyx1Q0FBVztBQUNyRCxnQ0FBZ0MsbUJBQU8sQ0FBQyxtQ0FBUztBQUNqRCxpQ0FBaUMsbUJBQU8sQ0FBQyxxQ0FBVTtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNwQ2E7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFlOzs7Ozs7Ozs7Ozs7Ozs7OztVQ2JmO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FuaW1hdGUudHMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9ib2FyZC50cyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2NhbnZhcy50cyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2Nvbm5lY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL3BsYXllci50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQW5pbWF0ZSB7XG4gICAgY29uc3RydWN0b3IoaW1nLCBpbnN0cnVjdGlvbnMsIGRpbWVuc2lvbnMsIHJlcGVhdCwgY29vcmRpbmF0ZXMsIGNhbnZhcywgYm9hcmQpIHtcbiAgICAgICAgdGhpcy5zcHJpdGVzaGVldCA9IGltZztcbiAgICAgICAgdGhpcy5mcmFtZXMgPSBpbnN0cnVjdGlvbnMuZnJhbWVzO1xuICAgICAgICB0aGlzLnRpbWVzID0gaW5zdHJ1Y3Rpb25zLnRpbWVzO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBkaW1lbnNpb25zO1xuICAgICAgICB0aGlzLnJlcGVhdCA9IHJlcGVhdDtcbiAgICAgICAgdGhpcy5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgdGhpcy5ib2FyZCA9IGJvYXJkO1xuICAgIH1cbiAgICBzdGFydEFuaW1hdGlvbigpIHtcbiAgICAgICAgY29uc3QgY3VycmVudEZyYW1lID0gTWF0aC5mbG9vcigodGhpcy5ib2FyZC5jdXJyZW50VGljayAvIHRoaXMudGltZXNbMF0pICUgdGhpcy50aW1lcy5sZW5ndGgpO1xuICAgICAgICB0aGlzLnJlbmRlckZyYW1lKGN1cnJlbnRGcmFtZSk7XG4gICAgfVxuICAgIHJlbmRlckZyYW1lKGZyYW1lTnVtYmVyKSB7XG4gICAgICAgIHRoaXMuY2FudmFzLmdldENhbnZhc0NvbnRleHQoKS5kcmF3SW1hZ2UodGhpcy5zcHJpdGVzaGVldCwgdGhpcy5mcmFtZXNbZnJhbWVOdW1iZXJdLngwLCB0aGlzLmZyYW1lc1tmcmFtZU51bWJlcl0ueTAsIHRoaXMuZGltZW5zaW9ucy53aWR0aCwgdGhpcy5kaW1lbnNpb25zLmhlaWdodCwgdGhpcy5jb29yZGluYXRlcy54LCB0aGlzLmNvb3JkaW5hdGVzLnksIHRoaXMuZGltZW5zaW9ucy53aWR0aCwgdGhpcy5kaW1lbnNpb25zLmhlaWdodCk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gQW5pbWF0ZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgYW5pbWF0ZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2FuaW1hdGVcIikpO1xuY29uc3QgZGF0YV9qc29uXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL3Jlcy9kYXRhLmpzb25cIikpO1xuY29uc3QgY2FudmFzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vY2FudmFzXCIpKTtcbmNsYXNzIEJvYXJkIHtcbiAgICBjb25zdHJ1Y3RvcihpbWcpIHtcbiAgICAgICAgdGhpcy5ib2FyZCA9IFtdO1xuICAgICAgICB0aGlzLmJhbGxvb25zQm9hcmQgPSBbXTtcbiAgICAgICAgdGhpcy5wbGF5ZXJzQm9hcmQgPSBbXTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25zID0gW107XG4gICAgICAgIHRoaXMuY3VycmVudFRpY2sgPSAwO1xuICAgICAgICB0aGlzLmluY3JlbWVudFRpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGUuc3RhcnRBbmltYXRpb24oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGljaysrO1xuICAgICAgICAgICAgaWYgKCh0aGlzLmN1cnJlbnRUaWNrICUgMTYpICUgNCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlQmFsbG9vbnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFRpbWVvdXQod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSwgMTAwMCAvIDYwLCB0aGlzLmluY3JlbWVudFRpY2spOyAvLyB+NjAga2xhdGVrL3NcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBuZXcgY2FudmFzXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmltZyA9IGltZztcbiAgICAgICAgdGhpcy5pbmNyZW1lbnRUaWNrKCk7XG4gICAgfVxuICAgIHNldEJvYXJkKGJvYXJkKSB7XG4gICAgICAgIHRoaXMuYm9hcmQgPSBib2FyZDtcbiAgICAgICAgdGhpcy51cGRhdGVBbmltYXRpb25zKCk7XG4gICAgfVxuICAgIHNldEJhbGxvb25zQm9hcmQoYmFsbG9vbnNCb2FyZCkge1xuICAgICAgICB0aGlzLmJhbGxvb25zQm9hcmQgPSBiYWxsb29uc0JvYXJkO1xuICAgICAgICB0aGlzLnVwZGF0ZUFuaW1hdGlvbnMoKTtcbiAgICB9XG4gICAgc2V0UGxheWVyc0JvYXJkKHBsYXllcnNCb2FyZCkge1xuICAgICAgICB0aGlzLnBsYXllcnNCb2FyZCA9IHBsYXllcnNCb2FyZDtcbiAgICAgICAgdGhpcy51cGRhdGVBbmltYXRpb25zKCk7XG4gICAgfVxuICAgIHVwZGF0ZUFuaW1hdGlvbnMoKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9ucyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5ib2FyZFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5ib2FyZFtpXVtqXSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiV1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLnB1c2gobmV3IGFuaW1hdGVfMS5kZWZhdWx0KHRoaXMuaW1nLCBkYXRhX2pzb25fMS5kZWZhdWx0LndhbGwsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgdHJ1ZSwgeyBcInhcIjogaSAqIDE2LCBcInlcIjogaiAqIDE2IH0sIHRoaXMuY2FudmFzLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkJcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdCh0aGlzLmltZywgZGF0YV9qc29uXzEuZGVmYXVsdC5icmlja3Muc29saWQsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgdHJ1ZSwgeyBcInhcIjogaSAqIDE2LCBcInlcIjogaiAqIDE2IH0sIHRoaXMuY2FudmFzLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdCh0aGlzLmltZywgZGF0YV9qc29uXzEuZGVmYXVsdC5ncmFzcywgZGF0YV9qc29uXzEuZGVmYXVsdC5kaW1lbnNpb25zLCB0cnVlLCB7IFwieFwiOiBpICogMTYsIFwieVwiOiBqICogMTYgfSwgdGhpcy5jYW52YXMsIHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYmFsbG9vbnNCb2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYmFsbG9vbiA9IHRoaXMuYmFsbG9vbnNCb2FyZFtpXTtcbiAgICAgICAgICAgIGlmIChiYWxsb29uLmFsaXZlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLnB1c2gobmV3IGFuaW1hdGVfMS5kZWZhdWx0KHRoaXMuaW1nLCBiYWxsb29uLmRpcmVjdGlvbiA+IDEgPyBkYXRhX2pzb25fMS5kZWZhdWx0LmJhbGxvb24ubGVmdCA6IGRhdGFfanNvbl8xLmRlZmF1bHQuYmFsbG9vbi5yaWdodCwgZGF0YV9qc29uXzEuZGVmYXVsdC5kaW1lbnNpb25zLCB0cnVlLCB7IFwieFwiOiBiYWxsb29uLngsIFwieVwiOiBiYWxsb29uLnkgfSwgdGhpcy5jYW52YXMsIHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdCh0aGlzLmltZywgZGF0YV9qc29uXzEuZGVmYXVsdC5iYWxsb29uLmRlYXRoLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIGZhbHNlLCB7IFwieFwiOiBiYWxsb29uLngsIFwieVwiOiBiYWxsb29uLnkgfSwgdGhpcy5jYW52YXMsIHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVyc0JvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLnBsYXllcnNCb2FyZFtpXTtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIubW92aW5nKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZhY2luZztcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHBsYXllci5kaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjaW5nID0gZGF0YV9qc29uXzEuZGVmYXVsdC5wbGF5ZXIuZG93bjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBmYWNpbmcgPSBkYXRhX2pzb25fMS5kZWZhdWx0LnBsYXllci5yaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBmYWNpbmcgPSBkYXRhX2pzb25fMS5kZWZhdWx0LnBsYXllci51cDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBmYWNpbmcgPSBkYXRhX2pzb25fMS5kZWZhdWx0LnBsYXllci5sZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLnB1c2gobmV3IGFuaW1hdGVfMS5kZWZhdWx0KHRoaXMuaW1nLCBmYWNpbmcsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgdHJ1ZSwgeyBcInhcIjogcGxheWVyLngsIFwieVwiOiBwbGF5ZXIueSB9LCB0aGlzLmNhbnZhcywgdGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoIXBsYXllci5hbGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdCh0aGlzLmltZywgZGF0YV9qc29uXzEuZGVmYXVsdC5wbGF5ZXIuZGVhdGgsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgZmFsc2UsIHsgXCJ4XCI6IHBsYXllci54LCBcInlcIjogcGxheWVyLnkgfSwgdGhpcy5jYW52YXMsIHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdCh0aGlzLmltZywgZGF0YV9qc29uXzEuZGVmYXVsdC5wbGF5ZXIuc3RvcCwgZGF0YV9qc29uXzEuZGVmYXVsdC5kaW1lbnNpb25zLCB0cnVlLCB7IFwieFwiOiBwbGF5ZXIueCwgXCJ5XCI6IHBsYXllci55IH0sIHRoaXMuY2FudmFzLCB0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbW92ZUJhbGxvb25zKCkge1xuICAgICAgICB0aGlzLmNoZWNrRm9yQ29sbGlzaW9ucygpO1xuICAgICAgICB0aGlzLmJhbGxvb25zQm9hcmQuZm9yRWFjaCgoYmFsbG9vbikgPT4ge1xuICAgICAgICAgICAgaWYgKGJhbGxvb24uY29sbGlkZXMpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgc3dpdGNoIChiYWxsb29uLmRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgYmFsbG9vbi55ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgYmFsbG9vbi54ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgYmFsbG9vbi55IC09IDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgYmFsbG9vbi54IC09IDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51cGRhdGVBbmltYXRpb25zKCk7XG4gICAgfVxuICAgIG1vdmVQbGF5ZXIoaWQsIGtleSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVyc0JvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLnBsYXllcnNCb2FyZFtpXTtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIuaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIubW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dEb3duXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIueSArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmRpcmVjdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkFycm93UmlnaHRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci54ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZGlyZWN0aW9uID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dVcFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLnkgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5kaXJlY3Rpb24gPSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJBcnJvd0xlZnRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci54IC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZGlyZWN0aW9uID0gMztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy51cGRhdGVBbmltYXRpb25zKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RvcFBsYXllcihpZCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVyc0JvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLnBsYXllcnNCb2FyZFtpXTtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIuaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIubW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2hlY2tGb3JDb2xsaXNpb25zKCkge1xuICAgICAgICB0aGlzLmJhbGxvb25zQm9hcmQuZm9yRWFjaCgoYmFsbG9vbikgPT4ge1xuICAgICAgICAgICAgbGV0IHBvc2l0aW9uWCA9IE1hdGguZmxvb3IoYmFsbG9vbi54IC8gMTYpO1xuICAgICAgICAgICAgbGV0IHBvc2l0aW9uWSA9IE1hdGguZmxvb3IoYmFsbG9vbi55IC8gMTYpO1xuICAgICAgICAgICAgaWYgKHBvc2l0aW9uWCAhPSBiYWxsb29uLnggLyAxNiB8fCBwb3NpdGlvblkgIT0gYmFsbG9vbi55IC8gMTYpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgc3dpdGNoIChiYWxsb29uLmRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ZKys7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25YKys7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ZLS07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25YLS07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJhbGxvb24ud2FpdCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgYmFsbG9vbi5jb2xsaWRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYmFsbG9vbi53YWl0LS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5ib2FyZFtwb3NpdGlvblhdW3Bvc2l0aW9uWV0gPT0gXCJXXCIgfHwgdGhpcy5ib2FyZFtwb3NpdGlvblhdW3Bvc2l0aW9uWV0gPT0gXCJCXCIpIHtcbiAgICAgICAgICAgICAgICBiYWxsb29uLmNvbGxpZGVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBiYWxsb29uLndhaXQgKz0gMTY7XG4gICAgICAgICAgICAgICAgYmFsbG9vbi5kaXJlY3Rpb24gPSBiYWxsb29uLmRpcmVjdGlvbiA9PSAwID8gMyA6IGJhbGxvb24uZGlyZWN0aW9uLS07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEJvYXJkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBDYW52YXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkNFTExfU0laRSA9IDE2O1xuICAgICAgICB0aGlzLkNBTlZBU19XSURUSCA9IDMzICogdGhpcy5DRUxMX1NJWkU7XG4gICAgICAgIHRoaXMuQ0FOVkFTX0hFSUdIVCA9IDEzICogdGhpcy5DRUxMX1NJWkU7XG4gICAgICAgIHRoaXMuY3JlYXRlQ2FudmFzKCk7XG4gICAgfVxuICAgIGNyZWF0ZUNhbnZhcygpIHtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICB0aGlzLmNhbnZhcy5jbGFzc05hbWUgPSBcIm1haW4tY2FudmFzXCI7XG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5DQU5WQVNfV0lEVEg7XG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuQ0FOVkFTX0hFSUdIVDtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5DQU5WQVNfV0lEVEgsIHRoaXMuQ0FOVkFTX0hFSUdIVCk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1jb250YWluZXJcIikuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuICAgIH1cbiAgICBjbGVhckNhbnZhcygpIHtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJncmVlblwiO1xuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLkNBTlZBU19XSURUSCwgdGhpcy5DQU5WQVNfSEVJR0hUKTtcbiAgICB9XG4gICAgZHJhd1dvcmxkKCkge1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgLy8gZmlyc3QgZHJhdyByb3dzXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5DQU5WQVNfV0lEVEggKyAxOyB4KyspIHtcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbyh0aGlzLkNFTExfU0laRSAqIHgsIDApO1xuICAgICAgICAgICAgLy8gdGhpcyB3aWxsIGRyYXcgdGhlIGxpbmVcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLkNFTExfU0laRSAqIHgsIHRoaXMuQ0FOVkFTX1dJRFRIICogdGhpcy5DRUxMX1NJWkUpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5DQU5WQVNfV0lEVEggKyAxOyB5KyspIHtcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCB0aGlzLkNFTExfU0laRSAqIHkpO1xuICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMuQ0FOVkFTX1dJRFRIICogdGhpcy5DRUxMX1NJWkUsIHRoaXMuQ0VMTF9TSVpFICogeSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgfVxuICAgIGdldENhbnZhc0NvbnRleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN0eDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBDYW52YXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIENvbm5lY3Qge1xuICAgIGNvbnN0cnVjdG9yKHVyaSkge1xuICAgICAgICB0aGlzLndlYnNvY2tldCA9IG5ldyBXZWJTb2NrZXQodXJpKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMud2Vic29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3BlblwiKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy53ZWJzb2NrZXQub25lcnJvciA9IChldikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXYpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXRXZWJTb2NrZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndlYnNvY2tldDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBDb25uZWN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25uZWN0XzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vY29ubmVjdFwiKSk7XG5jb25zdCBib2FyZF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2JvYXJkXCIpKTtcbmNvbnN0IHBsYXllcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BsYXllclwiKSk7XG5jb25zdCBjb25uZWN0aW9uID0gbmV3IGNvbm5lY3RfMS5kZWZhdWx0KFwid3M6Ly90b3J2YW4tYm9tYmVybWFuLmN0OC5wbDoxOTg0L3NvY2tldHMvc2VydmVyLnBocFwiKTtcbmNvbnN0IHNvY2tldCA9IGNvbm5lY3Rpb24uZ2V0V2ViU29ja2V0KCk7XG5jb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbmltZy5zcmMgPSBcIi4vcmVzL3Nwcml0ZXNoZWV0LnBuZ1wiO1xuY29uc3QgcGxheWVySWQgPSAwO1xuY29uc3QgcGxheWVycyA9IFtcbiAgICBuZXcgcGxheWVyXzEuZGVmYXVsdCgwLCAwLCAxNiAqIDExLCAxNiAqIDUsIHRydWUsIGZhbHNlKVxuXTtcbmltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZ2FtZUJvYXJkID0gbmV3IGJvYXJkXzEuZGVmYXVsdChpbWcpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGtleSA9IGUua2V5O1xuICAgICAgICBpZiAoa2V5ID09IFwiQXJyb3dMZWZ0XCIgfHwga2V5ID09IFwiQXJyb3dSaWdodFwiIHx8IGtleSA9PSBcIkFycm93VXBcIiB8fCBrZXkgPT0gXCJBcnJvd0Rvd25cIikge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZ2FtZUJvYXJkLm1vdmVQbGF5ZXIocGxheWVySWQsIGtleSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKCkgPT4ge1xuICAgICAgICBnYW1lQm9hcmQuc3RvcFBsYXllcihwbGF5ZXJJZCk7XG4gICAgfSk7XG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IChldikgPT4ge1xuICAgICAgICBpZiAoZXYuZGF0YSAhPSBcIlwiKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhRnJvbVNlcnZlciA9IEpTT04ucGFyc2UoZXYuZGF0YSk7XG4gICAgICAgICAgICBnYW1lQm9hcmQuc2V0Qm9hcmQoZGF0YUZyb21TZXJ2ZXIuYm9hcmQpO1xuICAgICAgICAgICAgZ2FtZUJvYXJkLnNldEJhbGxvb25zQm9hcmQoZGF0YUZyb21TZXJ2ZXIuYmFsbG9vbnMpO1xuICAgICAgICAgICAgZ2FtZUJvYXJkLnNldFBsYXllcnNCb2FyZChwbGF5ZXJzKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBkaXJlY3Rpb24sIHgsIHksIGFsaXZlLCBtb3ZpbmcpIHtcbiAgICAgICAgdGhpcy5jb2xsaWRlcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICB0aGlzLmFsaXZlID0gYWxpdmU7XG4gICAgICAgIHRoaXMubW92aW5nID0gbW92aW5nO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFBsYXllcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NjcmlwdHMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
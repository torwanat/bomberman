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
    movePlayer(id, key) {
        for (let i = 0; i < this.playersBoard.length; i++) {
            const player = this.playersBoard[i];
            if (player.id == id) {
                player.moving = true;
                console.log("here2");
                this.checkPlayerMove(player, key);
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
        switch (player.direction) {
            case 0:
            case 2:
                if (this.board[positionX][positionY] != "W" && this.board[positionX][positionY] != "B" && player.y % 16 == 0) {
                    player.x = Math.round(player.x / 16) * 16;
                    player.direction == 0 ? player.y += 1 : player.y -= 1;
                }
                break;
            case 1:
            case 3:
                if (this.board[positionX][positionY] != "W" && this.board[positionX][positionY] != "B" && player.x % 16 == 0) {
                    player.y = Math.round(player.y / 16) * 16;
                    player.direction == 1 ? player.x += 1 : player.x -= 1;
                    console.log(player.x);
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
            console.log("here");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Oi8vLy4vc2NyaXB0cy9ib2FyZC50cyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2NhbnZhcy50cyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2Nvbm5lY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL3BsYXllci50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQW5pbWF0ZSB7XG4gICAgY29uc3RydWN0b3IoaW1nLCBpbnN0cnVjdGlvbnMsIGRpbWVuc2lvbnMsIHJlcGVhdCwgY29vcmRpbmF0ZXMsIGNhbnZhcywgYm9hcmQpIHtcbiAgICAgICAgdGhpcy5zcHJpdGVzaGVldCA9IGltZztcbiAgICAgICAgdGhpcy5mcmFtZXMgPSBpbnN0cnVjdGlvbnMuZnJhbWVzO1xuICAgICAgICB0aGlzLnRpbWVzID0gaW5zdHJ1Y3Rpb25zLnRpbWVzO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBkaW1lbnNpb25zO1xuICAgICAgICB0aGlzLnJlcGVhdCA9IHJlcGVhdDtcbiAgICAgICAgdGhpcy5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgdGhpcy5ib2FyZCA9IGJvYXJkO1xuICAgIH1cbiAgICBzdGFydEFuaW1hdGlvbigpIHtcbiAgICAgICAgY29uc3QgY3VycmVudEZyYW1lID0gTWF0aC5mbG9vcigodGhpcy5ib2FyZC5jdXJyZW50VGljayAvIHRoaXMudGltZXNbMF0pICUgdGhpcy50aW1lcy5sZW5ndGgpO1xuICAgICAgICB0aGlzLnJlbmRlckZyYW1lKGN1cnJlbnRGcmFtZSk7XG4gICAgfVxuICAgIHJlbmRlckZyYW1lKGZyYW1lTnVtYmVyKSB7XG4gICAgICAgIHRoaXMuY2FudmFzLmdldENhbnZhc0NvbnRleHQoKS5kcmF3SW1hZ2UodGhpcy5zcHJpdGVzaGVldCwgdGhpcy5mcmFtZXNbZnJhbWVOdW1iZXJdLngwLCB0aGlzLmZyYW1lc1tmcmFtZU51bWJlcl0ueTAsIHRoaXMuZGltZW5zaW9ucy53aWR0aCwgdGhpcy5kaW1lbnNpb25zLmhlaWdodCwgdGhpcy5jb29yZGluYXRlcy54LCB0aGlzLmNvb3JkaW5hdGVzLnksIHRoaXMuZGltZW5zaW9ucy53aWR0aCwgdGhpcy5kaW1lbnNpb25zLmhlaWdodCk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gQW5pbWF0ZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgYW5pbWF0ZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2FuaW1hdGVcIikpO1xuY29uc3QgZGF0YV9qc29uXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL3Jlcy9kYXRhLmpzb25cIikpO1xuY29uc3QgY2FudmFzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vY2FudmFzXCIpKTtcbmNsYXNzIEJvYXJkIHtcbiAgICBjb25zdHJ1Y3RvcihpbWcpIHtcbiAgICAgICAgdGhpcy5ib2FyZCA9IFtdO1xuICAgICAgICB0aGlzLmJhbGxvb25zQm9hcmQgPSBbXTtcbiAgICAgICAgdGhpcy5wbGF5ZXJzQm9hcmQgPSBbXTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25zID0gW107XG4gICAgICAgIHRoaXMuY3VycmVudFRpY2sgPSAwO1xuICAgICAgICB0aGlzLmluY3JlbWVudFRpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGUuc3RhcnRBbmltYXRpb24oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGljaysrO1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFRpY2sgJSAyID09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVCYWxsb29ucygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0VGltZW91dCh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lLCAxMDAwIC8gMjAsIHRoaXMuaW5jcmVtZW50VGljayk7IC8vIH42MCBrbGF0ZWsvc1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNhbnZhcyA9IG5ldyBjYW52YXNfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuaW1nID0gaW1nO1xuICAgICAgICB0aGlzLmluY3JlbWVudFRpY2soKTtcbiAgICB9XG4gICAgc2V0Qm9hcmQoYm9hcmQpIHtcbiAgICAgICAgdGhpcy5ib2FyZCA9IGJvYXJkO1xuICAgICAgICB0aGlzLnVwZGF0ZUFuaW1hdGlvbnMoKTtcbiAgICB9XG4gICAgc2V0QmFsbG9vbnNCb2FyZChiYWxsb29uc0JvYXJkKSB7XG4gICAgICAgIHRoaXMuYmFsbG9vbnNCb2FyZCA9IGJhbGxvb25zQm9hcmQ7XG4gICAgICAgIHRoaXMudXBkYXRlQW5pbWF0aW9ucygpO1xuICAgIH1cbiAgICBzZXRQbGF5ZXJzQm9hcmQocGxheWVyc0JvYXJkKSB7XG4gICAgICAgIHRoaXMucGxheWVyc0JvYXJkID0gcGxheWVyc0JvYXJkO1xuICAgICAgICB0aGlzLnVwZGF0ZUFuaW1hdGlvbnMoKTtcbiAgICB9XG4gICAgdXBkYXRlQW5pbWF0aW9ucygpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmJvYXJkW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmJvYXJkW2ldW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJXXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQodGhpcy5pbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQud2FsbCwgZGF0YV9qc29uXzEuZGVmYXVsdC5kaW1lbnNpb25zLCB0cnVlLCB7IFwieFwiOiBpICogMTYsIFwieVwiOiBqICogMTYgfSwgdGhpcy5jYW52YXMsIHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiQlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLnB1c2gobmV3IGFuaW1hdGVfMS5kZWZhdWx0KHRoaXMuaW1nLCBkYXRhX2pzb25fMS5kZWZhdWx0LmJyaWNrcy5zb2xpZCwgZGF0YV9qc29uXzEuZGVmYXVsdC5kaW1lbnNpb25zLCB0cnVlLCB7IFwieFwiOiBpICogMTYsIFwieVwiOiBqICogMTYgfSwgdGhpcy5jYW52YXMsIHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLnB1c2gobmV3IGFuaW1hdGVfMS5kZWZhdWx0KHRoaXMuaW1nLCBkYXRhX2pzb25fMS5kZWZhdWx0LmdyYXNzLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IGkgKiAxNiwgXCJ5XCI6IGogKiAxNiB9LCB0aGlzLmNhbnZhcywgdGhpcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5iYWxsb29uc0JvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBiYWxsb29uID0gdGhpcy5iYWxsb29uc0JvYXJkW2ldO1xuICAgICAgICAgICAgaWYgKGJhbGxvb24uYWxpdmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQodGhpcy5pbWcsIGJhbGxvb24uZGlyZWN0aW9uID4gMSA/IGRhdGFfanNvbl8xLmRlZmF1bHQuYmFsbG9vbi5sZWZ0IDogZGF0YV9qc29uXzEuZGVmYXVsdC5iYWxsb29uLnJpZ2h0LCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IGJhbGxvb24ueCwgXCJ5XCI6IGJhbGxvb24ueSB9LCB0aGlzLmNhbnZhcywgdGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLnB1c2gobmV3IGFuaW1hdGVfMS5kZWZhdWx0KHRoaXMuaW1nLCBkYXRhX2pzb25fMS5kZWZhdWx0LmJhbGxvb24uZGVhdGgsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgZmFsc2UsIHsgXCJ4XCI6IGJhbGxvb24ueCwgXCJ5XCI6IGJhbGxvb24ueSB9LCB0aGlzLmNhbnZhcywgdGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzQm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMucGxheWVyc0JvYXJkW2ldO1xuICAgICAgICAgICAgaWYgKHBsYXllci5tb3ZpbmcpIHtcbiAgICAgICAgICAgICAgICBsZXQgZmFjaW5nO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAocGxheWVyLmRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBmYWNpbmcgPSBkYXRhX2pzb25fMS5kZWZhdWx0LnBsYXllci5kb3duO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2luZyA9IGRhdGFfanNvbl8xLmRlZmF1bHQucGxheWVyLnJpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2luZyA9IGRhdGFfanNvbl8xLmRlZmF1bHQucGxheWVyLnVwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2luZyA9IGRhdGFfanNvbl8xLmRlZmF1bHQucGxheWVyLmxlZnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQodGhpcy5pbWcsIGZhY2luZywgZGF0YV9qc29uXzEuZGVmYXVsdC5kaW1lbnNpb25zLCB0cnVlLCB7IFwieFwiOiBwbGF5ZXIueCwgXCJ5XCI6IHBsYXllci55IH0sIHRoaXMuY2FudmFzLCB0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghcGxheWVyLmFsaXZlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLnB1c2gobmV3IGFuaW1hdGVfMS5kZWZhdWx0KHRoaXMuaW1nLCBkYXRhX2pzb25fMS5kZWZhdWx0LnBsYXllci5kZWF0aCwgZGF0YV9qc29uXzEuZGVmYXVsdC5kaW1lbnNpb25zLCBmYWxzZSwgeyBcInhcIjogcGxheWVyLngsIFwieVwiOiBwbGF5ZXIueSB9LCB0aGlzLmNhbnZhcywgdGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLnB1c2gobmV3IGFuaW1hdGVfMS5kZWZhdWx0KHRoaXMuaW1nLCBkYXRhX2pzb25fMS5kZWZhdWx0LnBsYXllci5zdG9wLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IHBsYXllci54LCBcInlcIjogcGxheWVyLnkgfSwgdGhpcy5jYW52YXMsIHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBtb3ZlQmFsbG9vbnMoKSB7XG4gICAgICAgIHRoaXMuY2hlY2tGb3JDb2xsaXNpb25zKCk7XG4gICAgICAgIHRoaXMuYmFsbG9vbnNCb2FyZC5mb3JFYWNoKChiYWxsb29uKSA9PiB7XG4gICAgICAgICAgICBpZiAoYmFsbG9vbi5jb2xsaWRlcylcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBzd2l0Y2ggKGJhbGxvb24uZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBiYWxsb29uLnkgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBiYWxsb29uLnggKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBiYWxsb29uLnkgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICBiYWxsb29uLnggLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnVwZGF0ZUFuaW1hdGlvbnMoKTtcbiAgICB9XG4gICAgbW92ZVBsYXllcihpZCwga2V5KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzQm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMucGxheWVyc0JvYXJkW2ldO1xuICAgICAgICAgICAgaWYgKHBsYXllci5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgIHBsYXllci5tb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGVyZTJcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja1BsYXllck1vdmUocGxheWVyLCBrZXkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlQW5pbWF0aW9ucygpO1xuICAgIH1cbiAgICBzdG9wUGxheWVyKGlkKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzQm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMucGxheWVyc0JvYXJkW2ldO1xuICAgICAgICAgICAgaWYgKHBsYXllci5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgIHBsYXllci5tb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGVja1BsYXllck1vdmUocGxheWVyLCBrZXkpIHtcbiAgICAgICAgbGV0IHBvc2l0aW9uWCA9IE1hdGgucm91bmQocGxheWVyLnggLyAxNik7XG4gICAgICAgIGxldCBwb3NpdGlvblkgPSBNYXRoLnJvdW5kKHBsYXllci55IC8gMTYpO1xuICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgY2FzZSBcIkFycm93RG93blwiOlxuICAgICAgICAgICAgICAgIHBsYXllci5kaXJlY3Rpb24gPSAwO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uWSArPSAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkFycm93UmlnaHRcIjpcbiAgICAgICAgICAgICAgICBwbGF5ZXIuZGlyZWN0aW9uID0gMTtcbiAgICAgICAgICAgICAgICBwb3NpdGlvblggKz0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJBcnJvd1VwXCI6XG4gICAgICAgICAgICAgICAgcGxheWVyLmRpcmVjdGlvbiA9IDI7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25ZIC09IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQXJyb3dMZWZ0XCI6XG4gICAgICAgICAgICAgICAgcGxheWVyLmRpcmVjdGlvbiA9IDM7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25YIC09IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAocGxheWVyLmRpcmVjdGlvbikge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3Bvc2l0aW9uWF1bcG9zaXRpb25ZXSAhPSBcIldcIiAmJiB0aGlzLmJvYXJkW3Bvc2l0aW9uWF1bcG9zaXRpb25ZXSAhPSBcIkJcIiAmJiBwbGF5ZXIueSAlIDE2ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnggPSBNYXRoLnJvdW5kKHBsYXllci54IC8gMTYpICogMTY7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5kaXJlY3Rpb24gPT0gMCA/IHBsYXllci55ICs9IDEgOiBwbGF5ZXIueSAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib2FyZFtwb3NpdGlvblhdW3Bvc2l0aW9uWV0gIT0gXCJXXCIgJiYgdGhpcy5ib2FyZFtwb3NpdGlvblhdW3Bvc2l0aW9uWV0gIT0gXCJCXCIgJiYgcGxheWVyLnggJSAxNiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci55ID0gTWF0aC5yb3VuZChwbGF5ZXIueSAvIDE2KSAqIDE2O1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZGlyZWN0aW9uID09IDEgPyBwbGF5ZXIueCArPSAxIDogcGxheWVyLnggLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGxheWVyLngpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGVja0ZvckNvbGxpc2lvbnMoKSB7XG4gICAgICAgIHRoaXMuYmFsbG9vbnNCb2FyZC5mb3JFYWNoKChiYWxsb29uKSA9PiB7XG4gICAgICAgICAgICBsZXQgcG9zaXRpb25YID0gTWF0aC5mbG9vcihiYWxsb29uLnggLyAxNik7XG4gICAgICAgICAgICBsZXQgcG9zaXRpb25ZID0gTWF0aC5mbG9vcihiYWxsb29uLnkgLyAxNik7XG4gICAgICAgICAgICBpZiAocG9zaXRpb25YICE9IGJhbGxvb24ueCAvIDE2IHx8IHBvc2l0aW9uWSAhPSBiYWxsb29uLnkgLyAxNilcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBzd2l0Y2ggKGJhbGxvb24uZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblkrKztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblgrKztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblktLTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblgtLTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmFsbG9vbi53YWl0ID09IDApIHtcbiAgICAgICAgICAgICAgICBiYWxsb29uLmNvbGxpZGVzID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBiYWxsb29uLndhaXQtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3Bvc2l0aW9uWF1bcG9zaXRpb25ZXSA9PSBcIldcIiB8fCB0aGlzLmJvYXJkW3Bvc2l0aW9uWF1bcG9zaXRpb25ZXSA9PSBcIkJcIikge1xuICAgICAgICAgICAgICAgIGJhbGxvb24uY29sbGlkZXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJhbGxvb24ud2FpdCArPSAxNjtcbiAgICAgICAgICAgICAgICBiYWxsb29uLmRpcmVjdGlvbiA9IGJhbGxvb24uZGlyZWN0aW9uID09IDAgPyAzIDogYmFsbG9vbi5kaXJlY3Rpb24tLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gQm9hcmQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIENhbnZhcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuQ0VMTF9TSVpFID0gMTY7XG4gICAgICAgIHRoaXMuQ0FOVkFTX1dJRFRIID0gMzMgKiB0aGlzLkNFTExfU0laRTtcbiAgICAgICAgdGhpcy5DQU5WQVNfSEVJR0hUID0gMTMgKiB0aGlzLkNFTExfU0laRTtcbiAgICAgICAgdGhpcy5jcmVhdGVDYW52YXMoKTtcbiAgICB9XG4gICAgY3JlYXRlQ2FudmFzKCkge1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgIHRoaXMuY2FudmFzLmNsYXNzTmFtZSA9IFwibWFpbi1jYW52YXNcIjtcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLkNBTlZBU19XSURUSDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5DQU5WQVNfSEVJR0hUO1xuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJncmVlblwiO1xuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLkNBTlZBU19XSURUSCwgdGhpcy5DQU5WQVNfSEVJR0hUKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluLWNvbnRhaW5lclwiKS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gICAgfVxuICAgIGNsZWFyQ2FudmFzKCkge1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBcImdyZWVuXCI7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuQ0FOVkFTX1dJRFRILCB0aGlzLkNBTlZBU19IRUlHSFQpO1xuICAgIH1cbiAgICBkcmF3V29ybGQoKSB7XG4gICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAvLyBmaXJzdCBkcmF3IHJvd3NcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLkNBTlZBU19XSURUSCArIDE7IHgrKykge1xuICAgICAgICAgICAgdGhpcy5jdHgubW92ZVRvKHRoaXMuQ0VMTF9TSVpFICogeCwgMCk7XG4gICAgICAgICAgICAvLyB0aGlzIHdpbGwgZHJhdyB0aGUgbGluZVxuICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMuQ0VMTF9TSVpFICogeCwgdGhpcy5DQU5WQVNfV0lEVEggKiB0aGlzLkNFTExfU0laRSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLkNBTlZBU19XSURUSCArIDE7IHkrKykge1xuICAgICAgICAgICAgdGhpcy5jdHgubW92ZVRvKDAsIHRoaXMuQ0VMTF9TSVpFICogeSk7XG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8odGhpcy5DQU5WQVNfV0lEVEggKiB0aGlzLkNFTExfU0laRSwgdGhpcy5DRUxMX1NJWkUgKiB5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICB9XG4gICAgZ2V0Q2FudmFzQ29udGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IENhbnZhcztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQ29ubmVjdCB7XG4gICAgY29uc3RydWN0b3IodXJpKSB7XG4gICAgICAgIHRoaXMud2Vic29ja2V0ID0gbmV3IFdlYlNvY2tldCh1cmkpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy53ZWJzb2NrZXQub25vcGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvcGVuXCIpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLndlYnNvY2tldC5vbmVycm9yID0gKGV2KSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldik7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGdldFdlYlNvY2tldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2Vic29ja2V0O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IENvbm5lY3Q7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbm5lY3RfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9jb25uZWN0XCIpKTtcbmNvbnN0IGJvYXJkXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vYm9hcmRcIikpO1xuY29uc3QgcGxheWVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGxheWVyXCIpKTtcbmNvbnN0IGNvbm5lY3Rpb24gPSBuZXcgY29ubmVjdF8xLmRlZmF1bHQoXCJ3czovL3RvcnZhbi1ib21iZXJtYW4uY3Q4LnBsOjE5ODQvc29ja2V0cy9zZXJ2ZXIucGhwXCIpO1xuY29uc3Qgc29ja2V0ID0gY29ubmVjdGlvbi5nZXRXZWJTb2NrZXQoKTtcbmNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuaW1nLnNyYyA9IFwiLi9yZXMvc3ByaXRlc2hlZXQucG5nXCI7XG5jb25zdCBwbGF5ZXJJZCA9IDA7XG5jb25zdCBwbGF5ZXJzID0gW1xuICAgIG5ldyBwbGF5ZXJfMS5kZWZhdWx0KDAsIDAsIDE2ICogMTEsIDE2ICogNSwgdHJ1ZSwgZmFsc2UpXG5dO1xuaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBnYW1lQm9hcmQgPSBuZXcgYm9hcmRfMS5kZWZhdWx0KGltZyk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgY29uc3Qga2V5ID0gZS5rZXk7XG4gICAgICAgIGlmIChrZXkgPT0gXCJBcnJvd0xlZnRcIiB8fCBrZXkgPT0gXCJBcnJvd1JpZ2h0XCIgfHwga2V5ID09IFwiQXJyb3dVcFwiIHx8IGtleSA9PSBcIkFycm93RG93blwiKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhlcmVcIik7XG4gICAgICAgICAgICBnYW1lQm9hcmQubW92ZVBsYXllcihwbGF5ZXJJZCwga2V5KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoKSA9PiB7XG4gICAgICAgIGdhbWVCb2FyZC5zdG9wUGxheWVyKHBsYXllcklkKTtcbiAgICB9KTtcbiAgICBzb2NrZXQub25tZXNzYWdlID0gKGV2KSA9PiB7XG4gICAgICAgIGlmIChldi5kYXRhICE9IFwiXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFGcm9tU2VydmVyID0gSlNPTi5wYXJzZShldi5kYXRhKTtcbiAgICAgICAgICAgIGdhbWVCb2FyZC5zZXRCb2FyZChkYXRhRnJvbVNlcnZlci5ib2FyZCk7XG4gICAgICAgICAgICBnYW1lQm9hcmQuc2V0QmFsbG9vbnNCb2FyZChkYXRhRnJvbVNlcnZlci5iYWxsb29ucyk7XG4gICAgICAgICAgICBnYW1lQm9hcmQuc2V0UGxheWVyc0JvYXJkKHBsYXllcnMpO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IoaWQsIGRpcmVjdGlvbiwgeCwgeSwgYWxpdmUsIG1vdmluZykge1xuICAgICAgICB0aGlzLmNvbGxpZGVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIHRoaXMuYWxpdmUgPSBhbGl2ZTtcbiAgICAgICAgdGhpcy5tb3ZpbmcgPSBtb3Zpbmc7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gUGxheWVyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc2NyaXB0cy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
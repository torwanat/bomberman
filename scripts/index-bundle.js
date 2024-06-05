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
const connection = new connect_1.default("ws://torvan-bomberman.ct8.pl:1984/sockets/server.php");
const socket = connection.getWebSocket();
const img = new Image();
img.src = "./res/spritesheet.png";
img.onload = function () {
    const gameBoard = new board_1.default(img);
    socket.onmessage = (ev) => {
        if (ev.data != "") {
            const dataFromServer = JSON.parse(ev.data);
            gameBoard.setBoard(dataFromServer.board);
            gameBoard.setBalloonsBoard(dataFromServer.balloons);
        }
    };
};


/***/ }),

/***/ "./res/data.json":
/*!***********************!*\
  !*** ./res/data.json ***!
  \***********************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"dimensions":{"width":16,"height":16},"player":{"left":{"frames":[{"x0":0,"y0":0},{"x0":16,"y0":0},{"x0":32,"y0":0}],"times":[30,30,30]},"right":{"frames":[{"x0":0,"y0":16},{"x0":16,"y0":16},{"x0":32,"y0":16}],"times":[30,30,30]},"up":{"frames":[{"x0":48,"y0":16},{"x0":64,"y0":16},{"x0":80,"y0":16}],"times":[30,30,30]},"down":{"frames":[{"x0":48,"y0":0},{"x0":64,"y0":0},{"x0":80,"y0":0}],"times":[30,30,30]},"death":{"frames":[{"x0":0,"y0":32},{"x0":16,"y0":32},{"x0":32,"y0":32},{"x0":48,"y0":32},{"x0":64,"y0":32},{"x0":80,"y0":32},{"x0":96,"y0":32}],"times":[30,30,30,30,30,30,30]}},"bomb":{"charge":{"frames":[{"x0":0,"y0":48},{"x0":16,"y0":48},{"x0":32,"y0":48}],"times":[30,30,30]},"explosion":{}},"wall":{"frames":[{"x0":48,"y0":48}],"times":[30]},"bricks":{"solid":{"frames":[{"x0":64,"y0":48}],"times":[30]},"destruction":{"frames":[{"x0":80,"y0":48},{"x0":96,"y0":48},{"x0":112,"y0":48},{"x0":128,"y0":48},{"x0":144,"y0":48},{"x0":160,"y0":48}],"times":[30,30,30,30,30,30]}},"balloon":{"left":{"frames":[{"x0":48,"y0":240},{"x0":64,"y0":240},{"x0":80,"y0":240}],"times":[10,10,10]},"right":{"frames":[{"x0":0,"y0":240},{"x0":16,"y0":240},{"x0":32,"y0":240}],"times":[10,10,10]},"death":{"frames":[{"x0":96,"y0":240},{"x0":112,"y0":240},{"x0":128,"y0":240},{"x0":144,"y0":240}],"times":[10,10,10,10]}},"powerup":{"frames":[{"x0":0,"y0":224}],"times":[30]},"grass":{"frames":[{"x0":0,"y0":64}],"times":[30]}}');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NjcmlwdHMvYW5pbWF0ZS50cyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2JvYXJkLnRzIiwid2VicGFjazovLy8uL3NjcmlwdHMvY2FudmFzLnRzIiwid2VicGFjazovLy8uL3NjcmlwdHMvY29ubmVjdC50cyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2luZGV4LnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBBbmltYXRlIHtcbiAgICBjb25zdHJ1Y3RvcihpbWcsIGluc3RydWN0aW9ucywgZGltZW5zaW9ucywgcmVwZWF0LCBjb29yZGluYXRlcywgY2FudmFzLCBib2FyZCkge1xuICAgICAgICB0aGlzLnNwcml0ZXNoZWV0ID0gaW1nO1xuICAgICAgICB0aGlzLmZyYW1lcyA9IGluc3RydWN0aW9ucy5mcmFtZXM7XG4gICAgICAgIHRoaXMudGltZXMgPSBpbnN0cnVjdGlvbnMudGltZXM7XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XG4gICAgICAgIHRoaXMucmVwZWF0ID0gcmVwZWF0O1xuICAgICAgICB0aGlzLmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgICAgICB0aGlzLmJvYXJkID0gYm9hcmQ7XG4gICAgfVxuICAgIHN0YXJ0QW5pbWF0aW9uKCkge1xuICAgICAgICBjb25zdCBjdXJyZW50RnJhbWUgPSBNYXRoLmZsb29yKCh0aGlzLmJvYXJkLmN1cnJlbnRUaWNrIC8gdGhpcy50aW1lc1swXSkgJSB0aGlzLnRpbWVzLmxlbmd0aCk7XG4gICAgICAgIHRoaXMucmVuZGVyRnJhbWUoY3VycmVudEZyYW1lKTtcbiAgICB9XG4gICAgcmVuZGVyRnJhbWUoZnJhbWVOdW1iZXIpIHtcbiAgICAgICAgdGhpcy5jYW52YXMuZ2V0Q2FudmFzQ29udGV4dCgpLmRyYXdJbWFnZSh0aGlzLnNwcml0ZXNoZWV0LCB0aGlzLmZyYW1lc1tmcmFtZU51bWJlcl0ueDAsIHRoaXMuZnJhbWVzW2ZyYW1lTnVtYmVyXS55MCwgdGhpcy5kaW1lbnNpb25zLndpZHRoLCB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0LCB0aGlzLmNvb3JkaW5hdGVzLngsIHRoaXMuY29vcmRpbmF0ZXMueSwgdGhpcy5kaW1lbnNpb25zLndpZHRoLCB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0KTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBBbmltYXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhbmltYXRlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vYW5pbWF0ZVwiKSk7XG5jb25zdCBkYXRhX2pzb25fMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vcmVzL2RhdGEuanNvblwiKSk7XG5jb25zdCBjYW52YXNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9jYW52YXNcIikpO1xuY2xhc3MgQm9hcmQge1xuICAgIGNvbnN0cnVjdG9yKGltZykge1xuICAgICAgICB0aGlzLmJvYXJkID0gW107XG4gICAgICAgIHRoaXMuYmFsbG9vbnNCb2FyZCA9IFtdO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbnMgPSBbXTtcbiAgICAgICAgdGhpcy5jdXJyZW50VGljayA9IDA7XG4gICAgICAgIHRoaXMuaW5jcmVtZW50VGljayA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5mb3JFYWNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5zdGFydEFuaW1hdGlvbigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUaWNrKys7XG4gICAgICAgICAgICBpZiAoKHRoaXMuY3VycmVudFRpY2sgJSAxNikgJSA0ID09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVCYWxsb29ucygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0VGltZW91dCh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lLCAxMDAwIC8gNjAsIHRoaXMuaW5jcmVtZW50VGljayk7IC8vIH42MCBrbGF0ZWsvc1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNhbnZhcyA9IG5ldyBjYW52YXNfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuaW1nID0gaW1nO1xuICAgICAgICB0aGlzLmluY3JlbWVudFRpY2soKTtcbiAgICB9XG4gICAgc2V0Qm9hcmQoYm9hcmQpIHtcbiAgICAgICAgdGhpcy5ib2FyZCA9IGJvYXJkO1xuICAgICAgICB0aGlzLnVwZGF0ZUFuaW1hdGlvbnMoKTtcbiAgICB9XG4gICAgc2V0QmFsbG9vbnNCb2FyZChiYWxsb29uc0JvYXJkKSB7XG4gICAgICAgIHRoaXMuYmFsbG9vbnNCb2FyZCA9IGJhbGxvb25zQm9hcmQ7XG4gICAgICAgIHRoaXMudXBkYXRlQW5pbWF0aW9ucygpO1xuICAgIH1cbiAgICB1cGRhdGVBbmltYXRpb25zKCkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuYm9hcmRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMuYm9hcmRbaV1bal0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIldcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdCh0aGlzLmltZywgZGF0YV9qc29uXzEuZGVmYXVsdC53YWxsLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IGkgKiAxNiwgXCJ5XCI6IGogKiAxNiB9LCB0aGlzLmNhbnZhcywgdGhpcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJCXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQodGhpcy5pbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQuYnJpY2tzLnNvbGlkLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IGkgKiAxNiwgXCJ5XCI6IGogKiAxNiB9LCB0aGlzLmNhbnZhcywgdGhpcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQodGhpcy5pbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQuZ3Jhc3MsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgdHJ1ZSwgeyBcInhcIjogaSAqIDE2LCBcInlcIjogaiAqIDE2IH0sIHRoaXMuY2FudmFzLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJhbGxvb25zQm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGJhbGxvb24gPSB0aGlzLmJhbGxvb25zQm9hcmRbaV07XG4gICAgICAgICAgICBpZiAoYmFsbG9vbi5hbGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdCh0aGlzLmltZywgYmFsbG9vbi5kaXJlY3Rpb24gPiAxID8gZGF0YV9qc29uXzEuZGVmYXVsdC5iYWxsb29uLmxlZnQgOiBkYXRhX2pzb25fMS5kZWZhdWx0LmJhbGxvb24ucmlnaHQsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgdHJ1ZSwgeyBcInhcIjogYmFsbG9vbi54LCBcInlcIjogYmFsbG9vbi55IH0sIHRoaXMuY2FudmFzLCB0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQodGhpcy5pbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQuYmFsbG9vbi5kZWF0aCwgZGF0YV9qc29uXzEuZGVmYXVsdC5kaW1lbnNpb25zLCBmYWxzZSwgeyBcInhcIjogYmFsbG9vbi54LCBcInlcIjogYmFsbG9vbi55IH0sIHRoaXMuY2FudmFzLCB0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbW92ZUJhbGxvb25zKCkge1xuICAgICAgICB0aGlzLmNoZWNrRm9yQ29sbGlzaW9ucygpO1xuICAgICAgICB0aGlzLmJhbGxvb25zQm9hcmQuZm9yRWFjaCgoYmFsbG9vbikgPT4ge1xuICAgICAgICAgICAgaWYgKGJhbGxvb24uY29sbGlkZXMpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgc3dpdGNoIChiYWxsb29uLmRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgYmFsbG9vbi55ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgYmFsbG9vbi54ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgYmFsbG9vbi55IC09IDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgYmFsbG9vbi54IC09IDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51cGRhdGVBbmltYXRpb25zKCk7XG4gICAgfVxuICAgIGNoZWNrRm9yQ29sbGlzaW9ucygpIHtcbiAgICAgICAgdGhpcy5iYWxsb29uc0JvYXJkLmZvckVhY2goKGJhbGxvb24pID0+IHtcbiAgICAgICAgICAgIGxldCBwb3NpdGlvblggPSBNYXRoLmZsb29yKGJhbGxvb24ueCAvIDE2KTtcbiAgICAgICAgICAgIGxldCBwb3NpdGlvblkgPSBNYXRoLmZsb29yKGJhbGxvb24ueSAvIDE2KTtcbiAgICAgICAgICAgIGlmIChwb3NpdGlvblggIT0gYmFsbG9vbi54IC8gMTYgfHwgcG9zaXRpb25ZICE9IGJhbGxvb24ueSAvIDE2KVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHN3aXRjaCAoYmFsbG9vbi5kaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uWSsrO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uWCsrO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uWS0tO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uWC0tO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiYWxsb29uLndhaXQgPT0gMCkge1xuICAgICAgICAgICAgICAgIGJhbGxvb24uY29sbGlkZXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGJhbGxvb24ud2FpdC0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbcG9zaXRpb25YXVtwb3NpdGlvblldID09IFwiV1wiIHx8IHRoaXMuYm9hcmRbcG9zaXRpb25YXVtwb3NpdGlvblldID09IFwiQlwiKSB7XG4gICAgICAgICAgICAgICAgYmFsbG9vbi5jb2xsaWRlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgYmFsbG9vbi53YWl0ICs9IDE2O1xuICAgICAgICAgICAgICAgIGJhbGxvb24uZGlyZWN0aW9uID0gYmFsbG9vbi5kaXJlY3Rpb24gPT0gMCA/IDMgOiBiYWxsb29uLmRpcmVjdGlvbi0tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBCb2FyZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQ2FudmFzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5DRUxMX1NJWkUgPSAxNjtcbiAgICAgICAgdGhpcy5DQU5WQVNfV0lEVEggPSAzMyAqIHRoaXMuQ0VMTF9TSVpFO1xuICAgICAgICB0aGlzLkNBTlZBU19IRUlHSFQgPSAxMyAqIHRoaXMuQ0VMTF9TSVpFO1xuICAgICAgICB0aGlzLmNyZWF0ZUNhbnZhcygpO1xuICAgIH1cbiAgICBjcmVhdGVDYW52YXMoKSB7XG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgdGhpcy5jYW52YXMuY2xhc3NOYW1lID0gXCJtYWluLWNhbnZhc1wiO1xuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuQ0FOVkFTX1dJRFRIO1xuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLkNBTlZBU19IRUlHSFQ7XG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBcImdyZWVuXCI7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuQ0FOVkFTX1dJRFRILCB0aGlzLkNBTlZBU19IRUlHSFQpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW4tY29udGFpbmVyXCIpLmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcbiAgICB9XG4gICAgY2xlYXJDYW52YXMoKSB7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5DQU5WQVNfV0lEVEgsIHRoaXMuQ0FOVkFTX0hFSUdIVCk7XG4gICAgfVxuICAgIGRyYXdXb3JsZCgpIHtcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIC8vIGZpcnN0IGRyYXcgcm93c1xuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuQ0FOVkFTX1dJRFRIICsgMTsgeCsrKSB7XG4gICAgICAgICAgICB0aGlzLmN0eC5tb3ZlVG8odGhpcy5DRUxMX1NJWkUgKiB4LCAwKTtcbiAgICAgICAgICAgIC8vIHRoaXMgd2lsbCBkcmF3IHRoZSBsaW5lXG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8odGhpcy5DRUxMX1NJWkUgKiB4LCB0aGlzLkNBTlZBU19XSURUSCAqIHRoaXMuQ0VMTF9TSVpFKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuQ0FOVkFTX1dJRFRIICsgMTsgeSsrKSB7XG4gICAgICAgICAgICB0aGlzLmN0eC5tb3ZlVG8oMCwgdGhpcy5DRUxMX1NJWkUgKiB5KTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLkNBTlZBU19XSURUSCAqIHRoaXMuQ0VMTF9TSVpFLCB0aGlzLkNFTExfU0laRSAqIHkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgICBnZXRDYW52YXNDb250ZXh0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdHg7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gQ2FudmFzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBDb25uZWN0IHtcbiAgICBjb25zdHJ1Y3Rvcih1cmkpIHtcbiAgICAgICAgdGhpcy53ZWJzb2NrZXQgPSBuZXcgV2ViU29ja2V0KHVyaSk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLndlYnNvY2tldC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9wZW5cIik7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMud2Vic29ja2V0Lm9uZXJyb3IgPSAoZXYpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2KTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZ2V0V2ViU29ja2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy53ZWJzb2NrZXQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gQ29ubmVjdDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY29ubmVjdF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2Nvbm5lY3RcIikpO1xuY29uc3QgYm9hcmRfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9ib2FyZFwiKSk7XG5jb25zdCBjb25uZWN0aW9uID0gbmV3IGNvbm5lY3RfMS5kZWZhdWx0KFwid3M6Ly90b3J2YW4tYm9tYmVybWFuLmN0OC5wbDoxOTg0L3NvY2tldHMvc2VydmVyLnBocFwiKTtcbmNvbnN0IHNvY2tldCA9IGNvbm5lY3Rpb24uZ2V0V2ViU29ja2V0KCk7XG5jb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbmltZy5zcmMgPSBcIi4vcmVzL3Nwcml0ZXNoZWV0LnBuZ1wiO1xuaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBnYW1lQm9hcmQgPSBuZXcgYm9hcmRfMS5kZWZhdWx0KGltZyk7XG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IChldikgPT4ge1xuICAgICAgICBpZiAoZXYuZGF0YSAhPSBcIlwiKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhRnJvbVNlcnZlciA9IEpTT04ucGFyc2UoZXYuZGF0YSk7XG4gICAgICAgICAgICBnYW1lQm9hcmQuc2V0Qm9hcmQoZGF0YUZyb21TZXJ2ZXIuYm9hcmQpO1xuICAgICAgICAgICAgZ2FtZUJvYXJkLnNldEJhbGxvb25zQm9hcmQoZGF0YUZyb21TZXJ2ZXIuYmFsbG9vbnMpO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zY3JpcHRzL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
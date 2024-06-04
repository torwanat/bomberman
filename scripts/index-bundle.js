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
    constructor(img, instructions, dimensions, repeat, coordinates, canvas) {
        this.spritesheet = img;
        this.frames = instructions.frames;
        this.times = instructions.times;
        this.dimensions = dimensions;
        this.repeat = repeat;
        this.coordinates = coordinates;
        this.canvas = canvas;
    }
    startAnimation() {
        const currentFrame = Math.floor((Animate.currentTick / this.times[0]) % this.times.length);
        this.renderFrame(currentFrame);
    }
    renderFrame(frameNumber) {
        this.canvas.getCanvasContext().drawImage(this.spritesheet, this.frames[frameNumber].x0, this.frames[frameNumber].y0, this.dimensions.width, this.dimensions.height, this.coordinates.x, this.coordinates.y, this.dimensions.width, this.dimensions.height);
    }
}
Animate.currentTick = 0;
Animate.animations = [];
Animate.incrementTick = () => {
    Animate.animations.forEach((e) => {
        e.startAnimation();
    });
    Animate.currentTick++;
    setTimeout(window.requestAnimationFrame, 1000 / 60, Animate.incrementTick); // ~60 klatek/s
};
exports["default"] = Animate;


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
const canvas_1 = __importDefault(__webpack_require__(/*! ./canvas */ "./scripts/canvas.ts"));
const data_json_1 = __importDefault(__webpack_require__(/*! ../res/data.json */ "./res/data.json"));
const animate_1 = __importDefault(__webpack_require__(/*! ./animate */ "./scripts/animate.ts"));
const connect_1 = __importDefault(__webpack_require__(/*! ./connect */ "./scripts/connect.ts"));
const drawBoard = (board) => {
    const boardAnimations = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            switch (board[i][j]) {
                case "W":
                    boardAnimations.push(new animate_1.default(img, data_json_1.default.wall, data_json_1.default.dimensions, true, { "x": i * 16, "y": j * 16 }, w));
                    break;
                case "B":
                    boardAnimations.push(new animate_1.default(img, data_json_1.default.bricks.solid, data_json_1.default.dimensions, true, { "x": i * 16, "y": j * 16 }, w));
                    break;
                default:
                    boardAnimations.push(new animate_1.default(img, data_json_1.default.grass, data_json_1.default.dimensions, true, { "x": i * 16, "y": j * 16 }, w));
                    break;
            }
        }
    }
    return boardAnimations;
};
const drawBalloons = (balloons) => {
    const balloonsAnimations = [];
    for (let i = 0; i < balloons.length; i++) {
        const balloon = balloons[i];
        if (balloon.alive) {
            balloonsAnimations.push(new animate_1.default(img, balloon.direction > 1 ? data_json_1.default.balloon.left : data_json_1.default.balloon.right, data_json_1.default.dimensions, true, { "x": balloon.x, "y": balloon.y }, w));
        }
        else {
            balloonsAnimations.push(new animate_1.default(img, data_json_1.default.balloon.death, data_json_1.default.dimensions, false, { "x": balloon.x, "y": balloon.y }, w));
        }
    }
    return balloonsAnimations;
};
const connection = new connect_1.default("ws://torvan-bomberman.ct8.pl:1984/sockets/server.php");
const socket = connection.getWebSocket();
const w = new canvas_1.default();
// w.drawWorld();
let boardAnimations = [];
let balloonsAnimations = [];
const img = new Image();
img.src = "./res/spritesheet.png";
animate_1.default.incrementTick();
img.onload = function () {
    socket.onmessage = (ev) => {
        if (ev.data != "") {
            const dataFromServer = JSON.parse(ev.data);
            boardAnimations = drawBoard(dataFromServer.board);
            balloonsAnimations = drawBalloons(dataFromServer.balloons);
            animate_1.default.animations = boardAnimations.concat(balloonsAnimations);
        }
    };
};


/***/ }),

/***/ "./res/data.json":
/*!***********************!*\
  !*** ./res/data.json ***!
  \***********************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"dimensions":{"width":16,"height":16},"player":{"left":{"frames":[{"x0":0,"y0":0},{"x0":16,"y0":0},{"x0":32,"y0":0}],"times":[30,30,30]},"right":{"frames":[{"x0":0,"y0":16},{"x0":16,"y0":16},{"x0":32,"y0":16}],"times":[30,30,30]},"up":{"frames":[{"x0":48,"y0":16},{"x0":64,"y0":16},{"x0":80,"y0":16}],"times":[30,30,30]},"down":{"frames":[{"x0":48,"y0":0},{"x0":64,"y0":0},{"x0":80,"y0":0}],"times":[30,30,30]},"death":{"frames":[{"x0":0,"y0":32},{"x0":16,"y0":32},{"x0":32,"y0":32},{"x0":48,"y0":32},{"x0":64,"y0":32},{"x0":80,"y0":32},{"x0":96,"y0":32}],"times":[30,30,30,30,30,30,30]}},"bomb":{"charge":{"frames":[{"x0":0,"y0":48},{"x0":16,"y0":48},{"x0":32,"y0":48}],"times":[30,30,30]},"explosion":{}},"wall":{"frames":[{"x0":48,"y0":48}],"times":[30]},"bricks":{"solid":{"frames":[{"x0":64,"y0":48}],"times":[30]},"destruction":{"frames":[{"x0":80,"y0":48},{"x0":96,"y0":48},{"x0":112,"y0":48},{"x0":128,"y0":48},{"x0":144,"y0":48},{"x0":160,"y0":48}],"times":[30,30,30,30,30,30]}},"balloon":{"left":{"frames":[{"x0":48,"y0":240},{"x0":64,"y0":240},{"x0":80,"y0":240}],"times":[30,30,30]},"right":{"frames":[{"x0":0,"y0":240},{"x0":16,"y0":240},{"x0":32,"y0":240}],"times":[30,30,30]},"death":{"frames":[{"x0":96,"y0":240},{"x0":112,"y0":240},{"x0":128,"y0":240},{"x0":144,"y0":240}],"times":[30,30,30,30]}},"powerup":{"frames":[{"x0":0,"y0":224}],"times":[30]},"grass":{"frames":[{"x0":0,"y0":64}],"times":[30]}}');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZ0ZBQWdGO0FBQ2hGO0FBQ0Esa0JBQWU7Ozs7Ozs7Ozs7O0FDN0JGO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QiwyQkFBMkI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMkJBQTJCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFlOzs7Ozs7Ozs7OztBQ3pDRjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWU7Ozs7Ozs7Ozs7O0FDbkJGO0FBQ2I7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsaUNBQWlDLG1CQUFPLENBQUMscUNBQVU7QUFDbkQsb0NBQW9DLG1CQUFPLENBQUMseUNBQWtCO0FBQzlELGtDQUFrQyxtQkFBTyxDQUFDLHVDQUFXO0FBQ3JELGtDQUFrQyxtQkFBTyxDQUFDLHVDQUFXO0FBQ3JEO0FBQ0E7QUFDQSxvQkFBb0Isa0JBQWtCO0FBQ3RDLHdCQUF3QixxQkFBcUI7QUFDN0M7QUFDQTtBQUNBLHNJQUFzSSwwQkFBMEI7QUFDaEs7QUFDQTtBQUNBLDhJQUE4SSwwQkFBMEI7QUFDeEs7QUFDQTtBQUNBLHVJQUF1SSwwQkFBMEI7QUFDaks7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixxQkFBcUI7QUFDekM7QUFDQTtBQUNBLHFNQUFxTSxnQ0FBZ0M7QUFDck87QUFDQTtBQUNBLDJJQUEySSxnQ0FBZ0M7QUFDM0s7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7VUMzREE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NjcmlwdHMvYW5pbWF0ZS50cyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2NhbnZhcy50cyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2Nvbm5lY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9pbmRleC50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQW5pbWF0ZSB7XG4gICAgY29uc3RydWN0b3IoaW1nLCBpbnN0cnVjdGlvbnMsIGRpbWVuc2lvbnMsIHJlcGVhdCwgY29vcmRpbmF0ZXMsIGNhbnZhcykge1xuICAgICAgICB0aGlzLnNwcml0ZXNoZWV0ID0gaW1nO1xuICAgICAgICB0aGlzLmZyYW1lcyA9IGluc3RydWN0aW9ucy5mcmFtZXM7XG4gICAgICAgIHRoaXMudGltZXMgPSBpbnN0cnVjdGlvbnMudGltZXM7XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XG4gICAgICAgIHRoaXMucmVwZWF0ID0gcmVwZWF0O1xuICAgICAgICB0aGlzLmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgIH1cbiAgICBzdGFydEFuaW1hdGlvbigpIHtcbiAgICAgICAgY29uc3QgY3VycmVudEZyYW1lID0gTWF0aC5mbG9vcigoQW5pbWF0ZS5jdXJyZW50VGljayAvIHRoaXMudGltZXNbMF0pICUgdGhpcy50aW1lcy5sZW5ndGgpO1xuICAgICAgICB0aGlzLnJlbmRlckZyYW1lKGN1cnJlbnRGcmFtZSk7XG4gICAgfVxuICAgIHJlbmRlckZyYW1lKGZyYW1lTnVtYmVyKSB7XG4gICAgICAgIHRoaXMuY2FudmFzLmdldENhbnZhc0NvbnRleHQoKS5kcmF3SW1hZ2UodGhpcy5zcHJpdGVzaGVldCwgdGhpcy5mcmFtZXNbZnJhbWVOdW1iZXJdLngwLCB0aGlzLmZyYW1lc1tmcmFtZU51bWJlcl0ueTAsIHRoaXMuZGltZW5zaW9ucy53aWR0aCwgdGhpcy5kaW1lbnNpb25zLmhlaWdodCwgdGhpcy5jb29yZGluYXRlcy54LCB0aGlzLmNvb3JkaW5hdGVzLnksIHRoaXMuZGltZW5zaW9ucy53aWR0aCwgdGhpcy5kaW1lbnNpb25zLmhlaWdodCk7XG4gICAgfVxufVxuQW5pbWF0ZS5jdXJyZW50VGljayA9IDA7XG5BbmltYXRlLmFuaW1hdGlvbnMgPSBbXTtcbkFuaW1hdGUuaW5jcmVtZW50VGljayA9ICgpID0+IHtcbiAgICBBbmltYXRlLmFuaW1hdGlvbnMuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgICBlLnN0YXJ0QW5pbWF0aW9uKCk7XG4gICAgfSk7XG4gICAgQW5pbWF0ZS5jdXJyZW50VGljaysrO1xuICAgIHNldFRpbWVvdXQod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSwgMTAwMCAvIDYwLCBBbmltYXRlLmluY3JlbWVudFRpY2spOyAvLyB+NjAga2xhdGVrL3Ncbn07XG5leHBvcnRzLmRlZmF1bHQgPSBBbmltYXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBDYW52YXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkNFTExfU0laRSA9IDE2O1xuICAgICAgICB0aGlzLkNBTlZBU19XSURUSCA9IDMzICogdGhpcy5DRUxMX1NJWkU7XG4gICAgICAgIHRoaXMuQ0FOVkFTX0hFSUdIVCA9IDEzICogdGhpcy5DRUxMX1NJWkU7XG4gICAgICAgIHRoaXMuY3JlYXRlQ2FudmFzKCk7XG4gICAgfVxuICAgIGNyZWF0ZUNhbnZhcygpIHtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICB0aGlzLmNhbnZhcy5jbGFzc05hbWUgPSBcIm1haW4tY2FudmFzXCI7XG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5DQU5WQVNfV0lEVEg7XG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuQ0FOVkFTX0hFSUdIVDtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5DQU5WQVNfV0lEVEgsIHRoaXMuQ0FOVkFTX0hFSUdIVCk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1jb250YWluZXJcIikuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuICAgIH1cbiAgICBjbGVhckNhbnZhcygpIHtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJncmVlblwiO1xuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLkNBTlZBU19XSURUSCwgdGhpcy5DQU5WQVNfSEVJR0hUKTtcbiAgICB9XG4gICAgZHJhd1dvcmxkKCkge1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgLy8gZmlyc3QgZHJhdyByb3dzXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5DQU5WQVNfV0lEVEggKyAxOyB4KyspIHtcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbyh0aGlzLkNFTExfU0laRSAqIHgsIDApO1xuICAgICAgICAgICAgLy8gdGhpcyB3aWxsIGRyYXcgdGhlIGxpbmVcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLkNFTExfU0laRSAqIHgsIHRoaXMuQ0FOVkFTX1dJRFRIICogdGhpcy5DRUxMX1NJWkUpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5DQU5WQVNfV0lEVEggKyAxOyB5KyspIHtcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCB0aGlzLkNFTExfU0laRSAqIHkpO1xuICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMuQ0FOVkFTX1dJRFRIICogdGhpcy5DRUxMX1NJWkUsIHRoaXMuQ0VMTF9TSVpFICogeSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgfVxuICAgIGdldENhbnZhc0NvbnRleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN0eDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBDYW52YXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIENvbm5lY3Qge1xuICAgIGNvbnN0cnVjdG9yKHVyaSkge1xuICAgICAgICB0aGlzLndlYnNvY2tldCA9IG5ldyBXZWJTb2NrZXQodXJpKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMud2Vic29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3BlblwiKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy53ZWJzb2NrZXQub25lcnJvciA9IChldikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXYpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXRXZWJTb2NrZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndlYnNvY2tldDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBDb25uZWN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjYW52YXNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9jYW52YXNcIikpO1xuY29uc3QgZGF0YV9qc29uXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL3Jlcy9kYXRhLmpzb25cIikpO1xuY29uc3QgYW5pbWF0ZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2FuaW1hdGVcIikpO1xuY29uc3QgY29ubmVjdF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2Nvbm5lY3RcIikpO1xuY29uc3QgZHJhd0JvYXJkID0gKGJvYXJkKSA9PiB7XG4gICAgY29uc3QgYm9hcmRBbmltYXRpb25zID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGJvYXJkW2ldW2pdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIldcIjpcbiAgICAgICAgICAgICAgICAgICAgYm9hcmRBbmltYXRpb25zLnB1c2gobmV3IGFuaW1hdGVfMS5kZWZhdWx0KGltZywgZGF0YV9qc29uXzEuZGVmYXVsdC53YWxsLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IGkgKiAxNiwgXCJ5XCI6IGogKiAxNiB9LCB3KSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJCXCI6XG4gICAgICAgICAgICAgICAgICAgIGJvYXJkQW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdChpbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQuYnJpY2tzLnNvbGlkLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IGkgKiAxNiwgXCJ5XCI6IGogKiAxNiB9LCB3KSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJvYXJkQW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdChpbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQuZ3Jhc3MsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgdHJ1ZSwgeyBcInhcIjogaSAqIDE2LCBcInlcIjogaiAqIDE2IH0sIHcpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJvYXJkQW5pbWF0aW9ucztcbn07XG5jb25zdCBkcmF3QmFsbG9vbnMgPSAoYmFsbG9vbnMpID0+IHtcbiAgICBjb25zdCBiYWxsb29uc0FuaW1hdGlvbnMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJhbGxvb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGJhbGxvb24gPSBiYWxsb29uc1tpXTtcbiAgICAgICAgaWYgKGJhbGxvb24uYWxpdmUpIHtcbiAgICAgICAgICAgIGJhbGxvb25zQW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdChpbWcsIGJhbGxvb24uZGlyZWN0aW9uID4gMSA/IGRhdGFfanNvbl8xLmRlZmF1bHQuYmFsbG9vbi5sZWZ0IDogZGF0YV9qc29uXzEuZGVmYXVsdC5iYWxsb29uLnJpZ2h0LCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IGJhbGxvb24ueCwgXCJ5XCI6IGJhbGxvb24ueSB9LCB3KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBiYWxsb29uc0FuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQoaW1nLCBkYXRhX2pzb25fMS5kZWZhdWx0LmJhbGxvb24uZGVhdGgsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgZmFsc2UsIHsgXCJ4XCI6IGJhbGxvb24ueCwgXCJ5XCI6IGJhbGxvb24ueSB9LCB3KSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJhbGxvb25zQW5pbWF0aW9ucztcbn07XG5jb25zdCBjb25uZWN0aW9uID0gbmV3IGNvbm5lY3RfMS5kZWZhdWx0KFwid3M6Ly90b3J2YW4tYm9tYmVybWFuLmN0OC5wbDoxOTg0L3NvY2tldHMvc2VydmVyLnBocFwiKTtcbmNvbnN0IHNvY2tldCA9IGNvbm5lY3Rpb24uZ2V0V2ViU29ja2V0KCk7XG5jb25zdCB3ID0gbmV3IGNhbnZhc18xLmRlZmF1bHQoKTtcbi8vIHcuZHJhd1dvcmxkKCk7XG5sZXQgYm9hcmRBbmltYXRpb25zID0gW107XG5sZXQgYmFsbG9vbnNBbmltYXRpb25zID0gW107XG5jb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbmltZy5zcmMgPSBcIi4vcmVzL3Nwcml0ZXNoZWV0LnBuZ1wiO1xuYW5pbWF0ZV8xLmRlZmF1bHQuaW5jcmVtZW50VGljaygpO1xuaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzb2NrZXQub25tZXNzYWdlID0gKGV2KSA9PiB7XG4gICAgICAgIGlmIChldi5kYXRhICE9IFwiXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFGcm9tU2VydmVyID0gSlNPTi5wYXJzZShldi5kYXRhKTtcbiAgICAgICAgICAgIGJvYXJkQW5pbWF0aW9ucyA9IGRyYXdCb2FyZChkYXRhRnJvbVNlcnZlci5ib2FyZCk7XG4gICAgICAgICAgICBiYWxsb29uc0FuaW1hdGlvbnMgPSBkcmF3QmFsbG9vbnMoZGF0YUZyb21TZXJ2ZXIuYmFsbG9vbnMpO1xuICAgICAgICAgICAgYW5pbWF0ZV8xLmRlZmF1bHQuYW5pbWF0aW9ucyA9IGJvYXJkQW5pbWF0aW9ucy5jb25jYXQoYmFsbG9vbnNBbmltYXRpb25zKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc2NyaXB0cy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
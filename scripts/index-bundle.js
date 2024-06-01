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
        this.tickNumber = 0;
        this.currentFrame = 0;
        this.frames = instructions.frames;
        this.times = instructions.times;
        this.dimensions = dimensions;
        this.repeat = repeat;
        this.coordinates = coordinates;
        this.canvas = canvas;
    }
    startAnimation() {
        this.renderFrame(this.currentFrame);
        this.tickNumber++;
        if (this.tickNumber == this.times[this.currentFrame]) {
            this.tickNumber = 0;
            this.currentFrame++;
        }
        if (this.repeat && this.currentFrame == this.frames.length) {
            this.currentFrame = 0;
        }
    }
    renderFrame(frameNumber) {
        // let canvas = document.createElement("canvas");
        // canvas.width = this.dimensions.width;
        // canvas.height = this.dimensions.height;
        // let ctx = canvas.getContext("2d")!;
        // ctx.drawImage(this.spritesheet, this.frames[frameNumber].x0, this.frames[frameNumber].y0, this.dimensions.width, this.dimensions.height, 0, 0, this.dimensions.width, this.dimensions.height);
        // let url = canvas.toDataURL();
        // let dest = document.getElementById("anim-test")!;
        // dest.style.backgroundImage = "url('" + url + "')";
        this.canvas.getCanvasContext().drawImage(this.spritesheet, this.frames[frameNumber].x0, this.frames[frameNumber].y0, this.dimensions.width, this.dimensions.height, this.coordinates.x, this.coordinates.y, this.dimensions.width, this.dimensions.height);
    }
}
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
const anim = () => {
    for (let i = 0; i < imgsArray.length; i++) {
        imgsArray[i].startAnimation();
    }
    setTimeout(window.requestAnimationFrame, 1000 / 60, anim); // ~60 klatek/s
};
const prepareStaticBoard = () => {
    const board = [];
    for (let i = 0; i < 33; i++) {
        board.push([]);
        for (let j = 0; j < 13; j++) {
            board[i][j] = "";
        }
    }
    for (let i = 0; i < 33; i++) {
        if (i == 0 || i == 32) {
            for (let j = 0; j < 13; j++) {
                board[i][j] = "W";
            }
        }
        else if (i % 2 == 0) {
            for (let j = 0; j < 13; j += 2) {
                board[i][j] = "W";
            }
        }
        else {
            board[i][0] = "W";
            board[i][12] = "W";
        }
    }
    let counter = 40;
    while (counter > 0) {
        const x = Math.floor(Math.random() * 32);
        const y = Math.floor(Math.random() * 12);
        if (board[x][y] == "") {
            board[x][y] = "B";
            counter--;
        }
    }
    return board;
};
const staticBoard = prepareStaticBoard();
console.log(staticBoard);
const w = new canvas_1.default();
w.drawWorld();
const imgsArray = [];
const img = new Image();
img.src = "./res/spritesheet.png";
img.onload = function () {
    for (let i = 0; i < staticBoard.length; i++) {
        for (let j = 0; j < staticBoard[i].length; j++) {
            switch (staticBoard[i][j]) {
                case "W":
                    imgsArray.push(new animate_1.default(img, data_json_1.default.wall, data_json_1.default.dimensions, true, { "x": i * 16, "y": j * 16 }, w));
                    break;
                case "B":
                    imgsArray.push(new animate_1.default(img, data_json_1.default.bricks.solid, data_json_1.default.dimensions, true, { "x": i * 16, "y": j * 16 }, w));
                    break;
                default:
                    break;
            }
        }
    }
    anim();
};


/***/ }),

/***/ "./res/data.json":
/*!***********************!*\
  !*** ./res/data.json ***!
  \***********************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"dimensions":{"width":16,"height":16},"player":{"left":{"frames":[{"x0":0,"y0":0},{"x0":16,"y0":0},{"x0":32,"y0":0}],"times":[30,30,30]},"right":{"frames":[{"x0":0,"y0":16},{"x0":16,"y0":16},{"x0":32,"y0":16}],"times":[30,30,30]},"up":{"frames":[{"x0":48,"y0":16},{"x0":64,"y0":16},{"x0":80,"y0":16}],"times":[30,30,30]},"down":{"frames":[{"x0":48,"y0":0},{"x0":64,"y0":0},{"x0":80,"y0":0}],"times":[30,30,30]},"death":{"frames":[{"x0":0,"y0":32},{"x0":16,"y0":32},{"x0":32,"y0":32},{"x0":48,"y0":32},{"x0":64,"y0":32},{"x0":80,"y0":32},{"x0":96,"y0":32}],"times":[30,30,30,30,30,30,30]}},"bomb":{"charge":{"frames":[{"x0":0,"y0":48},{"x0":16,"y0":48},{"x0":32,"y0":48}],"times":[30,30,30]},"explosion":{}},"wall":{"frames":[{"x0":48,"y0":48}],"times":[30]},"bricks":{"solid":{"frames":[{"x0":64,"y0":48}],"times":[30]},"destruction":{"frames":[{"x0":80,"y0":48},{"x0":96,"y0":48},{"x0":112,"y0":48},{"x0":128,"y0":48},{"x0":144,"y0":48},{"x0":160,"y0":48}],"times":[30,30,30,30,30,30]}},"balloon":{"left":{"frames":[{"x0":48,"y0":240},{"x0":64,"y0":240},{"x0":80,"y0":240}],"times":[30,30,30]},"right":{"frames":[{"x0":0,"y0":240},{"x0":16,"y0":240},{"x0":32,"y0":240}],"times":[30,30,30]},"death":{"frames":[{"x0":96,"y0":240},{"x0":112,"y0":240},{"x0":128,"y0":240},{"x0":144,"y0":240}],"times":[30,30,30,30]}},"powerup":{"frames":[{"x0":0,"y0":224}],"times":[30]}}');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWU7Ozs7Ozs7Ozs7O0FDckNGO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMkJBQTJCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDJCQUEyQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBZTs7Ozs7Ozs7Ozs7QUNyQ0Y7QUFDYjtBQUNBLDZDQUE2QztBQUM3QztBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxpQ0FBaUMsbUJBQU8sQ0FBQyxxQ0FBVTtBQUNuRCxvQ0FBb0MsbUJBQU8sQ0FBQyx5Q0FBa0I7QUFDOUQsa0NBQWtDLG1CQUFPLENBQUMsdUNBQVc7QUFDckQ7QUFDQSxvQkFBb0Isc0JBQXNCO0FBQzFDO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0Q7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFFBQVE7QUFDNUI7QUFDQSx3QkFBd0IsUUFBUTtBQUNoQztBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsUUFBUTtBQUM1QjtBQUNBLDRCQUE0QixRQUFRO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFFBQVE7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHdCQUF3QjtBQUM1Qyx3QkFBd0IsMkJBQTJCO0FBQ25EO0FBQ0E7QUFDQSxnSUFBZ0ksMEJBQTBCO0FBQzFKO0FBQ0E7QUFDQSx3SUFBd0ksMEJBQTBCO0FBQ2xLO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O1VDeEVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FuaW1hdGUudHMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9jYW52YXMudHMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9pbmRleC50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQW5pbWF0ZSB7XG4gICAgY29uc3RydWN0b3IoaW1nLCBpbnN0cnVjdGlvbnMsIGRpbWVuc2lvbnMsIHJlcGVhdCwgY29vcmRpbmF0ZXMsIGNhbnZhcykge1xuICAgICAgICB0aGlzLnNwcml0ZXNoZWV0ID0gaW1nO1xuICAgICAgICB0aGlzLnRpY2tOdW1iZXIgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgIHRoaXMuZnJhbWVzID0gaW5zdHJ1Y3Rpb25zLmZyYW1lcztcbiAgICAgICAgdGhpcy50aW1lcyA9IGluc3RydWN0aW9ucy50aW1lcztcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gZGltZW5zaW9ucztcbiAgICAgICAgdGhpcy5yZXBlYXQgPSByZXBlYXQ7XG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgfVxuICAgIHN0YXJ0QW5pbWF0aW9uKCkge1xuICAgICAgICB0aGlzLnJlbmRlckZyYW1lKHRoaXMuY3VycmVudEZyYW1lKTtcbiAgICAgICAgdGhpcy50aWNrTnVtYmVyKys7XG4gICAgICAgIGlmICh0aGlzLnRpY2tOdW1iZXIgPT0gdGhpcy50aW1lc1t0aGlzLmN1cnJlbnRGcmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMudGlja051bWJlciA9IDA7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSsrO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJlcGVhdCAmJiB0aGlzLmN1cnJlbnRGcmFtZSA9PSB0aGlzLmZyYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXJGcmFtZShmcmFtZU51bWJlcikge1xuICAgICAgICAvLyBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgLy8gY2FudmFzLndpZHRoID0gdGhpcy5kaW1lbnNpb25zLndpZHRoO1xuICAgICAgICAvLyBjYW52YXMuaGVpZ2h0ID0gdGhpcy5kaW1lbnNpb25zLmhlaWdodDtcbiAgICAgICAgLy8gbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikhO1xuICAgICAgICAvLyBjdHguZHJhd0ltYWdlKHRoaXMuc3ByaXRlc2hlZXQsIHRoaXMuZnJhbWVzW2ZyYW1lTnVtYmVyXS54MCwgdGhpcy5mcmFtZXNbZnJhbWVOdW1iZXJdLnkwLCB0aGlzLmRpbWVuc2lvbnMud2lkdGgsIHRoaXMuZGltZW5zaW9ucy5oZWlnaHQsIDAsIDAsIHRoaXMuZGltZW5zaW9ucy53aWR0aCwgdGhpcy5kaW1lbnNpb25zLmhlaWdodCk7XG4gICAgICAgIC8vIGxldCB1cmwgPSBjYW52YXMudG9EYXRhVVJMKCk7XG4gICAgICAgIC8vIGxldCBkZXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbmltLXRlc3RcIikhO1xuICAgICAgICAvLyBkZXN0LnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCdcIiArIHVybCArIFwiJylcIjtcbiAgICAgICAgdGhpcy5jYW52YXMuZ2V0Q2FudmFzQ29udGV4dCgpLmRyYXdJbWFnZSh0aGlzLnNwcml0ZXNoZWV0LCB0aGlzLmZyYW1lc1tmcmFtZU51bWJlcl0ueDAsIHRoaXMuZnJhbWVzW2ZyYW1lTnVtYmVyXS55MCwgdGhpcy5kaW1lbnNpb25zLndpZHRoLCB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0LCB0aGlzLmNvb3JkaW5hdGVzLngsIHRoaXMuY29vcmRpbmF0ZXMueSwgdGhpcy5kaW1lbnNpb25zLndpZHRoLCB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0KTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBBbmltYXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBDYW52YXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkNFTExfU0laRSA9IDE2O1xuICAgICAgICB0aGlzLkNBTlZBU19XSURUSCA9IDMzICogdGhpcy5DRUxMX1NJWkU7XG4gICAgICAgIHRoaXMuQ0FOVkFTX0hFSUdIVCA9IDEzICogdGhpcy5DRUxMX1NJWkU7XG4gICAgICAgIHRoaXMuY3JlYXRlQ2FudmFzKCk7XG4gICAgfVxuICAgIGNyZWF0ZUNhbnZhcygpIHtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICB0aGlzLmNhbnZhcy5jbGFzc05hbWUgPSBcIm1haW4tY2FudmFzXCI7XG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5DQU5WQVNfV0lEVEg7XG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuQ0FOVkFTX0hFSUdIVDtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5DQU5WQVNfV0lEVEgsIHRoaXMuQ0FOVkFTX0hFSUdIVCk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1jb250YWluZXJcIikuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuICAgIH1cbiAgICBkcmF3V29ybGQoKSB7XG4gICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAvLyBmaXJzdCBkcmF3IHJvd3NcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLkNBTlZBU19XSURUSCArIDE7IHgrKykge1xuICAgICAgICAgICAgdGhpcy5jdHgubW92ZVRvKHRoaXMuQ0VMTF9TSVpFICogeCwgMCk7XG4gICAgICAgICAgICAvLyB0aGlzIHdpbGwgZHJhdyB0aGUgbGluZVxuICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMuQ0VMTF9TSVpFICogeCwgdGhpcy5DQU5WQVNfV0lEVEggKiB0aGlzLkNFTExfU0laRSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLkNBTlZBU19XSURUSCArIDE7IHkrKykge1xuICAgICAgICAgICAgdGhpcy5jdHgubW92ZVRvKDAsIHRoaXMuQ0VMTF9TSVpFICogeSk7XG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8odGhpcy5DQU5WQVNfV0lEVEggKiB0aGlzLkNFTExfU0laRSwgdGhpcy5DRUxMX1NJWkUgKiB5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICB9XG4gICAgZ2V0Q2FudmFzQ29udGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IENhbnZhcztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY2FudmFzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vY2FudmFzXCIpKTtcbmNvbnN0IGRhdGFfanNvbl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9yZXMvZGF0YS5qc29uXCIpKTtcbmNvbnN0IGFuaW1hdGVfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9hbmltYXRlXCIpKTtcbmNvbnN0IGFuaW0gPSAoKSA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWdzQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaW1nc0FycmF5W2ldLnN0YXJ0QW5pbWF0aW9uKCk7XG4gICAgfVxuICAgIHNldFRpbWVvdXQod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSwgMTAwMCAvIDYwLCBhbmltKTsgLy8gfjYwIGtsYXRlay9zXG59O1xuY29uc3QgcHJlcGFyZVN0YXRpY0JvYXJkID0gKCkgPT4ge1xuICAgIGNvbnN0IGJvYXJkID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzMzsgaSsrKSB7XG4gICAgICAgIGJvYXJkLnB1c2goW10pO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEzOyBqKyspIHtcbiAgICAgICAgICAgIGJvYXJkW2ldW2pdID0gXCJcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDMzOyBpKyspIHtcbiAgICAgICAgaWYgKGkgPT0gMCB8fCBpID09IDMyKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEzOyBqKyspIHtcbiAgICAgICAgICAgICAgICBib2FyZFtpXVtqXSA9IFwiV1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGkgJSAyID09IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTM7IGogKz0gMikge1xuICAgICAgICAgICAgICAgIGJvYXJkW2ldW2pdID0gXCJXXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBib2FyZFtpXVswXSA9IFwiV1wiO1xuICAgICAgICAgICAgYm9hcmRbaV1bMTJdID0gXCJXXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IGNvdW50ZXIgPSA0MDtcbiAgICB3aGlsZSAoY291bnRlciA+IDApIHtcbiAgICAgICAgY29uc3QgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMyKTtcbiAgICAgICAgY29uc3QgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEyKTtcbiAgICAgICAgaWYgKGJvYXJkW3hdW3ldID09IFwiXCIpIHtcbiAgICAgICAgICAgIGJvYXJkW3hdW3ldID0gXCJCXCI7XG4gICAgICAgICAgICBjb3VudGVyLS07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJvYXJkO1xufTtcbmNvbnN0IHN0YXRpY0JvYXJkID0gcHJlcGFyZVN0YXRpY0JvYXJkKCk7XG5jb25zb2xlLmxvZyhzdGF0aWNCb2FyZCk7XG5jb25zdCB3ID0gbmV3IGNhbnZhc18xLmRlZmF1bHQoKTtcbncuZHJhd1dvcmxkKCk7XG5jb25zdCBpbWdzQXJyYXkgPSBbXTtcbmNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuaW1nLnNyYyA9IFwiLi9yZXMvc3ByaXRlc2hlZXQucG5nXCI7XG5pbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhdGljQm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdGF0aWNCb2FyZFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgc3dpdGNoIChzdGF0aWNCb2FyZFtpXVtqXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJXXCI6XG4gICAgICAgICAgICAgICAgICAgIGltZ3NBcnJheS5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdChpbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQud2FsbCwgZGF0YV9qc29uXzEuZGVmYXVsdC5kaW1lbnNpb25zLCB0cnVlLCB7IFwieFwiOiBpICogMTYsIFwieVwiOiBqICogMTYgfSwgdykpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiQlwiOlxuICAgICAgICAgICAgICAgICAgICBpbWdzQXJyYXkucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQoaW1nLCBkYXRhX2pzb25fMS5kZWZhdWx0LmJyaWNrcy5zb2xpZCwgZGF0YV9qc29uXzEuZGVmYXVsdC5kaW1lbnNpb25zLCB0cnVlLCB7IFwieFwiOiBpICogMTYsIFwieVwiOiBqICogMTYgfSwgdykpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBhbmltKCk7XG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc2NyaXB0cy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
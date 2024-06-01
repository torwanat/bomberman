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
        this.anim = () => {
            this.startAnimation();
            this.timeout = setTimeout(window.requestAnimationFrame, 1000 / 60, this.anim); // ~60 klatek/s
        };
        this.stopAnim = () => {
            clearTimeout(this.timeout);
        };
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
        this.canvas.getCanvasContext().drawImage(this.spritesheet, this.frames[frameNumber].x0, this.frames[frameNumber].y0, this.dimensions.width, this.dimensions.height, this.coordinates.x, this.coordinates.y, this.dimensions.width, this.dimensions.height);
    }
}
Animate.animateArray = (array) => {
    array.forEach((e) => {
        e.anim();
    });
};
Animate.clearArrayAnimations = (array) => {
    array.forEach((e) => {
        e.stopAnim();
    });
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
const connection = new connect_1.default("ws://torvan-bomberman.ct8.pl:1984/sockets/server.php");
const socket = connection.getWebSocket();
const w = new canvas_1.default();
w.drawWorld();
const imgsArray = [];
const img = new Image();
img.src = "./res/spritesheet.png";
img.onload = function () {
    socket.onmessage = (ev) => {
        if (ev.data != "") {
            animate_1.default.clearArrayAnimations(imgsArray);
            imgsArray.length = 0;
            const dataFromServer = JSON.parse(ev.data);
            const staticPropsBoard = dataFromServer.board;
            const balloons = dataFromServer.balloons;
            console.log(dataFromServer);
            for (let i = 0; i < staticPropsBoard.length; i++) {
                for (let j = 0; j < staticPropsBoard[i].length; j++) {
                    switch (staticPropsBoard[i][j]) {
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
            for (let i = 0; i < balloons.length; i++) {
                const balloon = balloons[i];
                if (balloon.alive) {
                    imgsArray.push(new animate_1.default(img, balloon.direction > 1 ? data_json_1.default.balloon.left : data_json_1.default.balloon.right, data_json_1.default.dimensions, true, { "x": balloon.x, "y": balloon.y }, w));
                }
                else {
                    imgsArray.push(new animate_1.default(img, data_json_1.default.balloon.death, data_json_1.default.dimensions, false, { "x": balloon.x, "y": balloon.y }, w));
                }
            }
            console.log(imgsArray);
            animate_1.default.animateArray(imgsArray);
        }
    };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJGQUEyRjtBQUMzRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0Esa0JBQWU7Ozs7Ozs7Ozs7O0FDOUNGO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMkJBQTJCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDJCQUEyQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBZTs7Ozs7Ozs7Ozs7QUNyQ0Y7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFlOzs7Ozs7Ozs7OztBQ25CRjtBQUNiO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGlDQUFpQyxtQkFBTyxDQUFDLHFDQUFVO0FBQ25ELG9DQUFvQyxtQkFBTyxDQUFDLHlDQUFrQjtBQUM5RCxrQ0FBa0MsbUJBQU8sQ0FBQyx1Q0FBVztBQUNyRCxrQ0FBa0MsbUJBQU8sQ0FBQyx1Q0FBVztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qiw2QkFBNkI7QUFDekQsZ0NBQWdDLGdDQUFnQztBQUNoRTtBQUNBO0FBQ0Esd0lBQXdJLDBCQUEwQjtBQUNsSztBQUNBO0FBQ0EsZ0pBQWdKLDBCQUEwQjtBQUMxSztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIscUJBQXFCO0FBQ2pEO0FBQ0E7QUFDQSxvTUFBb00sZ0NBQWdDO0FBQ3BPO0FBQ0E7QUFDQSwwSUFBMEksZ0NBQWdDO0FBQzFLO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztVQ3BEQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hbmltYXRlLnRzIiwid2VicGFjazovLy8uL3NjcmlwdHMvY2FudmFzLnRzIiwid2VicGFjazovLy8uL3NjcmlwdHMvY29ubmVjdC50cyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2luZGV4LnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBBbmltYXRlIHtcbiAgICBjb25zdHJ1Y3RvcihpbWcsIGluc3RydWN0aW9ucywgZGltZW5zaW9ucywgcmVwZWF0LCBjb29yZGluYXRlcywgY2FudmFzKSB7XG4gICAgICAgIHRoaXMuYW5pbSA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRBbmltYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSwgMTAwMCAvIDYwLCB0aGlzLmFuaW0pOyAvLyB+NjAga2xhdGVrL3NcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zdG9wQW5pbSA9ICgpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNwcml0ZXNoZWV0ID0gaW1nO1xuICAgICAgICB0aGlzLnRpY2tOdW1iZXIgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgIHRoaXMuZnJhbWVzID0gaW5zdHJ1Y3Rpb25zLmZyYW1lcztcbiAgICAgICAgdGhpcy50aW1lcyA9IGluc3RydWN0aW9ucy50aW1lcztcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gZGltZW5zaW9ucztcbiAgICAgICAgdGhpcy5yZXBlYXQgPSByZXBlYXQ7XG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgfVxuICAgIHN0YXJ0QW5pbWF0aW9uKCkge1xuICAgICAgICB0aGlzLnJlbmRlckZyYW1lKHRoaXMuY3VycmVudEZyYW1lKTtcbiAgICAgICAgdGhpcy50aWNrTnVtYmVyKys7XG4gICAgICAgIGlmICh0aGlzLnRpY2tOdW1iZXIgPT0gdGhpcy50aW1lc1t0aGlzLmN1cnJlbnRGcmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMudGlja051bWJlciA9IDA7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSsrO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJlcGVhdCAmJiB0aGlzLmN1cnJlbnRGcmFtZSA9PSB0aGlzLmZyYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXJGcmFtZShmcmFtZU51bWJlcikge1xuICAgICAgICB0aGlzLmNhbnZhcy5nZXRDYW52YXNDb250ZXh0KCkuZHJhd0ltYWdlKHRoaXMuc3ByaXRlc2hlZXQsIHRoaXMuZnJhbWVzW2ZyYW1lTnVtYmVyXS54MCwgdGhpcy5mcmFtZXNbZnJhbWVOdW1iZXJdLnkwLCB0aGlzLmRpbWVuc2lvbnMud2lkdGgsIHRoaXMuZGltZW5zaW9ucy5oZWlnaHQsIHRoaXMuY29vcmRpbmF0ZXMueCwgdGhpcy5jb29yZGluYXRlcy55LCB0aGlzLmRpbWVuc2lvbnMud2lkdGgsIHRoaXMuZGltZW5zaW9ucy5oZWlnaHQpO1xuICAgIH1cbn1cbkFuaW1hdGUuYW5pbWF0ZUFycmF5ID0gKGFycmF5KSA9PiB7XG4gICAgYXJyYXkuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgICBlLmFuaW0oKTtcbiAgICB9KTtcbn07XG5BbmltYXRlLmNsZWFyQXJyYXlBbmltYXRpb25zID0gKGFycmF5KSA9PiB7XG4gICAgYXJyYXkuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgICBlLnN0b3BBbmltKCk7XG4gICAgfSk7XG59O1xuZXhwb3J0cy5kZWZhdWx0ID0gQW5pbWF0ZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQ2FudmFzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5DRUxMX1NJWkUgPSAxNjtcbiAgICAgICAgdGhpcy5DQU5WQVNfV0lEVEggPSAzMyAqIHRoaXMuQ0VMTF9TSVpFO1xuICAgICAgICB0aGlzLkNBTlZBU19IRUlHSFQgPSAxMyAqIHRoaXMuQ0VMTF9TSVpFO1xuICAgICAgICB0aGlzLmNyZWF0ZUNhbnZhcygpO1xuICAgIH1cbiAgICBjcmVhdGVDYW52YXMoKSB7XG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgdGhpcy5jYW52YXMuY2xhc3NOYW1lID0gXCJtYWluLWNhbnZhc1wiO1xuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuQ0FOVkFTX1dJRFRIO1xuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLkNBTlZBU19IRUlHSFQ7XG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBcImdyZWVuXCI7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuQ0FOVkFTX1dJRFRILCB0aGlzLkNBTlZBU19IRUlHSFQpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW4tY29udGFpbmVyXCIpLmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcbiAgICB9XG4gICAgZHJhd1dvcmxkKCkge1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgLy8gZmlyc3QgZHJhdyByb3dzXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5DQU5WQVNfV0lEVEggKyAxOyB4KyspIHtcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbyh0aGlzLkNFTExfU0laRSAqIHgsIDApO1xuICAgICAgICAgICAgLy8gdGhpcyB3aWxsIGRyYXcgdGhlIGxpbmVcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLkNFTExfU0laRSAqIHgsIHRoaXMuQ0FOVkFTX1dJRFRIICogdGhpcy5DRUxMX1NJWkUpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5DQU5WQVNfV0lEVEggKyAxOyB5KyspIHtcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCB0aGlzLkNFTExfU0laRSAqIHkpO1xuICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMuQ0FOVkFTX1dJRFRIICogdGhpcy5DRUxMX1NJWkUsIHRoaXMuQ0VMTF9TSVpFICogeSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgfVxuICAgIGdldENhbnZhc0NvbnRleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN0eDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBDYW52YXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIENvbm5lY3Qge1xuICAgIGNvbnN0cnVjdG9yKHVyaSkge1xuICAgICAgICB0aGlzLndlYnNvY2tldCA9IG5ldyBXZWJTb2NrZXQodXJpKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMud2Vic29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3BlblwiKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy53ZWJzb2NrZXQub25lcnJvciA9IChldikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXYpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXRXZWJTb2NrZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndlYnNvY2tldDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBDb25uZWN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjYW52YXNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9jYW52YXNcIikpO1xuY29uc3QgZGF0YV9qc29uXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL3Jlcy9kYXRhLmpzb25cIikpO1xuY29uc3QgYW5pbWF0ZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2FuaW1hdGVcIikpO1xuY29uc3QgY29ubmVjdF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2Nvbm5lY3RcIikpO1xuY29uc3QgY29ubmVjdGlvbiA9IG5ldyBjb25uZWN0XzEuZGVmYXVsdChcIndzOi8vdG9ydmFuLWJvbWJlcm1hbi5jdDgucGw6MTk4NC9zb2NrZXRzL3NlcnZlci5waHBcIik7XG5jb25zdCBzb2NrZXQgPSBjb25uZWN0aW9uLmdldFdlYlNvY2tldCgpO1xuY29uc3QgdyA9IG5ldyBjYW52YXNfMS5kZWZhdWx0KCk7XG53LmRyYXdXb3JsZCgpO1xuY29uc3QgaW1nc0FycmF5ID0gW107XG5jb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbmltZy5zcmMgPSBcIi4vcmVzL3Nwcml0ZXNoZWV0LnBuZ1wiO1xuaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzb2NrZXQub25tZXNzYWdlID0gKGV2KSA9PiB7XG4gICAgICAgIGlmIChldi5kYXRhICE9IFwiXCIpIHtcbiAgICAgICAgICAgIGFuaW1hdGVfMS5kZWZhdWx0LmNsZWFyQXJyYXlBbmltYXRpb25zKGltZ3NBcnJheSk7XG4gICAgICAgICAgICBpbWdzQXJyYXkubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFGcm9tU2VydmVyID0gSlNPTi5wYXJzZShldi5kYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpY1Byb3BzQm9hcmQgPSBkYXRhRnJvbVNlcnZlci5ib2FyZDtcbiAgICAgICAgICAgIGNvbnN0IGJhbGxvb25zID0gZGF0YUZyb21TZXJ2ZXIuYmFsbG9vbnM7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhRnJvbVNlcnZlcik7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXRpY1Byb3BzQm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN0YXRpY1Byb3BzQm9hcmRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChzdGF0aWNQcm9wc0JvYXJkW2ldW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiV1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZ3NBcnJheS5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdChpbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQud2FsbCwgZGF0YV9qc29uXzEuZGVmYXVsdC5kaW1lbnNpb25zLCB0cnVlLCB7IFwieFwiOiBpICogMTYsIFwieVwiOiBqICogMTYgfSwgdykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkJcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdzQXJyYXkucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQoaW1nLCBkYXRhX2pzb25fMS5kZWZhdWx0LmJyaWNrcy5zb2xpZCwgZGF0YV9qc29uXzEuZGVmYXVsdC5kaW1lbnNpb25zLCB0cnVlLCB7IFwieFwiOiBpICogMTYsIFwieVwiOiBqICogMTYgfSwgdykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmFsbG9vbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBiYWxsb29uID0gYmFsbG9vbnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGJhbGxvb24uYWxpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaW1nc0FycmF5LnB1c2gobmV3IGFuaW1hdGVfMS5kZWZhdWx0KGltZywgYmFsbG9vbi5kaXJlY3Rpb24gPiAxID8gZGF0YV9qc29uXzEuZGVmYXVsdC5iYWxsb29uLmxlZnQgOiBkYXRhX2pzb25fMS5kZWZhdWx0LmJhbGxvb24ucmlnaHQsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgdHJ1ZSwgeyBcInhcIjogYmFsbG9vbi54LCBcInlcIjogYmFsbG9vbi55IH0sIHcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGltZ3NBcnJheS5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdChpbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQuYmFsbG9vbi5kZWF0aCwgZGF0YV9qc29uXzEuZGVmYXVsdC5kaW1lbnNpb25zLCBmYWxzZSwgeyBcInhcIjogYmFsbG9vbi54LCBcInlcIjogYmFsbG9vbi55IH0sIHcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpbWdzQXJyYXkpO1xuICAgICAgICAgICAgYW5pbWF0ZV8xLmRlZmF1bHQuYW5pbWF0ZUFycmF5KGltZ3NBcnJheSk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NjcmlwdHMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
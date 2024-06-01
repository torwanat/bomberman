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
        this.currentFrame = Math.floor((Animate.currentTick / instructions.times[0]) % instructions.times.length);
        this.tickNumber = Animate.currentTick % instructions.times[this.currentFrame];
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
Animate.currentTick = 0;
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
Animate.incrementTick = () => {
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
animate_1.default.incrementTick();
img.onload = function () {
    socket.onmessage = (ev) => {
        if (ev.data != "") {
            animate_1.default.clearArrayAnimations(imgsArray);
            imgsArray.length = 0;
            const dataFromServer = JSON.parse(ev.data);
            const staticPropsBoard = dataFromServer.board;
            const balloons = dataFromServer.balloons;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJGQUEyRjtBQUMzRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsZ0ZBQWdGO0FBQ2hGO0FBQ0Esa0JBQWU7Ozs7Ozs7Ozs7O0FDbkRGO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMkJBQTJCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDJCQUEyQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBZTs7Ozs7Ozs7Ozs7QUNyQ0Y7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFlOzs7Ozs7Ozs7OztBQ25CRjtBQUNiO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGlDQUFpQyxtQkFBTyxDQUFDLHFDQUFVO0FBQ25ELG9DQUFvQyxtQkFBTyxDQUFDLHlDQUFrQjtBQUM5RCxrQ0FBa0MsbUJBQU8sQ0FBQyx1Q0FBVztBQUNyRCxrQ0FBa0MsbUJBQU8sQ0FBQyx1Q0FBVztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qiw2QkFBNkI7QUFDekQsZ0NBQWdDLGdDQUFnQztBQUNoRTtBQUNBO0FBQ0Esd0lBQXdJLDBCQUEwQjtBQUNsSztBQUNBO0FBQ0EsZ0pBQWdKLDBCQUEwQjtBQUMxSztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIscUJBQXFCO0FBQ2pEO0FBQ0E7QUFDQSxvTUFBb00sZ0NBQWdDO0FBQ3BPO0FBQ0E7QUFDQSwwSUFBMEksZ0NBQWdDO0FBQzFLO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7VUNuREE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NjcmlwdHMvYW5pbWF0ZS50cyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2NhbnZhcy50cyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2Nvbm5lY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9pbmRleC50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQW5pbWF0ZSB7XG4gICAgY29uc3RydWN0b3IoaW1nLCBpbnN0cnVjdGlvbnMsIGRpbWVuc2lvbnMsIHJlcGVhdCwgY29vcmRpbmF0ZXMsIGNhbnZhcykge1xuICAgICAgICB0aGlzLmFuaW0gPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUsIDEwMDAgLyA2MCwgdGhpcy5hbmltKTsgLy8gfjYwIGtsYXRlay9zXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc3RvcEFuaW0gPSAoKSA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zcHJpdGVzaGVldCA9IGltZztcbiAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSBNYXRoLmZsb29yKChBbmltYXRlLmN1cnJlbnRUaWNrIC8gaW5zdHJ1Y3Rpb25zLnRpbWVzWzBdKSAlIGluc3RydWN0aW9ucy50aW1lcy5sZW5ndGgpO1xuICAgICAgICB0aGlzLnRpY2tOdW1iZXIgPSBBbmltYXRlLmN1cnJlbnRUaWNrICUgaW5zdHJ1Y3Rpb25zLnRpbWVzW3RoaXMuY3VycmVudEZyYW1lXTtcbiAgICAgICAgdGhpcy5mcmFtZXMgPSBpbnN0cnVjdGlvbnMuZnJhbWVzO1xuICAgICAgICB0aGlzLnRpbWVzID0gaW5zdHJ1Y3Rpb25zLnRpbWVzO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBkaW1lbnNpb25zO1xuICAgICAgICB0aGlzLnJlcGVhdCA9IHJlcGVhdDtcbiAgICAgICAgdGhpcy5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICB9XG4gICAgc3RhcnRBbmltYXRpb24oKSB7XG4gICAgICAgIHRoaXMucmVuZGVyRnJhbWUodGhpcy5jdXJyZW50RnJhbWUpO1xuICAgICAgICB0aGlzLnRpY2tOdW1iZXIrKztcbiAgICAgICAgaWYgKHRoaXMudGlja051bWJlciA9PSB0aGlzLnRpbWVzW3RoaXMuY3VycmVudEZyYW1lXSkge1xuICAgICAgICAgICAgdGhpcy50aWNrTnVtYmVyID0gMDtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEZyYW1lKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVwZWF0ICYmIHRoaXMuY3VycmVudEZyYW1lID09IHRoaXMuZnJhbWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlckZyYW1lKGZyYW1lTnVtYmVyKSB7XG4gICAgICAgIHRoaXMuY2FudmFzLmdldENhbnZhc0NvbnRleHQoKS5kcmF3SW1hZ2UodGhpcy5zcHJpdGVzaGVldCwgdGhpcy5mcmFtZXNbZnJhbWVOdW1iZXJdLngwLCB0aGlzLmZyYW1lc1tmcmFtZU51bWJlcl0ueTAsIHRoaXMuZGltZW5zaW9ucy53aWR0aCwgdGhpcy5kaW1lbnNpb25zLmhlaWdodCwgdGhpcy5jb29yZGluYXRlcy54LCB0aGlzLmNvb3JkaW5hdGVzLnksIHRoaXMuZGltZW5zaW9ucy53aWR0aCwgdGhpcy5kaW1lbnNpb25zLmhlaWdodCk7XG4gICAgfVxufVxuQW5pbWF0ZS5jdXJyZW50VGljayA9IDA7XG5BbmltYXRlLmFuaW1hdGVBcnJheSA9IChhcnJheSkgPT4ge1xuICAgIGFycmF5LmZvckVhY2goKGUpID0+IHtcbiAgICAgICAgZS5hbmltKCk7XG4gICAgfSk7XG59O1xuQW5pbWF0ZS5jbGVhckFycmF5QW5pbWF0aW9ucyA9IChhcnJheSkgPT4ge1xuICAgIGFycmF5LmZvckVhY2goKGUpID0+IHtcbiAgICAgICAgZS5zdG9wQW5pbSgpO1xuICAgIH0pO1xufTtcbkFuaW1hdGUuaW5jcmVtZW50VGljayA9ICgpID0+IHtcbiAgICBBbmltYXRlLmN1cnJlbnRUaWNrKys7XG4gICAgc2V0VGltZW91dCh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lLCAxMDAwIC8gNjAsIEFuaW1hdGUuaW5jcmVtZW50VGljayk7IC8vIH42MCBrbGF0ZWsvc1xufTtcbmV4cG9ydHMuZGVmYXVsdCA9IEFuaW1hdGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIENhbnZhcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuQ0VMTF9TSVpFID0gMTY7XG4gICAgICAgIHRoaXMuQ0FOVkFTX1dJRFRIID0gMzMgKiB0aGlzLkNFTExfU0laRTtcbiAgICAgICAgdGhpcy5DQU5WQVNfSEVJR0hUID0gMTMgKiB0aGlzLkNFTExfU0laRTtcbiAgICAgICAgdGhpcy5jcmVhdGVDYW52YXMoKTtcbiAgICB9XG4gICAgY3JlYXRlQ2FudmFzKCkge1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgIHRoaXMuY2FudmFzLmNsYXNzTmFtZSA9IFwibWFpbi1jYW52YXNcIjtcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLkNBTlZBU19XSURUSDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5DQU5WQVNfSEVJR0hUO1xuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJncmVlblwiO1xuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLkNBTlZBU19XSURUSCwgdGhpcy5DQU5WQVNfSEVJR0hUKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluLWNvbnRhaW5lclwiKS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gICAgfVxuICAgIGRyYXdXb3JsZCgpIHtcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIC8vIGZpcnN0IGRyYXcgcm93c1xuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuQ0FOVkFTX1dJRFRIICsgMTsgeCsrKSB7XG4gICAgICAgICAgICB0aGlzLmN0eC5tb3ZlVG8odGhpcy5DRUxMX1NJWkUgKiB4LCAwKTtcbiAgICAgICAgICAgIC8vIHRoaXMgd2lsbCBkcmF3IHRoZSBsaW5lXG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8odGhpcy5DRUxMX1NJWkUgKiB4LCB0aGlzLkNBTlZBU19XSURUSCAqIHRoaXMuQ0VMTF9TSVpFKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuQ0FOVkFTX1dJRFRIICsgMTsgeSsrKSB7XG4gICAgICAgICAgICB0aGlzLmN0eC5tb3ZlVG8oMCwgdGhpcy5DRUxMX1NJWkUgKiB5KTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLkNBTlZBU19XSURUSCAqIHRoaXMuQ0VMTF9TSVpFLCB0aGlzLkNFTExfU0laRSAqIHkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgICBnZXRDYW52YXNDb250ZXh0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdHg7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gQ2FudmFzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBDb25uZWN0IHtcbiAgICBjb25zdHJ1Y3Rvcih1cmkpIHtcbiAgICAgICAgdGhpcy53ZWJzb2NrZXQgPSBuZXcgV2ViU29ja2V0KHVyaSk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLndlYnNvY2tldC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9wZW5cIik7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMud2Vic29ja2V0Lm9uZXJyb3IgPSAoZXYpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2KTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZ2V0V2ViU29ja2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy53ZWJzb2NrZXQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gQ29ubmVjdDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY2FudmFzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vY2FudmFzXCIpKTtcbmNvbnN0IGRhdGFfanNvbl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9yZXMvZGF0YS5qc29uXCIpKTtcbmNvbnN0IGFuaW1hdGVfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9hbmltYXRlXCIpKTtcbmNvbnN0IGNvbm5lY3RfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9jb25uZWN0XCIpKTtcbmNvbnN0IGNvbm5lY3Rpb24gPSBuZXcgY29ubmVjdF8xLmRlZmF1bHQoXCJ3czovL3RvcnZhbi1ib21iZXJtYW4uY3Q4LnBsOjE5ODQvc29ja2V0cy9zZXJ2ZXIucGhwXCIpO1xuY29uc3Qgc29ja2V0ID0gY29ubmVjdGlvbi5nZXRXZWJTb2NrZXQoKTtcbmNvbnN0IHcgPSBuZXcgY2FudmFzXzEuZGVmYXVsdCgpO1xudy5kcmF3V29ybGQoKTtcbmNvbnN0IGltZ3NBcnJheSA9IFtdO1xuY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG5pbWcuc3JjID0gXCIuL3Jlcy9zcHJpdGVzaGVldC5wbmdcIjtcbmFuaW1hdGVfMS5kZWZhdWx0LmluY3JlbWVudFRpY2soKTtcbmltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IChldikgPT4ge1xuICAgICAgICBpZiAoZXYuZGF0YSAhPSBcIlwiKSB7XG4gICAgICAgICAgICBhbmltYXRlXzEuZGVmYXVsdC5jbGVhckFycmF5QW5pbWF0aW9ucyhpbWdzQXJyYXkpO1xuICAgICAgICAgICAgaW1nc0FycmF5Lmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBjb25zdCBkYXRhRnJvbVNlcnZlciA9IEpTT04ucGFyc2UoZXYuZGF0YSk7XG4gICAgICAgICAgICBjb25zdCBzdGF0aWNQcm9wc0JvYXJkID0gZGF0YUZyb21TZXJ2ZXIuYm9hcmQ7XG4gICAgICAgICAgICBjb25zdCBiYWxsb29ucyA9IGRhdGFGcm9tU2VydmVyLmJhbGxvb25zO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0aWNQcm9wc0JvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdGF0aWNQcm9wc0JvYXJkW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoc3RhdGljUHJvcHNCb2FyZFtpXVtqXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIldcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdzQXJyYXkucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQoaW1nLCBkYXRhX2pzb25fMS5kZWZhdWx0LndhbGwsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgdHJ1ZSwgeyBcInhcIjogaSAqIDE2LCBcInlcIjogaiAqIDE2IH0sIHcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJCXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nc0FycmF5LnB1c2gobmV3IGFuaW1hdGVfMS5kZWZhdWx0KGltZywgZGF0YV9qc29uXzEuZGVmYXVsdC5icmlja3Muc29saWQsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgdHJ1ZSwgeyBcInhcIjogaSAqIDE2LCBcInlcIjogaiAqIDE2IH0sIHcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJhbGxvb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYmFsbG9vbiA9IGJhbGxvb25zW2ldO1xuICAgICAgICAgICAgICAgIGlmIChiYWxsb29uLmFsaXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIGltZ3NBcnJheS5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdChpbWcsIGJhbGxvb24uZGlyZWN0aW9uID4gMSA/IGRhdGFfanNvbl8xLmRlZmF1bHQuYmFsbG9vbi5sZWZ0IDogZGF0YV9qc29uXzEuZGVmYXVsdC5iYWxsb29uLnJpZ2h0LCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IGJhbGxvb24ueCwgXCJ5XCI6IGJhbGxvb24ueSB9LCB3KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbWdzQXJyYXkucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQoaW1nLCBkYXRhX2pzb25fMS5kZWZhdWx0LmJhbGxvb24uZGVhdGgsIGRhdGFfanNvbl8xLmRlZmF1bHQuZGltZW5zaW9ucywgZmFsc2UsIHsgXCJ4XCI6IGJhbGxvb24ueCwgXCJ5XCI6IGJhbGxvb24ueSB9LCB3KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYW5pbWF0ZV8xLmRlZmF1bHQuYW5pbWF0ZUFycmF5KGltZ3NBcnJheSk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NjcmlwdHMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
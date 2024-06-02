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
            w.clearCanvas();
            animate_1.default.clearArrayAnimations(boardAnimations);
            animate_1.default.clearArrayAnimations(balloonsAnimations);
            boardAnimations.length = 0;
            balloonsAnimations.length = 0;
            const dataFromServer = JSON.parse(ev.data);
            boardAnimations = drawBoard(dataFromServer.board);
            balloonsAnimations = drawBalloons(dataFromServer.balloons);
            animate_1.default.animateArray(boardAnimations);
            animate_1.default.animateArray(balloonsAnimations);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJGQUEyRjtBQUMzRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsZ0ZBQWdGO0FBQ2hGO0FBQ0Esa0JBQWU7Ozs7Ozs7Ozs7O0FDbkRGO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QiwyQkFBMkI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMkJBQTJCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFlOzs7Ozs7Ozs7OztBQ3pDRjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWU7Ozs7Ozs7Ozs7O0FDbkJGO0FBQ2I7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsaUNBQWlDLG1CQUFPLENBQUMscUNBQVU7QUFDbkQsb0NBQW9DLG1CQUFPLENBQUMseUNBQWtCO0FBQzlELGtDQUFrQyxtQkFBTyxDQUFDLHVDQUFXO0FBQ3JELGtDQUFrQyxtQkFBTyxDQUFDLHVDQUFXO0FBQ3JEO0FBQ0E7QUFDQSxvQkFBb0Isa0JBQWtCO0FBQ3RDLHdCQUF3QixxQkFBcUI7QUFDN0M7QUFDQTtBQUNBLHNJQUFzSSwwQkFBMEI7QUFDaEs7QUFDQTtBQUNBLDhJQUE4SSwwQkFBMEI7QUFDeEs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IscUJBQXFCO0FBQ3pDO0FBQ0E7QUFDQSxxTUFBcU0sZ0NBQWdDO0FBQ3JPO0FBQ0E7QUFDQSwySUFBMkksZ0NBQWdDO0FBQzNLO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O1VDaEVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FuaW1hdGUudHMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9jYW52YXMudHMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9jb25uZWN0LnRzIiwid2VicGFjazovLy8uL3NjcmlwdHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIEFuaW1hdGUge1xuICAgIGNvbnN0cnVjdG9yKGltZywgaW5zdHJ1Y3Rpb25zLCBkaW1lbnNpb25zLCByZXBlYXQsIGNvb3JkaW5hdGVzLCBjYW52YXMpIHtcbiAgICAgICAgdGhpcy5hbmltID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGFydEFuaW1hdGlvbigpO1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lLCAxMDAwIC8gNjAsIHRoaXMuYW5pbSk7IC8vIH42MCBrbGF0ZWsvc1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnN0b3BBbmltID0gKCkgPT4ge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc3ByaXRlc2hlZXQgPSBpbWc7XG4gICAgICAgIHRoaXMuY3VycmVudEZyYW1lID0gTWF0aC5mbG9vcigoQW5pbWF0ZS5jdXJyZW50VGljayAvIGluc3RydWN0aW9ucy50aW1lc1swXSkgJSBpbnN0cnVjdGlvbnMudGltZXMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy50aWNrTnVtYmVyID0gQW5pbWF0ZS5jdXJyZW50VGljayAlIGluc3RydWN0aW9ucy50aW1lc1t0aGlzLmN1cnJlbnRGcmFtZV07XG4gICAgICAgIHRoaXMuZnJhbWVzID0gaW5zdHJ1Y3Rpb25zLmZyYW1lcztcbiAgICAgICAgdGhpcy50aW1lcyA9IGluc3RydWN0aW9ucy50aW1lcztcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gZGltZW5zaW9ucztcbiAgICAgICAgdGhpcy5yZXBlYXQgPSByZXBlYXQ7XG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgfVxuICAgIHN0YXJ0QW5pbWF0aW9uKCkge1xuICAgICAgICB0aGlzLnJlbmRlckZyYW1lKHRoaXMuY3VycmVudEZyYW1lKTtcbiAgICAgICAgdGhpcy50aWNrTnVtYmVyKys7XG4gICAgICAgIGlmICh0aGlzLnRpY2tOdW1iZXIgPT0gdGhpcy50aW1lc1t0aGlzLmN1cnJlbnRGcmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMudGlja051bWJlciA9IDA7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSsrO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJlcGVhdCAmJiB0aGlzLmN1cnJlbnRGcmFtZSA9PSB0aGlzLmZyYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEZyYW1lID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXJGcmFtZShmcmFtZU51bWJlcikge1xuICAgICAgICB0aGlzLmNhbnZhcy5nZXRDYW52YXNDb250ZXh0KCkuZHJhd0ltYWdlKHRoaXMuc3ByaXRlc2hlZXQsIHRoaXMuZnJhbWVzW2ZyYW1lTnVtYmVyXS54MCwgdGhpcy5mcmFtZXNbZnJhbWVOdW1iZXJdLnkwLCB0aGlzLmRpbWVuc2lvbnMud2lkdGgsIHRoaXMuZGltZW5zaW9ucy5oZWlnaHQsIHRoaXMuY29vcmRpbmF0ZXMueCwgdGhpcy5jb29yZGluYXRlcy55LCB0aGlzLmRpbWVuc2lvbnMud2lkdGgsIHRoaXMuZGltZW5zaW9ucy5oZWlnaHQpO1xuICAgIH1cbn1cbkFuaW1hdGUuY3VycmVudFRpY2sgPSAwO1xuQW5pbWF0ZS5hbmltYXRlQXJyYXkgPSAoYXJyYXkpID0+IHtcbiAgICBhcnJheS5mb3JFYWNoKChlKSA9PiB7XG4gICAgICAgIGUuYW5pbSgpO1xuICAgIH0pO1xufTtcbkFuaW1hdGUuY2xlYXJBcnJheUFuaW1hdGlvbnMgPSAoYXJyYXkpID0+IHtcbiAgICBhcnJheS5mb3JFYWNoKChlKSA9PiB7XG4gICAgICAgIGUuc3RvcEFuaW0oKTtcbiAgICB9KTtcbn07XG5BbmltYXRlLmluY3JlbWVudFRpY2sgPSAoKSA9PiB7XG4gICAgQW5pbWF0ZS5jdXJyZW50VGljaysrO1xuICAgIHNldFRpbWVvdXQod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSwgMTAwMCAvIDYwLCBBbmltYXRlLmluY3JlbWVudFRpY2spOyAvLyB+NjAga2xhdGVrL3Ncbn07XG5leHBvcnRzLmRlZmF1bHQgPSBBbmltYXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBDYW52YXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkNFTExfU0laRSA9IDE2O1xuICAgICAgICB0aGlzLkNBTlZBU19XSURUSCA9IDMzICogdGhpcy5DRUxMX1NJWkU7XG4gICAgICAgIHRoaXMuQ0FOVkFTX0hFSUdIVCA9IDEzICogdGhpcy5DRUxMX1NJWkU7XG4gICAgICAgIHRoaXMuY3JlYXRlQ2FudmFzKCk7XG4gICAgfVxuICAgIGNyZWF0ZUNhbnZhcygpIHtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICB0aGlzLmNhbnZhcy5jbGFzc05hbWUgPSBcIm1haW4tY2FudmFzXCI7XG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5DQU5WQVNfV0lEVEg7XG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuQ0FOVkFTX0hFSUdIVDtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5DQU5WQVNfV0lEVEgsIHRoaXMuQ0FOVkFTX0hFSUdIVCk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1jb250YWluZXJcIikuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuICAgIH1cbiAgICBjbGVhckNhbnZhcygpIHtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJncmVlblwiO1xuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLkNBTlZBU19XSURUSCwgdGhpcy5DQU5WQVNfSEVJR0hUKTtcbiAgICB9XG4gICAgZHJhd1dvcmxkKCkge1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgLy8gZmlyc3QgZHJhdyByb3dzXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5DQU5WQVNfV0lEVEggKyAxOyB4KyspIHtcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbyh0aGlzLkNFTExfU0laRSAqIHgsIDApO1xuICAgICAgICAgICAgLy8gdGhpcyB3aWxsIGRyYXcgdGhlIGxpbmVcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLkNFTExfU0laRSAqIHgsIHRoaXMuQ0FOVkFTX1dJRFRIICogdGhpcy5DRUxMX1NJWkUpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5DQU5WQVNfV0lEVEggKyAxOyB5KyspIHtcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCB0aGlzLkNFTExfU0laRSAqIHkpO1xuICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMuQ0FOVkFTX1dJRFRIICogdGhpcy5DRUxMX1NJWkUsIHRoaXMuQ0VMTF9TSVpFICogeSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgfVxuICAgIGdldENhbnZhc0NvbnRleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN0eDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBDYW52YXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIENvbm5lY3Qge1xuICAgIGNvbnN0cnVjdG9yKHVyaSkge1xuICAgICAgICB0aGlzLndlYnNvY2tldCA9IG5ldyBXZWJTb2NrZXQodXJpKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMud2Vic29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3BlblwiKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy53ZWJzb2NrZXQub25lcnJvciA9IChldikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXYpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXRXZWJTb2NrZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndlYnNvY2tldDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBDb25uZWN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjYW52YXNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9jYW52YXNcIikpO1xuY29uc3QgZGF0YV9qc29uXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL3Jlcy9kYXRhLmpzb25cIikpO1xuY29uc3QgYW5pbWF0ZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2FuaW1hdGVcIikpO1xuY29uc3QgY29ubmVjdF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2Nvbm5lY3RcIikpO1xuY29uc3QgZHJhd0JvYXJkID0gKGJvYXJkKSA9PiB7XG4gICAgY29uc3QgYm9hcmRBbmltYXRpb25zID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGJvYXJkW2ldW2pdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIldcIjpcbiAgICAgICAgICAgICAgICAgICAgYm9hcmRBbmltYXRpb25zLnB1c2gobmV3IGFuaW1hdGVfMS5kZWZhdWx0KGltZywgZGF0YV9qc29uXzEuZGVmYXVsdC53YWxsLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IGkgKiAxNiwgXCJ5XCI6IGogKiAxNiB9LCB3KSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJCXCI6XG4gICAgICAgICAgICAgICAgICAgIGJvYXJkQW5pbWF0aW9ucy5wdXNoKG5ldyBhbmltYXRlXzEuZGVmYXVsdChpbWcsIGRhdGFfanNvbl8xLmRlZmF1bHQuYnJpY2tzLnNvbGlkLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIHRydWUsIHsgXCJ4XCI6IGkgKiAxNiwgXCJ5XCI6IGogKiAxNiB9LCB3KSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBib2FyZEFuaW1hdGlvbnM7XG59O1xuY29uc3QgZHJhd0JhbGxvb25zID0gKGJhbGxvb25zKSA9PiB7XG4gICAgY29uc3QgYmFsbG9vbnNBbmltYXRpb25zID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiYWxsb29ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBiYWxsb29uID0gYmFsbG9vbnNbaV07XG4gICAgICAgIGlmIChiYWxsb29uLmFsaXZlKSB7XG4gICAgICAgICAgICBiYWxsb29uc0FuaW1hdGlvbnMucHVzaChuZXcgYW5pbWF0ZV8xLmRlZmF1bHQoaW1nLCBiYWxsb29uLmRpcmVjdGlvbiA+IDEgPyBkYXRhX2pzb25fMS5kZWZhdWx0LmJhbGxvb24ubGVmdCA6IGRhdGFfanNvbl8xLmRlZmF1bHQuYmFsbG9vbi5yaWdodCwgZGF0YV9qc29uXzEuZGVmYXVsdC5kaW1lbnNpb25zLCB0cnVlLCB7IFwieFwiOiBiYWxsb29uLngsIFwieVwiOiBiYWxsb29uLnkgfSwgdykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYmFsbG9vbnNBbmltYXRpb25zLnB1c2gobmV3IGFuaW1hdGVfMS5kZWZhdWx0KGltZywgZGF0YV9qc29uXzEuZGVmYXVsdC5iYWxsb29uLmRlYXRoLCBkYXRhX2pzb25fMS5kZWZhdWx0LmRpbWVuc2lvbnMsIGZhbHNlLCB7IFwieFwiOiBiYWxsb29uLngsIFwieVwiOiBiYWxsb29uLnkgfSwgdykpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBiYWxsb29uc0FuaW1hdGlvbnM7XG59O1xuY29uc3QgY29ubmVjdGlvbiA9IG5ldyBjb25uZWN0XzEuZGVmYXVsdChcIndzOi8vdG9ydmFuLWJvbWJlcm1hbi5jdDgucGw6MTk4NC9zb2NrZXRzL3NlcnZlci5waHBcIik7XG5jb25zdCBzb2NrZXQgPSBjb25uZWN0aW9uLmdldFdlYlNvY2tldCgpO1xuY29uc3QgdyA9IG5ldyBjYW52YXNfMS5kZWZhdWx0KCk7XG4vLyB3LmRyYXdXb3JsZCgpO1xubGV0IGJvYXJkQW5pbWF0aW9ucyA9IFtdO1xubGV0IGJhbGxvb25zQW5pbWF0aW9ucyA9IFtdO1xuY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG5pbWcuc3JjID0gXCIuL3Jlcy9zcHJpdGVzaGVldC5wbmdcIjtcbmFuaW1hdGVfMS5kZWZhdWx0LmluY3JlbWVudFRpY2soKTtcbmltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IChldikgPT4ge1xuICAgICAgICBpZiAoZXYuZGF0YSAhPSBcIlwiKSB7XG4gICAgICAgICAgICB3LmNsZWFyQ2FudmFzKCk7XG4gICAgICAgICAgICBhbmltYXRlXzEuZGVmYXVsdC5jbGVhckFycmF5QW5pbWF0aW9ucyhib2FyZEFuaW1hdGlvbnMpO1xuICAgICAgICAgICAgYW5pbWF0ZV8xLmRlZmF1bHQuY2xlYXJBcnJheUFuaW1hdGlvbnMoYmFsbG9vbnNBbmltYXRpb25zKTtcbiAgICAgICAgICAgIGJvYXJkQW5pbWF0aW9ucy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgYmFsbG9vbnNBbmltYXRpb25zLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBjb25zdCBkYXRhRnJvbVNlcnZlciA9IEpTT04ucGFyc2UoZXYuZGF0YSk7XG4gICAgICAgICAgICBib2FyZEFuaW1hdGlvbnMgPSBkcmF3Qm9hcmQoZGF0YUZyb21TZXJ2ZXIuYm9hcmQpO1xuICAgICAgICAgICAgYmFsbG9vbnNBbmltYXRpb25zID0gZHJhd0JhbGxvb25zKGRhdGFGcm9tU2VydmVyLmJhbGxvb25zKTtcbiAgICAgICAgICAgIGFuaW1hdGVfMS5kZWZhdWx0LmFuaW1hdGVBcnJheShib2FyZEFuaW1hdGlvbnMpO1xuICAgICAgICAgICAgYW5pbWF0ZV8xLmRlZmF1bHQuYW5pbWF0ZUFycmF5KGJhbGxvb25zQW5pbWF0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NjcmlwdHMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
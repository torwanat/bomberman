import Board from "./board";
import Canvas from "./canvas";

interface IInstructions {
    frames: Array<{ [key: string]: number }>,
    times: Array<number>
}

export default class Animate {
    private spritesheet: CanvasImageSource;
    private frames: Array<{ [key: string]: number }>;
    private times: Array<number>;
    private dimensions: { [key: string]: number };
    private repeat: boolean;
    private coordinates: { [key: string]: number };
    private canvas: Canvas;
    private board: Board;

    constructor(img: CanvasImageSource, instructions: IInstructions, dimensions: { [key: string]: number }, repeat: boolean, coordinates: { [key: string]: number }, canvas: Canvas, board: Board) {
        this.spritesheet = img;
        this.frames = instructions.frames;
        this.times = instructions.times;
        this.dimensions = dimensions;
        this.repeat = repeat;
        this.coordinates = coordinates;
        this.canvas = canvas;
        this.board = board;
    }

    public startAnimation() {
        const currentFrame = Math.floor((this.board.currentTick / this.times[0]) % this.times.length);
        this.renderFrame(currentFrame);
    }

    private renderFrame(frameNumber: number) {
        this.canvas.getCanvasContext().drawImage(this.spritesheet, this.frames[frameNumber].x0, this.frames[frameNumber].y0, this.dimensions.width, this.dimensions.height, this.coordinates.x, this.coordinates.y, this.dimensions.width, this.dimensions.height);
    }
}
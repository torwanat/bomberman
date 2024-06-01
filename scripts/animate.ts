import Canvas from "./canvas";

interface IInstructions {
    frames: Array<{ [key: string]: number }>,
    times: Array<number>
}

export default class Animate {
    private spritesheet: CanvasImageSource;
    private tickNumber: number;
    private currentFrame: number;
    private frames: Array<{ [key: string]: number }>;
    private times: Array<number>;
    private dimensions: { [key: string]: number };
    private repeat: boolean;
    private coordinates: { [key: string]: number };
    private canvas: Canvas;

    constructor(img: CanvasImageSource, instructions: IInstructions, dimensions: { [key: string]: number }, repeat: boolean, coordinates: { [key: string]: number }, canvas: Canvas) {
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

    public startAnimation() {
        this.renderFrame(this.currentFrame);
        this.tickNumber++;
        if (this.tickNumber == this.times[this.currentFrame]) {
            this.tickNumber = 0
            this.currentFrame++;
        }
        if (this.repeat && this.currentFrame == this.frames.length) {
            this.currentFrame = 0;
        }
    }

    private renderFrame(frameNumber: number) {
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
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
    private timeout: any;

    private static currentTick: number = 0;

    public static animateArray = (array: Array<Animate>) => {
        array.forEach((e: Animate) => {
            e.anim();
        });
    }

    public static clearArrayAnimations = (array: Array<Animate>) => {
        array.forEach((e: Animate) => {
            e.stopAnim();
        });
    }

    public static incrementTick = () => {
        Animate.currentTick++;
        setTimeout(window.requestAnimationFrame, 1000 / 60, Animate.incrementTick) // ~60 klatek/s
    }

    constructor(img: CanvasImageSource, instructions: IInstructions, dimensions: { [key: string]: number }, repeat: boolean, coordinates: { [key: string]: number }, canvas: Canvas) {
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

    private startAnimation() {
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
        this.canvas.getCanvasContext().drawImage(this.spritesheet, this.frames[frameNumber].x0, this.frames[frameNumber].y0, this.dimensions.width, this.dimensions.height, this.coordinates.x, this.coordinates.y, this.dimensions.width, this.dimensions.height);
    }

    private anim = () => {
        this.startAnimation();
        this.timeout = setTimeout(window.requestAnimationFrame, 1000 / 60, this.anim) // ~60 klatek/s
    }

    private stopAnim = () => {
        clearTimeout(this.timeout);
    }
}
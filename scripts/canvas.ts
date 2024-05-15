class Canvas {
    CELL_SIZE = 16;
    CANVAS_WIDTH = 32 * this.CELL_SIZE;
    CANVAS_HEIGHT = 13 * this.CELL_SIZE;

    private canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;

    public constructor() {
        this.createCanvas();
    }

    private createCanvas() {
        this.canvas = <HTMLCanvasElement>document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d")!;
        this.canvas.width = this.CANVAS_WIDTH;
        this.canvas.height = this.CANVAS_HEIGHT;
        document.body.appendChild(this.canvas);
    }

    public drawWorld() {
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
}
export default Canvas;
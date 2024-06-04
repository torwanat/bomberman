export default class Balloon {
    public id: number;
    public direction: number;
    public x: number;
    public y: number;
    public alive: boolean;
    public collides: boolean;

    constructor(id: number, direction: number, x: number, y: number, alive: boolean, collides: boolean) {
        this.id = id;
        this.direction = direction;
        this.x = x;
        this.y = y;
        this.alive = alive;
        this.collides = collides;
    }

}
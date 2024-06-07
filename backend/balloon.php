<?php
class Balloon
{
    private static $counter = 0;
    public $id;
    public $direction; // 0 - down, 1 - right, 2 - up, 3 - left
    public $x;
    public $y;
    public $alive;
    public $collides = false;
    public $wait = 0;

    function __construct($direction, $x, $y, $alive)
    {

        $this->id = Balloon::$counter;
        Balloon::$counter++;
        $this->direction = $direction;
        $this->x = $x;
        $this->y = $y;
        $this->alive = $alive;
    }
}
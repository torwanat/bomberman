<?php
require "balloon.php";

class Board
{
    public static $CELL_SIZE = 16;
    public static $WIDTH = 33;
    public static $HEIGHT = 13;
    public static $SPEED = 8;
    private $board = [];
    private $balloons_board = [];

    function __construct()
    {
        $this->init_board();
    }

    private function init_board()
    {
        for ($i = 0; $i < Board::$WIDTH; $i++) {
            array_push($this->board, []);
            for ($j = 0; $j < Board::$HEIGHT; $j++) {
                $this->board[$i][$j] = "";
            }
        }

        for ($i = 0; $i < Board::$WIDTH; $i++) {
            if ($i == 0 || $i == Board::$WIDTH - 1) {
                for ($j = 0; $j < Board::$HEIGHT; $j++) {
                    $this->board[$i][$j] = "W";
                }
            } elseif ($i % 2 == 0) {
                for ($j = 0; $j < Board::$HEIGHT; $j += 2) {
                    $this->board[$i][$j] = "W";
                }
            } else {
                $this->board[$i][0] = "W";
                $this->board[$i][Board::$HEIGHT - 1] = "W";
            }
        }

        $counter = 40;
        while ($counter > 0) {
            $x = rand(0, Board::$WIDTH - 1);
            $y = rand(0, Board::$HEIGHT - 1);

            if ($this->board[$x][$y] == "") {
                $this->board[$x][$y] = "B";
                $counter--;
            }
        }

        $this->init_balloons_board();
    }

    private function init_balloons_board()
    {
        $counter = 20;

        while ($counter > 0) {
            $x = rand(0, Board::$WIDTH - 1);
            $y = rand(0, Board::$HEIGHT - 1);
            $direction = rand(0, 3);

            if ($this->board[$x][$y] == "") {
                $this->board[$x][$y] = "_";
                $balloon = new Balloon($direction, $x * Board::$CELL_SIZE, $y * Board::$CELL_SIZE, true);
                array_push($this->balloons_board, $balloon);
                $counter--;
            }
        }
    }

    public function move_balloons()
    {
        $this->check_for_collisions();

        foreach ($this->balloons_board as $balloon) {
            if ($balloon->collides) {
                continue;
            }

            switch ($balloon->direction) {
                case 0:
                    $balloon->y += Board::$SPEED;
                    break;
                case 1:
                    $balloon->x += Board::$SPEED;
                    break;
                case 2:
                    $balloon->y -= Board::$SPEED;
                    break;
                case 3:
                    $balloon->x -= Board::$SPEED;
                    break;
                default:
                    break;
            }
        }
    }

    private function check_for_collisions()
    {
        foreach ($this->balloons_board as $balloon) {
            $position_x = floor($balloon->x / Board::$CELL_SIZE);
            $position_y = floor($balloon->y / Board::$CELL_SIZE);

            if ($position_x != $balloon->x / Board::$CELL_SIZE || $position_y != $balloon->y / Board::$CELL_SIZE) {
                continue;
            }

            switch ($balloon->direction) {
                case 0:
                    $position_y++;
                    break;
                case 1:
                    $position_x++;
                    break;
                case 2:
                    $position_y--;
                    break;
                case 3:
                    $position_x--;
                    break;
                default:
                    break;
            }

            $balloon->collides = false;

            if ($this->board[$position_x][$position_y] == "W" || $this->board[$position_x][$position_y] == "B") {
                $balloon->collides = true;

                if ($balloon->direction == 0) {
                    $balloon->direction = 3;
                } else {
                    $balloon->direction--;
                }
            }
        }
    }

    public function get_board()
    {
        return $this->board;
    }

    public function get_balloons_board()
    {
        return $this->balloons_board;
    }
}

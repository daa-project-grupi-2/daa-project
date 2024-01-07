<?php
// Adjacent directions array
$adjacents = [
  [1, 1], [-1, -1], [0, 1], [0, -1],
  [1, 0], [-1, 0], [-1, 1], [1, -1]
];

// Mode qe merret nga user nga console eshte thjesht per ceshtje testimi. Ne realitet zgjedhjen e tille e marrim nga frontend
$mode = readline("Choose the algorithm with which the game will be solved! DFS or BFS!");



//Funksioni rekursiv i eksplorimit eshte njejte i implementuar per te dy algoritmet. Vetem qasja ne rounde te minesweeper ndryshon, pra ajo e ben dallimin
//Implementation of DFS
function explore(&$mat, $row, $col){
    global $adjacents;
    $mineCounter = 0;
    foreach ($adjacents as $direction) {
        $row1 = $row + $direction[0];
        $col1 = $col + $direction[1];
        if ($row1 >= 0 && $col1 >= 0 && $row1 < count($mat)
        && $col1 < count($mat[0]) && $mat[$row1][$col1] === 'M') {
            $mineCounter++;
        }
    }
    if ($mineCounter > 0) {
        $mat[$row][$col] = chr($mineCounter + ord('0'));
        return;
    }
    $mat[$row][$col] = 'B';
    foreach ($adjacents as $direction) {
        $row1 = $row + $direction[0];
        $col1 = $col + $direction[1];
        if ($row1 >= 0 && $col1 >= 0 && $row1 < count($mat)
        && $col1 < count($mat[0]) && $mat[$row1][$col1] === 'E') {
            explore($mat, $row1, $col1);
        }
    }
}


// Implementation of minesweeper rounds
function minesweeperRound($matrix){
    global $mode;
    $click = [];
   
    $rows = count($matrix);
    $cols = count($matrix[0]);

    if(strtoupper($mode)=='BFS'){
        // Perform a click based on BFS for each round (BFS Implementation)
        for ($sum = 0; $sum <= $rows + $cols - 2; $sum++) {
            for ($i = 0; $i <= $sum; $i++) {
                $j = $sum - $i;
                if ($i < $rows && $j < $cols) {
                    if ($matrix[$i][$j] === 'E'){
                        explore($matrix, $i, $j);
                        $click = [$i, $j];
                        return [$matrix, $click];
                    }
                }
            }
        }
        return [$matrix, $click];
    }
    else if(strtoupper($mode)=='DFS'){
        $click = [];
        // Perform a click based on DFS for each round (DFS Implementation)
        foreach ($matrix as $x => $row) {
            foreach ($row as $y => $cell) {
                if ($cell === 'E') {
                    explore($matrix, $x, $y);
                
                    $click = [$x, $y];
                    return [$matrix, $click];
                }
            }
        }
        return [$matrix, $click];
    }
}
  

// Helper function to check if the game has finished
function isGameFinished($matrix) {
    foreach ($matrix as $row) {
        if (in_array('E', $row)) {
            return false;
        }
    }
    return true;
  }

//Implementation of game playing and validations
function playMinesweeper($matrix){
    $round = 1; // per te numeruar rundet 
    $str = 'The sequence of clicks: ';

    while (!isGameFinished($matrix)) { // kotrollo a eshte kryer loja
        [$currentMat, $click] = minesweeperRound($matrix); // merr matricen e lojes dhe click matricen 

        echo "Round $round:\n"; // printo matricen 
        foreach ($currentMat as $row) {
            foreach ($row as $cell) {
                echo $cell . " ";
            }
            echo "\n";
        }

        echo "Click needed for this round: " . // ku eshte klikuar 
            (empty($click) ? 'No more cells' : implode(",", $click)) . "\n\n";
        $str.=implode(",", $click)."     ";

        $matrix = $currentMat; // update matricen me vlerat e reja 
        $round++; // inkremento sepse fillon rundi i ri 
    }

    echo "No more cells to explore. Game finished!"; // loja ka perfunduar
    echo $str;
}


$mat =  [
    ['E', 'E', 'E', 'E', 'E','E', 'M', 'E', 'E'],
    ['E', 'M', 'E', 'E', 'E','E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E','E', 'M', 'E', 'E'],
    ['M', 'E', 'E', 'E', 'E','E', 'E', 'E', 'E'],
    ['E', 'M', 'E', 'E', 'E','E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E','E', 'M', 'E', 'E'],
    ['E', 'M', 'E', 'E', 'E','E', 'E', 'E', 'M'],
    ['E', 'E', 'E', 'E', 'E','E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E','M', 'E', 'M', 'E']
];
//  Intermmediate mode, 16x16 matrix with 40mines
// $mat = [
//     ['E', 'M', 'M', 'E', 'E','E', 'E', 'E', 'E','E', 'M', 'E', 'E', 'M','E', 'E'],
//     ['E', 'E', 'E', 'E', 'E','E', 'E', 'E', 'E','E', 'E', 'M', 'E', 'E','E', 'E'],
//     ['E', 'E', 'E', 'E', 'E','E', 'M', 'E', 'E','M', 'E', 'E', 'E', 'M','E', 'E'],
//     ['E', 'E', 'E', 'E', 'E','E', 'M', 'E', 'E','E', 'E', 'M', 'E', 'E','M', 'M'],
//     ['E', 'E', 'E', 'M', 'E','M', 'E', 'E', 'E','E', 'E', 'E', 'E', 'E','E', 'E'],
//     ['E', 'E', 'E', 'E', 'M','E', 'E', 'E', 'E','M', 'M', 'E', 'E', 'E','E', 'E'],
//     ['E', 'E', 'M', 'E', 'E','E', 'E', 'E', 'E','E', 'M', 'E', 'E', 'E','E', 'M'],
//     ['E', 'E', 'E', 'E', 'E','E', 'E', 'E', 'E','E', 'E', 'E', 'E', 'E','E', 'E'],
//     ['M', 'M', 'E', 'E', 'M','E', 'M', 'M', 'E','E', 'M', 'E', 'E', 'E','E', 'E'],
//     ['E', 'E', 'E', 'E', 'E','E', 'M', 'E', 'E','E', 'E', 'E', 'E', 'E','E', 'E'],
//     ['E', 'E', 'E', 'E', 'E','E', 'E', 'E', 'E','E', 'E', 'E', 'E', 'E','M', 'E'],
//     ['E', 'E', 'E', 'E', 'E','E', 'E', 'E', 'E','E', 'E', 'E', 'E', 'M','E', 'E'],
//     ['E', 'E', 'M', 'E', 'E','E', 'E', 'E', 'E','E', 'E', 'E', 'E', 'E','E', 'E'],
//     ['M', 'M', 'E', 'E', 'E','E', 'E', 'E', 'M','E', 'M', 'E', 'E', 'E','E', 'M'],
//     ['M', 'M', 'E', 'E', 'E','E', 'E', 'E', 'E','E', 'E', 'E', 'E', 'E','E', 'E'],
//     ['E', 'E', 'E', 'E', 'E','M', 'E', 'E', 'M','E', 'E', 'E', 'E', 'E','M', 'E'],
// ];
//
// Expert mode, 16x30 matrix with 99 mines
// $mat = [
//     ['E', 'M', 'M', 'E', 'E', 'M', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'E'],
//     ['E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E'],
//     ['E', 'M', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'M', 'E', 'E'],
//     ['E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'M', 'M', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'M', 'E', 'E', 'M', 'M'],
//     ['E', 'M', 'E', 'M', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
//     ['E', 'E', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'M', 'M', 'E', 'M', 'E', 'E', 'E', 'E', 'M', 'E', 'M', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E'],
//     ['E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'M'],
//     ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
//     ['M', 'M', 'E', 'E', 'M', 'E', 'M', 'M', 'E', 'M', 'M', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'E'],
//     ['E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E'],
//     ['E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'M', 'E'],
//     ['E', 'E', 'E', 'E', 'E', 'M', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E'],
//     ['E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
//     ['M', 'M', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'M', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'M', 'E', 'E', 'E', 'M'],
//     ['M', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
//     ['E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'M', 'E', 'E'],
// ];

playMinesweeper($mat);

?>
<?php

$adjacents = [
    [1, 1], [-1, -1], [0, 1], [0, -1],
    [1, 0], [-1, 0], [-1, 1], [1, -1]
];

$mode = 'DFS';

function explore(&$mat, $row, $col)
{
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

function minesweeperRound($matrix)
{
    global $mode;
    $click = [];

    $rows = count($matrix);
    $cols = count($matrix[0]);

    if (strtoupper($mode) == 'BFS') {
        for ($sum = 0; $sum <= $rows + $cols - 2; $sum++) {
            for ($i = 0; $i <= $sum; $i++) {
                $j = $sum - $i;
                if ($i < $rows && $j < $cols) {
                    if ($matrix[$i][$j] === 'E') {
                        explore($matrix, $i, $j);
                        $click = [$i, $j];
                        return [$matrix, $click];
                    }
                }
            }
        }
        return [$matrix, $click];
    } else if (strtoupper($mode) == 'DFS') {
        $click = [];
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

function isGameFinished($matrix)
{
    foreach ($matrix as $row) {
        if (in_array('E', $row)) {
            return false;
        }
    }
    return true;
}

function solveMinesweeper($matrix)
{
    $steps = [];
    while (!isGameFinished($matrix)) {
        [$currentMat, $click] = minesweeperRound($matrix);
        $matrix = $currentMat;
        $steps[] = ['matrix' => $matrix, 'click' => $click];
    }

    return $steps;
}

function printMinesweeper($matrix, $row, $col, $click)
{
    echo '<table border="1">';
    for ($i = 0; $i <= $row; $i++) {
        echo '<tr>';
        for ($j = 0; $j <= $col; $j++) {
            $cell = $matrix[$i][$j];
            if ($click && $i === $click[0] && $j === $click[1]) {
                echo '<td >' . $cell . '</td>';
            } else {
                echo '<td>' . $cell . '</td>';
            }
        }
        echo '</tr>';
    }
    echo '</table>';
    if ($click) {
        echo "<br>Clicked position: Row {$click[0]}, Column {$click[1]}<br><br>";
    }
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
$solvedSteps = solveMinesweeper($mat);


//Logjika e tiketes
//Vendosja e matrices per cdo step ne nje array
//Vendosja e atij array ne fajllin solution.json
//Vendosja behet ashtu qe cdo element formatohet qe te kete edhe indeksin e tij poashtu formatohet per pamje te mire vizuale 

$json_solution = json_encode($solvedSteps,JSON_PRETTY_PRINT);
file_put_contents('solution.json',$json_solution); 


$json_data = file_get_contents('solution.json');
$decoded_data = json_decode($json_data,true);



//Ne koment eshte kodi i cili perdoret per fetching te te dhenave nga JSON, te perdorur nga FrontEnd dhe 
//krijimi i matrices se re per cdo hap e njekohesisht anash printimin e steps te klikuar

// for($i=0;$i<count($decoded_data);$i++){
//     echo "\n Matrix number ".($i+1)."\n";
//     echo "Click for the following matrix is: ";
//     print_r($decoded_data[$i]['click'][0]);
//     echo " ";
//     print_r($decoded_data[$i]['click'][1]);
//     echo "\n";
//     for($j=0;$j<9;$j++){
//         for($k=0;$k<9;$k++){
//             print_r($decoded_data[$i]['matrix'][$j][$k]);
//             echo " ";
//         }
//         echo "\n";        
//     }
    
// }


echo "Initial Matrix:<br>";
printMinesweeper($mat, count($mat) - 1, count($mat[0]) - 1, null);

echo "<br><br>Solved Matrix:<br>";

foreach ($solvedSteps as $step) {
    $lastRow = count($step['matrix']) - 1;
    $lastCol = count($step['matrix'][0]) - 1;
    printMinesweeper($step['matrix'], $lastRow, $lastCol, $step['click']);
    echo "<br><br>";
}



?>

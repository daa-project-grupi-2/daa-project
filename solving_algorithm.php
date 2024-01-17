<?php

$adjacents = [
    [1, 1], [-1, -1], [0, 1], [0, -1],
    [1, 0], [-1, 0], [-1, 1], [1, -1]
];

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

function minesweeperRound($matrix, $mode)
{
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

function solveMinesweeper($matrix, $mode)
{
    $steps = [];
    while (!isGameFinished($matrix)) {
        [$currentMat, $click] = minesweeperRound($matrix, $mode);
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

function write_to_json_file($mat, $mode){
    if(file_exists("solution.json")){
        echo "delete file";
        unlink("solution.json");
    }

    $solvedSteps = solveMinesweeper($mat, $mode);
    $json_solution = json_encode($solvedSteps, JSON_PRETTY_PRINT);
    file_put_contents('solution.json', "");
    file_put_contents('solution.json', $json_solution); 
}

?>

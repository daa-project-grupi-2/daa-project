<?php

function isValidMinesweeperMtx($matrix) {
    if (empty($matrix) || empty($matrix[0])) {
        return false;
    }

    $rows = count($matrix);
    $cols = count($matrix[0]);

    // Checking if the matrix is 9x9, 16x16, or 16x30
    if (!((($rows === 9 && $cols === 9) || ($rows === 16 && $cols === 16) || ($rows === 16 && $cols === 30)))) {
        return false;
    }

    // Counting the number of mines
    $mineCount = 0;
    foreach ($matrix as $row) {
        foreach ($row as $cell) {
            if ($cell === 'M') {
                $mineCount++;
            }
        }
    }

    // Checking if the number of mines is within the allowed limit for each mode
    if (
        ($rows === 9 && $cols === 9 && $mineCount > 10) ||
        ($rows === 16 && $cols === 16 && $mineCount > 40) ||
        ($rows === 16 && $cols === 30 && $mineCount > 99)
    ) {
        return false;
    }

    foreach ($matrix as $row) {
        if (count($row) !== $cols) {
            return false;
        }

        foreach ($row as $cell) {
            // Check if the cell is 'E', 'M', or a number between 0 and 8
            if (!($cell === 'E' || $cell === 'M' || (is_numeric($cell) && $cell >= 0 && $cell <= 8))) {
                return false;
            }
        }
    }

    return true;
}

// 9x9 - Matrica easy
$validGrid9x9 = [
    ['E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E'],
    ['E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E'],
    ['M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E'],
    ['E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'M'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'M', 'E', 'M', 'E']
];

// Invalid: 9x9
$invalidGrid9x9 = [
    [1, 2, 0, -1, 0, 2, 0, -1, 0],
    [0, -1, 0, 2, 0, 1, 0, 2, 10],
    [1, 0, 2, 0, 10, 0, 2, 0, 1],
    [0, -1, 0, 1, 0, 2, 0, 1, 0],
    [1, 0, 2, 0, 2, 0, -1, 0, 2],
    [0, 1, 0, 1, 0, 1, 0, 2, 0, 10],
    [2, 0, -1, 0, 2, 0, 1, 0, 1],
    [0, 2, 0, -1, 0, 2, 0, -1, 10],
    [10, 0, 1, 0, 2, 0, -1, 0, 2],
];
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$validGrid16x16 = [
    ['E', 'M', 'M', 'E', 'E','E', 'E', 'E', 'E','E', 'M', 'E', 'E', 'M','E', 'E'],
    ['E', 'E', 'E', 'E', 'E','E', 'E', 'E', 'E','E', 'E', 'M', 'E', 'E','E', 'E'],
    ['E', 'E', 'E', 'E', 'E','E', 'M', 'E', 'E','M', 'E', 'E', 'E', 'M','E', 'E'],
    ['E', 'E', 'E', 'E', 'E','E', 'M', 'E', 'E','E', 'E', 'M', 'E', 'E','M', 'M'],
    ['E', 'E', 'E', 'M', 'E','M', 'E', 'E', 'E','E', 'E', 'E', 'E', 'E','E', 'E'],
    ['E', 'E', 'E', 'E', 'M','E', 'E', 'E', 'E','M', 'M', 'E', 'E', 'E','E', 'E'],
    ['E', 'E', 'M', 'E', 'E','E', 'E', 'E', 'E','E', 'M', 'E', 'E', 'E','E', 'M'],
    ['E', 'E', 'E', 'E', 'E','E', 'E', 'E', 'E','E', 'E', 'E', 'E', 'E','E', 'E'],
    ['M', 'M', 'E', 'E', 'M','E', 'M', 'M', 'E','E', 'M', 'E', 'E', 'E','E', 'E'],
    ['E', 'E', 'E', 'E', 'E','E', 'M', 'E', 'E','E', 'E', 'E', 'E', 'E','E', 'E'],
    ['E', 'E', 'E', 'E', 'E','E', 'E', 'E', 'E','E', 'E', 'E', 'E', 'E','M', 'E'],
    ['E', 'E', 'E', 'E', 'E','E', 'E', 'E', 'E','E', 'E', 'E', 'E', 'M','E', 'E'],
    ['E', 'E', 'M', 'E', 'E','E', 'E', 'E', 'E','E', 'E', 'E', 'E', 'E','E', 'E'],
    ['M', 'M', 'E', 'E', 'E','E', 'E', 'E', 'M','E', 'M', 'E', 'E', 'E','E', 'M'],
    ['M', 'M', 'E', 'E', 'E','E', 'E', 'E', 'E','E', 'E', 'E', 'E', 'E','E', 'E'],
    ['E', 'E', 'E', 'E', 'E','M', 'E', 'E', 'M','E', 'E', 'E', 'E', 'E','M', 'E'],
];

// Invalid: 16x16
$invalidGrid16x16 = [
    [1, 2, 0, 1, 60, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1],
    [0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 42, 0, 1, 0, 2],
    [1, 0, 2, 0, 1, 0, 2, 0, 1, 10, 2, 0, 1, 0, 2, 0],
    [0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 12, 0, 2, 0, 1],
    [1, 0, 2, 0, 2, 0, 1, 0, 72, 0, 1, 30, 2, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2],
    [2, 0, 1, 0, 2, 0, 1, 0, 1, 0, 2, -50, 1, 0, 2, 0],
    [0, 2, 0, 81, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1],
    [1, 0, 1, 0, 2, 0, 11, 0, 2, 0, 1, 0, 2, 0, 1, 0],
    [0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2],
    [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0],
    [0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1],
    [1, 0, 2, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2],
    [2, 0, 1, 0, 2, 0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0],
    [0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1],
];
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$validGrid16x30 = [
    ['E', 'M', 'M', 'E', 'E', 'M', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'M', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'M', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'M', 'M', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'M', 'E', 'E', 'M', 'M'],
    ['E', 'M', 'E', 'M', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'M', 'M', 'E', 'M', 'E', 'E', 'E', 'E', 'M', 'E', 'M', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'M'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['M', 'M', 'E', 'E', 'M', 'E', 'M', 'M', 'E', 'M', 'M', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'M', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'M', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['M', 'M', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'M', 'E', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'M', 'E', 'M', 'E', 'E', 'E', 'M'],
    ['M', 'M', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'M', 'E', 'E', 'E', 'E', 'M', 'E', 'E'],
];

// Invalid: 16x30
$invalidGrid16x30 = [
    [1, 2, 0, 11, 0, 2, 0, 1, 0, 32, 0, 1, 0, 10, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2],
    [0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 11, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1],
    [1, 0, 2, 0, 1, 0, 2, 0, 23, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0],
    [0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 31, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2],
    [1, 0, 2, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0],
    [0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1],
    [2, 0, 1, 0, 2, 0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0],
    [0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2],
    [1, 0, 1, 0, 2, 0, 1, 100, 2, 0, 21, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0],
    [0, 1, 0, 2, 9, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 23, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1],
    [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0],
    [0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2],
    [1, 0, 2, 0, 2, 0, 1, 0, 82, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1],
    [2, 0, 1, 0, 2, 0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 60, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0],
    [0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2],
];
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Return boolean values: TRUE or FALSE
var_dump(isValidMinesweeperMtx($validGrid9x9));
var_dump(isValidMinesweeperMtx($invalidGrid9x9));
var_dump(isValidMinesweeperMtx($validGrid16x16));
var_dump(isValidMinesweeperMtx($invalidGrid16x16));
var_dump(isValidMinesweeperMtx($validGrid16x30));
var_dump(isValidMinesweeperMtx($invalidGrid16x30));
?>

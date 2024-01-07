<?php
function isValidMinesweeperMtx($matrix) {
    if (empty($matrix) || empty($matrix[0])) {
        return false;
    }

    $cols = count($matrix[0]);

    foreach ($matrix as $row) {
        if (count($row) !== $cols) {
            return false;
        }

        foreach ($row as $cell) {
            if (!is_numeric($cell) || ($cell !== -1 && ($cell < 0 || $cell > 8))) {
                return false;
            }
        }
    }

    return true;
}
// Matricat mund te jene te cfaredo dimenzioni 9x9 16x16 16x30 kur te i testojme ne minesweeper
// Example usage:
// -1 do te thote mina
$validGrid = [
    [0, 1, -1],
    [2, -1, 3],
    [1, 3, -1]
];

$invalidGrid = [
    [0, 1, -1],
    [2, -1, 10],  // Invalid: 10 is not a valid number of adjacent mines
    [1, 3, -1]
];

// Kthejn vlere booleane : TRUE OSE FALSE
var_dump(isValidMinesweeperMtx($validGrid));   
var_dump(isValidMinesweeperMtx($invalidGrid)); 
?>

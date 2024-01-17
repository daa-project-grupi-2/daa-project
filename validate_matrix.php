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

?>
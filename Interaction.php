<?php
include 'algorithm.php';  // Algoritmet
include 'validMatrix.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle form submission
    if (isset($_POST['rows']) && isset($_POST['cols']) && isset($_POST['mines'])) {
        // Get user input for rows, columns, and mines
        $rows = (int)$_POST['rows'];
        $cols = (int)$_POST['cols'];
        $mines = (int)$_POST['mines'];

        // Validate user input
        if (isValidMinesweeperInput($rows, $cols, $mines)) {
            // Generate Minesweeper grid
            $mineGrid = generateMinesweeperGrid($rows, $cols, $mines);

            // Solve Minesweeper
            $solvedSteps = solveMinesweeper($mineGrid);

            // Display initial matrix
            echo "Initial Matrix:<br>";
            printMinesweeper($mineGrid, $rows - 1, $cols - 1, null);

            echo "<br><br>Solved Matrix:<br>";

            foreach ($solvedSteps as $step) {
                $lastRow = count($step['matrix']) - 1;
                $lastCol = count($step['matrix'][0]) - 1;
                printMinesweeper($step['matrix'], $lastRow, $lastCol, $step['click']);
                echo "<br><br>";
            }
        } else {
            echo "Invalid input. Please provide valid values for rows, columns, and mines.";
        }
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Minesweeper</title>
</head>
<body>
    <form method="post">
        <label for="rows">Rows:</label>
        <input type="number" name="rows" required min="1"/>

        <label for="cols">Columns:</label>
        <input type="number" name="cols" required min="1"/>

        <label for="mines">Mines:</label>
        <input type="number" name="mines" required min="1"/>

        <button type="submit">Generate Minesweeper Grid</button>
    </form>
</body>
</html>
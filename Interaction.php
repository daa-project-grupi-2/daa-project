<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  <title>Minesweeper</title>
  <link rel="stylesheet" href="minesweeper.css" />
  <link rel="shortcut icon" href="images/bomb.png" />
  <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
</head>
<body>
  <div class="flex-container">
    <div class="game-wrapper">
      <div class="game-board hidden container">
        <section id="game-container">
          <section class="status-bar" class="cell-header hidden">
            <!-- Content will be dynamically added here -->
          </section>
          <section class="status-bar hidden alg" class="cell-header hidden">
            <!-- Content will be dynamically added here -->
          </section>
          <section id="matrix" class="hidden">
            <table id="board"></table>
          </section>
        </section>
      </div>
    </div>
  </div>
  <section id="footer">
    <div id="start"></div>
    <div id="size-btns">
      <div id="size-btns"><button id="size-9">Easy</button></div>
      <div id="size-btns"><button id="size-16">Intermediate</button></div>
      <div id="size-btns"><button id="size-30">Expert</button></div>
    </div>
  </section>
  <script src="minesweeper.js"></script>
</body>
</html>


<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $size = $_POST['size'];
    $matrix = generateMinesweeperMatrix($size);
    echo generateMinesweeperTable($matrix);
} else {
    header("HTTP/1.1 405 Method Not Allowed");
    echo "Method Not Allowed";
}

function generateMinesweeperMatrix($size) {
    // For simplicity, let's create a 9x9 matrix with some mines
    $mines = 10; // You can adjust the number of mines as needed
    $matrix = array_fill(0, $size, array_fill(0, $size, 'E'));

    // Randomly place mines
    for ($i = 0; $i < $mines; $i++) {
        $row = rand(0, $size - 1);
        $col = rand(0, $size - 1);

        while ($matrix[$row][$col] === 'M') {
            // Regenerate if a mine is already present at the randomly selected position
            $row = rand(0, $size - 1);
            $col = rand(0, $size - 1);
        }

        $matrix[$row][$col] = 'M';
    }

    return $matrix;
}

function generateMinesweeperTable($matrix) {
    // Generate the HTML table based on the Minesweeper matrix
    $html = '<table id="board">';
    foreach ($matrix as $row) {
        $html .= '<tr>';
        foreach ($row as $cell) {
            $html .= '<td onclick="cellClick()">' . $cell . '</td>';
        }
        $html .= '</tr>';
    }
    $html .= '</table>';
    return $html;
}
?>
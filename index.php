<?php 
echo " ";   
$filename = "solution.json";
if(file_exists($filename)){
  unlink("solution.json");
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Minesweeper</title>
    <link rel="stylesheet" href="minesweeper.css" />
    <script
      src="https://code.jquery.com/jquery-3.2.1.min.js"
      integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
      crossorigin="anonymous"
    ></script>
    <div id="howToPlayModal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <h2>How to Play Minesweeper</h2>
    <p>Welcome to Minesweeper! This classic game challenges your logical reasoning and strategy skills. Here's a step-by-step guide on how to play:</p>

    <ol>
        <li>
            <strong>Choose Difficulty:</strong>
            <p>Click on the "Easy," "Intermediate," or "Expert" button to select the difficulty level.</p>
        </li>
        <li>
            <strong>Generate Bombs:</strong>
            <p>After selecting the difficulty level, press the "Random" button to generate a random arrangement of mines on the game board.</p>
        </li>
        <li>
            <strong>Choose Algorithm:</strong>
            <p>Press either the "BFS" or "DFS" button to choose the algorithm for the computer to use. Both algorithms will attempt to solve the Minesweeper puzzle based on the submitted board.</p>
        </li>
        <li>
            <strong>Submit Your Board:</strong>
            <p>Once you're satisfied with the bomb placement, press the "Submit" button to submit the current state of the game board. This board, represented by <code>'E'</code> for empty cells and <code>'M'</code> for mines, will be sent to the algorithm for processing.</p>
        </li>
        <li>
            <strong>Play/Pause:</strong>
            <p>Use the "Play" button to let the computer automatically play the game with the selected algorithm. Press "Pause" to stop the automated play.</p>
        </li>
        <li>
            <strong>Next/Previous Steps:</strong>
            <p>If you prefer to see the game step by step, use the "Next" and "Previous" buttons to navigate through each move made by the computer.</p>
        </li>
        <li>
            <strong>Enjoy and Learn:</strong>
            <p>Observe how the computer uses the chosen algorithm to play Minesweeper. It's not just a game but a learning experience about algorithmic problem-solving!</p>
        </li>
    </ol>
  </div>
</div>
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
            <section
              class="status-bar functionality-buttons"
              class="cell-header hidden"
            >
              <!-- Content will be dynamically added here -->
            </section>
            <section
            class="status-bar next-previous-btn"
            class="cell-header hidden"
            >
            <!-- Content will be dynamically added here -->
          </section> 
          </section>
        </div>
     </div>
     <section id="cell-list" class="hidden">
    <div id="message-container">
      <ol id="openedCellsList"></ol>
    </div>
    </section>
    <section id="footer">
      <div id="start"></div>
      <div id="size-btns">
        <div id="size-btns"><button id="size-9">Easy</button></div>
        <div id="size-btns"><button id="size-16">Intermediate</button></div>
        <div id="size-btns"><button id="size-30">Expert</button></div>
      </div>
      <div id="start"></div>
    <div id="howToPlayContainer">
    <button id="howToPlayButton" class="how-to-play-button">How to Play</button>
      </div>
    </section>
    <script src="minesweeper.js"></script>
  </body>
</html>
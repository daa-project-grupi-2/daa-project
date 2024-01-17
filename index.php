<?php 
echo " ";   
unlink("solution.json");
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
    </section>
    <script src="minesweeper.js"></script>
  </body>
</html>
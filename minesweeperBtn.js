$(document).ready(function () {
    function handleButtonClick(size) {
      $.ajax({
        type: 'POST',
        url: 'minesweeper_backend.php',
        data: { size: size },
        success: function (response) {
          $('#matrix').html(response); // Update the game board
          attachCellListeners(); // Reattach listeners to the new cells
        },
        error: function (error) {
          console.error('Error:', error);
        }
      });
    }
  
    $('#size-9').click(function () {
      handleButtonClick(9);
    });
  
    $('#size-16').click(function () {
      handleButtonClick(16);
    });
  
    $('#size-30').click(function () {
      handleButtonClick(30);
    });
    
    function attachCellListeners() {
      // Implement cell click listeners if needed
    }
  });
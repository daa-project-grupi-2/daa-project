<?php
include 'solving_algorithm.php';
include 'validate_matrix.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' || (isset($_COOKIE['matrixData']) && isset($_COOKIE['algorithm']))) {
    $json_data = isset($_POST['matrixData']) ? $_POST['matrixData'] : $_COOKIE['matrixData'];

    error_log("Received JSON data: " . $json_data);

    $matrix_data = json_decode($json_data, true);

    error_log("Decoded matrix data: " . print_r($matrix_data, true));

    // Validating matrix
    if(!isValidMinesweeperMtx($matrix_data)){
        error_log("Matrix is not valid!");
    }

    if ($matrix_data !== null && isset($matrix_data['matrixData'])) {
        // Access the matrix data
        $matrix_data = $matrix_data['matrixData'];

        // Pritimi i matrices
        echo "Received Matrix Data:\n";
        foreach ($matrix_data as $row) {
            echo implode("\t", $row) . "\n";
        }
        echo ("\n\n");

        // Writing matrix to JSON
        // This part will need to be fixed so as to accept the mode
        $mode = $_COOKIE['algorithm'];
        write_to_json_file($matrix_data, $mode);
        

        header('Content-Type: application/json');
    } else {
        // Kur te dhenat nuk jane ashtu sic kerkohen.
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data or missing matrixData property']);
    }

} else {
    // Nese nuk eshte metoda e duhur.
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}

?>

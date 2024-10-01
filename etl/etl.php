<?php

// Aktuelles Datum im richtigen Format
$aktuellesDatum = date('Y-m-d'); // Beispiel: 2024-10-01

// Include the config file
require_once 'config.php';

// Establish database connection
try {
    $pdo = new PDO($dsn, $username, $password, $options);
    } catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
    }


function fetchRadioRSI() {
    global $aktuellesDatum; // Zugriff auf das dynamische Datum

    // Verwende das aktuelle Datum in der URL
    $url = "https://music.rsi.ch/mp-musiconline-frontend-api/retetre/music2/list?StartTime=" . $aktuellesDatum . "T00:00:00&EndTime=" . $aktuellesDatum . "T23:59:00";

    // Initialisiert eine cURL-Sitzung
    $ch = curl_init($url);

    // Setzt Optionen
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Führt die cURL-Sitzung aus und erhält den Inhalt
    $response = curl_exec($ch);

    // Schließt die cURL-Sitzung
    curl_close($ch);

    // Dekodiert die JSON-Antwort und gibt Daten zurück
    return json_decode($response, true);
}

$data = fetchRadioRSI();
var_dump($data);




// NEUE API

function fetchRadioSRF() {
    $url_srf = "https://www.srf.ch/programm/radio-api/lastplayed/radio-srf-3";

    // Initialisiert eine cURL-Sitzung
    $ch_srf = curl_init($url_srf);

    // Setzt Optionen
    curl_setopt($ch_srf, CURLOPT_RETURNTRANSFER, true);

    // Führt die cURL-Sitzung aus und erhält den Inhalt
    $response_srf = curl_exec($ch_srf);

    // Schließt die cURL-Sitzung
    curl_close($ch_srf);

    // Dekodiert die JSON-Antwort und gibt Daten zurück
    return json_decode($response_srf, true);
}
$data_srf = fetchRadioSRF();
var_dump($data_srf["lastPlayedList"]);




// Datenbank RSI
// Prepare the SQL statement
$sql = "INSERT INTO songs_RSI (artist, song, playtime) VALUES (:artist, :song, :playtime)";
$stmt = $pdo->prepare($sql);

// Insert each bike into the database
foreach ($data as $song) {
    if (isset($song['start']) && isset($song['stop'])) {
        // Calculate playtime duration between start and stop
    

        $stmt->execute([
            ':artist' => $song['artist'],          // Artist name
            ':song' => $song['songTitle'],         // Song title
            ':playtime' => $song['start']               // Playtime duration
        ]);
    } else {
        echo "Skipping song with ID: " . $song['id'] . " due to missing start or stop time.\n";
    }
}

// Datenbank SRF
// Prepare the SQL statement
$sql_srf = "INSERT INTO songs_SRF (artist, song, playtime) VALUES (:artist, :song, :playtime)";
$stmt_srf = $pdo->prepare($sql_srf);

// Insert each song into the database
foreach ($data_srf ["lastPlayedList"] as $song_srf) {
        // Calculate playtime duration between start and stop
    

        $stmt_srf->execute([
            ':artist' => $song_srf['description'],          // Artist name
            ':song' => $song_srf['title'],         // Song title
            ':playtime' => $song_srf['timestamp']               // Playtime duration
        ]);

}


echo "Data successfully inserted into the database.";

?> 


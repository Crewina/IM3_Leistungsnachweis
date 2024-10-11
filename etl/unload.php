<?php

require_once 'config.php'; // Stellen Sie sicher, dass dies auf Ihre tatsächliche Konfigurationsdatei verweist

header('Content-Type: application/json');

try {
    $pdo = new PDO($dsn, $username, $password, $options);
    $cities = ['Bern', 'Chur', 'Zürich'];
    $results = [];

    $stmt = $pdo->prepare("SELECT * FROM songs_SRF");
    $stmt->execute(); // Führt die vorbereitete Anfrage mit der Stadt als Parameter aus
    $results = $stmt->fetchAll(); // Speichert die Ergebnisse im Array $results

    echo json_encode($results); // Gibt die Wetterdaten im JSON-Format aus
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]); // Gibt einen Fehler im JSON-Format aus, falls eine Ausnahme auftritt
}

/* require_once 'config.php'; // Stellen Sie sicher, dass dies auf Ihre tatsächliche Konfigurationsdatei verweist

header('Content-Type: application/json');

try {
    $pdo = new PDO($dsn, $username, $password, $options);

    // Funktion, um die SRF Daten abzurufen
    function fetchRadioSRF() {
        $url_srf = "https://www.srf.ch/programm/radio-api/lastplayed/radio-srf-3";
        $ch_srf = curl_init($url_srf);
        curl_setopt($ch_srf, CURLOPT_RETURNTRANSFER, true);
        $response_srf = curl_exec($ch_srf);
        curl_close($ch_srf);

        return json_decode($response_srf, true);
    }

    $data_srf = fetchRadioSRF();

    // Zähler für Duplikate und erfolgreiche Einträge
    $srf_duplicates = 0;
    $srf_inserted = 0;

    // Duplikatsprüfung für SRF Daten
    $sql_check_srf = "SELECT COUNT(*) FROM songs_SRF WHERE playtime = :playtime";
    $sql_insert_srf = "INSERT INTO songs_SRF (artist, song, playtime) VALUES (:artist, :song, :playtime)";
    $stmt_check_srf = $pdo->prepare($sql_check_srf);
    $stmt_insert_srf = $pdo->prepare($sql_insert_srf);

    foreach ($data_srf["lastPlayedList"] as $song_srf) {
        $playtime = $song_srf['timestamp'];

        // Duplikatprüfung
        $stmt_check_srf->execute([':playtime' => $playtime]);
        $exists = $stmt_check_srf->fetchColumn();

        if ($exists == 0) {
            // Datensatz existiert noch nicht, also einfügen
            $stmt_insert_srf->execute([
                ':artist' => $song_srf['description'],
                ':song' => $song_srf['title'],
                ':playtime' => $playtime
            ]);
            $srf_inserted++;
        } else {
            // Duplikat gefunden
            $srf_duplicates++;
        }
    }

    // Ausgabe der Anzahl eingefügter und doppelter Datensätze im JSON-Format
    $response = [
        'srf_data' => [
            'inserted' => $srf_inserted,
            'duplicates' => $srf_duplicates
        ]
    ];

    echo json_encode($response); // Gibt die SRF-Daten im JSON-Format aus

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]); // Gibt einen Fehler im JSON-Format aus, falls eine Ausnahme auftritt
}*/

?>

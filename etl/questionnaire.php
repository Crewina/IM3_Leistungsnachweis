<?php
    require_once 'config.php'; // Stellen Sie sicher, dass dies auf Ihre tatsächliche Konfigurationsdatei verweist

    header('Content-Type: application/json');

    class Question {
        public $question;
        public $options;
        public $correct;
        public $evaluationText;
        public $result;

        public function __construct($question, $options, $correct, $evaluationText, $result) {
            $this->question = $question;
            $this->options = $options;
            $this->correct = $correct;
            $this->evaluationText = $evaluationText;
            $this->result = $result;
        }
    }


    function get_question_1($pdo) {
        $stmt = $pdo->prepare("SELECT artist as artist_name, COUNT(*) AS amount
        FROM songs_SRF
        WHERE artist <> \"\"
        GROUP BY artist
        ORDER BY amount DESC
        LIMIT 4;");
        $stmt->execute();
        $results = $stmt->fetchAll();


        $mostListenedArtist = current($results);
        $mostListenedArtistName = $mostListenedArtist["artist_name"];
        $answerText = "$mostListenedArtistName wird seit dem 8.10.24 am meisten auf SRF 3 gespielt.";
        return new Question(
            "Welcher Künstler wird seit dem 8.10.24 am meisten auf SRF 3 gespielt?",
            array_map(function($a) { return $a["artist_name"]; }, $results),
            $mostListenedArtistName,
            $answerText,
            array_map(function($a) { return ['amount' => $a["amount"], 'label' => $a["artist_name"]]; }, $results)
            // []
        );
    }

    function get_question_2($pdo, $artist_name) {
        $stmt = $pdo->prepare("SELECT song as song_name, COUNT(*) AS amount
        FROM songs_SRF
        WHERE artist = '$artist_name'
        GROUP BY song_name
        ORDER BY amount DESC
        LIMIT 4;");
        $stmt->execute();
        $results = $stmt->fetchAll();


        $mostListenedSong = current($results);
        $mostListenedSongName = $mostListenedSong["song_name"];
        $answerText = "$mostListenedSongName wird seit dem 8.10.24 am meisten auf SRF 3 gespielt.";
        return new Question(
            "Welcher Song von $artist_name wird seit dem 8.10.24 am meisten auf SRF 3 gespielt?",
            array_map(function($a) { return $a["song_name"]; }, $results),
            $mostListenedSongName,
            $answerText,
            array_map(function($a) { return ['amount' => $a["amount"], 'label' => $a["song_name"]]; }, $results)
        );
    }



    function get_question_3($pdo, $song_name, $artist_name) {
        $stmt = $pdo->prepare("SELECT 
        CASE
            WHEN TIME(playtime) BETWEEN '03:00:00' AND '09:00:00' THEN 'Morgen'
            WHEN TIME(playtime) BETWEEN '09:00:00' AND '15:00:00' THEN 'Mittag'
            WHEN TIME(playtime) BETWEEN '15:00:00' AND '21:00:00' THEN 'Nachmittag'
            ELSE 'Abend'
        END AS timeofday, 
        COUNT(*) AS occurrences
        FROM songs_SRF
        WHERE song = \"$song_name\"
        GROUP BY timeofday
        ORDER BY occurrences DESC
        ");
        $stmt->execute();
        $results = $stmt->fetchAll();

        $mostplayeddaytime = current($results);
        $mostplayeddaytime = $mostplayeddaytime["timeofday"];
        $answerText = " Am $mostplayeddaytime wird der Song $song_name am meisten gespielt.";
        return new Question(
            "Zu welcher Tageszeit glaubst du, wird der Song $song_name von $artist_name am häufigsten auf SRF 3 gespielt?",
            array_map(function($a) { return $a["timeofday"]; }, $results),
            $mostListenedSongName,
            $answerText,
            array_map(function($a) { return ['amount' => $a["occurrences"], 'label' => $a["timeofday"]]; }, $results)
        );
    }

    try {
        $pdo = new PDO($dsn, $username, $password, $options);
        
        $first_question = get_question_1($pdo);
        $second_question = get_question_2($pdo, $first_question->correct);
        $third_question = get_question_3($pdo, $second_question->correct, $first_question->correct);

        
        $questions = [
            $first_question,
            $second_question,
            $third_question
        ];

        echo json_encode($questions); // Gibt die Wetterdaten im JSON-Format aus
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]); // Gibt einen Fehler im JSON-Format aus, falls eine Ausnahme auftritt
    }


?>

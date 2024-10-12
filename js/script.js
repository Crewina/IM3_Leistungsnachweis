// Funktion, um SRF-Daten von der API zu fetchen
async function fetchSrfData() {
    try {
        // Hier die URL der PHP-Datei einfügen, die die Daten als JSON bereitstellt
        const response = await fetch('https://etl.mmp.li/Radio_SRF_1/etl/unload.php');
        
        // Prüfen, ob der Fetch erfolgreich war
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // JSON-Daten von der API abrufen
        const data = await response.json();

        // SRF-Daten verarbeiten und anzeigen (Beispiel in der Konsole)
        console.log("SRF-Daten:", data);

        // Hier kann weiteres DOM-Manipulation oder UI-Updates basierend auf den Daten stattfinden

    } catch (error) {
        // Fehlerbehandlung
        console.error('Fehler beim Abrufen der SRF-Daten:', error);
    }
}

// Diese Funktion wird beim Laden der Seite ausgeführt, um die Daten zu fetchen
window.addEventListener('DOMContentLoaded', () => {
    fetchSrfData();
});






document.addEventListener("DOMContentLoaded", function() {
    const quizContainer = document.getElementById('quiz-container');
    let currentQuestion = 0;
    let score = 0;

    const questions = [
        {
            question: "Werden auf SRF 3 seit dem 08.10.2024 mehr Klassiker oder Trends gespielt?",
            options: ["11:11", "15:32", "23:20", "18:10"],
            correct: 1,
            evaluationText: "Seit dem 08.10.2024 werden auf SRF 3 mehr Trends abgespielt."
        },
        {
            question: "Zu welcher Tageszeit wird dieser Song von [Künstler*in] am häufigsten auf SRF 3 gespielt?",
            options: ["11:11", "15:32", "23:20", "18:10"],
            correct: 3,
            evaluationText: "Zu dieser Tageszeit wird Flowers von Miley Cyrus rund 20 Mal abgespielt."
        },
        {
            question: "Wie lange ist die durchschnittliche Playtime von Liedern auf SRF 3?",
            options: ["11:11", "15:32", "23:20", "18:10"],
            correct: 2,
            evaluationText: "Die durchschnittliche Playtime von Liedern auf SRF 3 beträgt 23 Minuten und 20 Sekunden."
        },
        {
            question: "Welcher Künstler mit welchem Song wird seit dem 08.10.2024 am meisten auf SRF 3 gespielt?",
            options: ["11:11", "15:32", "23:20", "18:10"],
            correct: 0,
            evaluationText: "Seit dem 08.10.2024 wird Flowers von Miley Cyrus am häufigsten auf SRF 3 gespielt."
        }
    ];

    function loadQuestion(index) {
        const questionObj = questions[index];
        const questionHTML = `
            <div class="question-container">
                <h2>${questionObj.question}</h2>
                <div class="answers">
                    ${questionObj.options.map((option, idx) => `
                        <div class="answer-option" data-index="${idx}">
                            ${option}
                        </div>
                    `).join('')}
                </div>
                <button id="evaluate">Auswerten</button>
            </div>
            <div class="chart-container" id="chart-${index}" style="display: none;">
                <div class="chart-placeholder">Balkendiagramm kommt hierhin</div>
            </div>
        `;
        quizContainer.innerHTML = questionHTML;

        // Eventlistener für Multiple-Choice-Antworten
        const answerOptions = document.querySelectorAll('.answer-option');
        answerOptions.forEach(option => {
            option.addEventListener('click', function() {
                answerOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // Eventlistener für Auswerten-Button
        document.getElementById('evaluate').addEventListener('click', function() {
            const selectedOption = document.querySelector('.answer-option.selected');
            if (selectedOption) {
                const selectedAnswerIndex = parseInt(selectedOption.getAttribute('data-index'));
                showEvaluation(index, selectedAnswerIndex === questionObj.correct);
            } else {
                alert('Bitte eine Antwort auswählen.');
            }
        });
    }


    function showEvaluation(index, isCorrect) {
        const questionObj = questions[index];
        const evaluationHTML = `
            <div class="question-container">
                <p>${questionObj.evaluationText}</p>
                <div class="chart-container">
                    <div class="chart-placeholder">Balkendiagramm der Antwort</div>
                </div>
                <p>${isCorrect ? "Richtig!" : "Falsch!"}</p>
                <button id="next-question">Nächste Frage</button>
            </div>
        `;
        quizContainer.innerHTML = evaluationHTML;

        document.getElementById('next-question').addEventListener('click', function() {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                loadQuestion(currentQuestion);
            } else {
                showResult();
            }
        });
    }

    function showResult() {
        quizContainer.innerHTML = `
            <div class="question-container">
                <h2>Dein Ergebnis:</h2>
                <p>Du hast ${score} von ${questions.length} richtig beantwortet.</p>
                <div class="result-graphic">
                    <img src="img/result_graphic.png" alt="Ergebnis Grafik" />
                </div>
                <button id="restart">Von vorne beginnen</button>
            </div>
        `;

        document.getElementById('restart').addEventListener('click', function() {
            currentQuestion = 0;
            score = 0;
            loadQuestion(currentQuestion);
        });
    }

    loadQuestion(currentQuestion);
});



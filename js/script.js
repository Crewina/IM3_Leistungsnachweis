document.addEventListener("DOMContentLoaded", async function () {
    const quizContainer = document.getElementById('quiz-container');
    let currentQuestion = 0;
    let score = 0;

    const question1Data = await (await fetch("https://etl.mmp.li/Radio_SRF_1/etl/questionnaire.php")).json();
    const questions = question1Data;

    function loadQuestion(index) {
        const questionObj = questions[index];

        // Optionen zufällig mischen
        const shuffledOptions = questionObj.options
            .map((option, idx) => ({ option, idx })) // Verbinde Optionen mit ihren Indizes
            .sort(() => Math.random() - 0.5); // Zufällig sortieren

        const questionHTML = `
            <div class="question-container">
                <h2>${questionObj.question}</h2>
                <div class="answers">
                    ${shuffledOptions.map(({ option, idx }) => `
                        <div>
                            <input type="radio" id="option-${idx}" name="answer" value="${idx}">
                            <label for="option-${idx}">${option}</label>
                        </div>
                    `).join('')}
                </div>
                <button id="evaluate">Auswerten</button>
            </div>
            <!-- Das Diagramm wird hier erstellt, aber ist versteckt -->
            <div class="chart-container" style="display:none;">
                <canvas id="chart-${index}"></canvas>
            </div>
        `;
        quizContainer.innerHTML = questionHTML;

        // Eventlistener für den Auswerten-Button
        document.getElementById('evaluate').addEventListener('click', function () {
            const selectedOption = document.querySelector('input[name="answer"]:checked');
            if (selectedOption) {
                const selectedAnswerIndex = parseInt(selectedOption.value);
                showEvaluation(index, selectedAnswerIndex === questionObj.correct);
                renderChart(index, questionObj.result); // Rendern des Balkendiagramms mit den Ergebnissen
            } else {
                alert('Bitte eine Antwort auswählen.');
            }
        });
    }

    function renderChart(index, results) {
        const chartContainer = document.querySelector(`.chart-container`); // Hole den Container des Diagramms
        const ctx = document.getElementById(`chart-${index}`).getContext('2d');
        const labels = results.map(result => result.label);
        const data = results.map(result => result.amount);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '# Anzahl',
                    data: data,
                    backgroundColor: [
                        '#273169',
                        '#A7A3EF',
                        '#F1D7ED',
                        '#F9FFAD'
                    ],
                    borderColor: [
                        '#273169',
                        '#A7A3EF',
                        '#F1D7ED',
                        '#F9FFAD'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            color: '#FFFFFF' // Farbe für die x-Achsen-Beschriftung (HEX oder RGB möglich)
                        }
                    },
                    y: {
                        ticks: {
                            color: '#FFFFFF' // Farbe für die y-Achsen-Beschriftung
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false // Ausblenden der Legende
                    }
                }
            }
        });

        // Mache das Diagramm sichtbar
        chartContainer.style.display = 'block';
    }

    function showEvaluation(index, isCorrect) {
        const questionObj = questions[index];
        if (isCorrect) {
            score++;  // Punktzahl aktualisieren
        }
    
        // Bestimme die CSS-Klasse basierend auf dem Ergebnis
        const resultClass = isCorrect ? 'correct' : 'incorrect';

        remove
    
        // Erstelle die Progress-Bar HTML dynamisch basierend auf der aktuellen Frage
        const totalQuestions = 3; // Anzahl der Fragen, passe dies nach Bedarf an
        let progressBarHTML = '<div class="progress-bar">';
        
        for (let i = 0; i < totalQuestions; i++) {
            if (i === index) {
                progressBarHTML += `<span class="step active">${i + 1}</span>`;
            } else {
                progressBarHTML += `<span class="step">${i + 1}</span>`;
            }
        }
    
        progressBarHTML += '</div>';
    
        // Fragecontainer HTML mit dem Ergebnis und dem Diagramm
        const evaluationHTML = `
            <div class="question-container">
                <!-- Das Resultat-Label jetzt über dem Diagramm -->
                <p class="${resultClass}">${isCorrect ? "Richtig!" : "Falsch!"}</p>
                <p>${questionObj.evaluationText}</p>
                <div class="chart-container">
                    <canvas id="chart-${index}"></canvas>
                </div>
                <button id="next-question">Nächste Frage</button>
            </div>
        `;
    
        // Setze den HTML-Inhalt für das Quiz
        quizContainer.innerHTML = evaluationHTML;
    
        // Füge die Progress-Bar unter dem Fragecontainer hinzu
        quizContainer.insertAdjacentHTML('beforerend', progressBarHTML);

        const oldProgress= document.getElementsByClassName ('progress-bar')[1];
        quizContainer.remove(oldProgress);
    
        // Chart rendern und das Diagramm sichtbar machen
        renderChart(index, questionObj.result);
    
        document.getElementById('next-question').addEventListener('click', function () {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                loadQuestion(currentQuestion);
            } else {
                showResult();
            }
        });
    }
    
    
    
    function showResult() {
        // Berechne die Anzahl der korrekten Antworten (maximal 3)
        const maxScore = 3;
        const resultImages = [];
    
        // Füge für jede der 3 möglichen Punkte einen CD-Platz hinzu (cdl.png für richtig, cd_null.png für falsch)
        for (let i = 0; i < maxScore; i++) {
            if (i < score) {
                resultImages.push('<img src="img/cd.png" alt="Schallplatte" class="cd-image">');
            } else {
                resultImages.push('<img src="img/cd_null.png" alt="Leere Schallplatte" class="cd-image">');
            }
        }
    
        // Erstelle das HTML mit den eingebetteten Schallplattenbildern
        quizContainer.innerHTML = `
            <div class="question-container">
                <h2>Dein Ergebnis:</h2>
                <p>Du hast ${score} von ${questions.length} richtig beantwortet.</p>
                <div class="result-graphic">
                    ${resultImages.join('')}
                </div>
                <button id="restart">Von vorne beginnen</button>
            </div>
        `;
    
        // Eventlistener für den Restart-Button
        document.getElementById('restart').addEventListener('click', function () {
            currentQuestion = 0;
            score = 0;
            loadQuestion(currentQuestion);
        });
    }    

    loadQuestion(currentQuestion);
});

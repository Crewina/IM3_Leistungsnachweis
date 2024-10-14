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
                    label: '# Anzahl der Nennungen',
                    data: data,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
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
        const evaluationHTML = `
            <div class="question-container">
                <p>${questionObj.evaluationText}</p>
                <div class="chart-container">
                    <canvas id="chart-${index}"></canvas>
                </div>
                <p>${isCorrect ? "Richtig!" : "Falsch!"}</p>
                <button id="next-question">Nächste Frage</button>
            </div>
        `;
        quizContainer.innerHTML = evaluationHTML;

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

        document.getElementById('restart').addEventListener('click', function () {
            currentQuestion = 0;
            score = 0;
            loadQuestion(currentQuestion);
        });
    }

    loadQuestion(currentQuestion);
});

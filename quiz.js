let questions = [];
        let currentQuestionIndex = 0;
        let score1 = 0;
        let score2 = 0;
        let timer;
        const timePerQuestion = 10; // 10 seconds per question

        async function loadQuestions() {
            try {
                const response = await fetch('question.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                questions = await response.json();
            } catch (error) {
                console.error('Error loading questions:', error);
            }
        }

        loadQuestions().then(() => {
            startQuiz();
        });

        function startQuiz() {
            currentQuestionIndex = 0;
            score1 = 0;
            score2 = 0;
            document.getElementById('result').classList.add('hidden');
            showQuestion();
        }

        function showQuestion() {
            const currentQuestion = questions[currentQuestionIndex];
            document.getElementById('player1-question').innerText = currentQuestion.question;
            document.getElementById('player2-question').innerText = currentQuestion.question;

            // Clear previous options
            document.getElementById('player1-options').innerHTML = '';
            document.getElementById('player2-options').innerHTML = '';

            currentQuestion.options.forEach(option => {
                const button1 = document.createElement('button');
                button1.innerText = option;
                button1.onclick = () => selectAnswer(1, option);
                document.getElementById('player1-options').appendChild(button1);

                const button2 = document.createElement('button');
                button2.innerText = option;
                button2.onclick = () => selectAnswer(2, option);
                document.getElementById('player2-options').appendChild(button2);
            });

            startTimer();
        }

        function selectAnswer(player, selected) {
            clearInterval(timer);
            const currentQuestion = questions[currentQuestionIndex];

            if (selected === currentQuestion.answer) {
                if (player === 1) {
                    score1++;
                } else {
                    score2++;
                }
            }

            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                showQuestion();
            } else {
                showResult();
            }
        }

        function startTimer() {
            let timeLeft = timePerQuestion;
            document.getElementById('timer').innerText = `Time left: ${timeLeft}s`;
            timer = setInterval(() => {
                timeLeft--;
                document.getElementById('timer').innerText = `Time left: ${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    // Time's up, automatically skip to next question
                    currentQuestionIndex++;
                    if (currentQuestionIndex < questions.length) {
                        showQuestion();
                    } else {
                        showResult();
                    }
                }
            }, 1000);
        }

        function showResult() {
            document.getElementById('player1-card').classList.add('hidden');
            document.getElementById('player2-card').classList.add('hidden');
            document.getElementById('result').classList.remove('hidden');
            document.getElementById('final-score1').innerText = score1;
            document.getElementById('final-score2').innerText = score2;
        }

        document.getElementById('restart-btn').onclick = startQuiz;
        document.getElementById('player1-skip-btn').onclick = () => selectAnswer(1, null);
        document.getElementById('player2-skip-btn').onclick = () => selectAnswer(2, null);

        // Load questions and start the quiz
        loadQuestions();

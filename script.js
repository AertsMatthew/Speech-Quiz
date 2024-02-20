const startButton = document.getElementById('start-button');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const resultElement = document.getElementById('result');

let recognition;

startButton.addEventListener('click', startQuiz);

function startQuiz() {
  startButton.style.display = 'none';
  questionContainer.style.display = 'block';
  askQuestion();
}

function askQuestion() {
  const question = getQuestion();
  displayQuestion(question);
  speak(question.question);
  listenForAnswer(question);
}

function getQuestion() {
  // Hier kunnen vragen worden toegevoegd of verwijderd
  const questions = [
    {
      question: "Wat is de hoofdstad van Frankrijk?",
      answer: "Parijs",
      options: ["Londen", "Parijs", "Rome", "Madrid"]
    },
    {
      question: "Hoeveel planeten heeft ons zonnestelsel?",
      answer: "Acht",
      options: ["Negen", "Acht", "Zeven", "Tien"]
    },
    {
      question: "Wat is de grootste planeet in ons zonnestelsel?",
      answer: "Jupiter",
      options: ["Mars", "Aarde", "Saturnus", "Jupiter"]
    }
  ];
  // Willekeurige vraag uitkiezen
  return questions[Math.floor(Math.random() * questions.length)];
}

function displayQuestion(question) {
  questionElement.textContent = question.question;
  optionsElement.innerHTML = '';
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.classList.add('option-button');
    button.addEventListener('click', () => checkAnswer(option, question.answer));
    optionsElement.appendChild(button);
  });
}

function checkAnswer(selectedAnswer, correctAnswer) {
  if (selectedAnswer === correctAnswer) {
    resultElement.textContent = 'Goed antwoord!';
    speak('Goed antwoord!');
  } else {
    resultElement.textContent = `Fout antwoord. Het juiste antwoord is ${correctAnswer}`;
    speak(`Fout antwoord. Het juiste antwoord is ${correctAnswer}`);
  }
  setTimeout(askQuestion, 2000);
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

function listenForAnswer(question) {
  recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.lang = 'nl-NL';
  recognition.start();

  recognition.onresult = function(event) {
    const answer = event.results[0][0].transcript.trim();
    checkAnswer(answer, question.answer);
    recognition.stop();
  }

  recognition.onerror = function(event) {
    console.error('Speech recognition error:', event.error);
    recognition.stop();
    askQuestion();
  }
}

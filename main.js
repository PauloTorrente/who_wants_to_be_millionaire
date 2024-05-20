document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  const maxQuestions = 15;
  const categories = ['javascript', 'html', 'css'];
  let questionsAsked = 0;
  let currentQuestionData = null;
  let selectedOption = null;

  // Función principal para iniciar el juego
  function startGame() {
    root.innerHTML = '<div id="progress"></div><div id="question-container"></div>';
    questionsAsked = 0;
    selectedOption = null;
    updateProgress();
    fetchQuestion();
  }

  // Función para obtener una pregunta de la API
  function fetchQuestion() {
    if (questionsAsked >= maxQuestions) {
      displayGameOver('You completed all questions!');
      return;
    }

    const level = getLevel(questionsAsked);
    const category = getRandomCategory();

    const apiUrl = `https://quiz-api-ofkh.onrender.com/questions/random?level=${level}&category=${category}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        currentQuestionData = data;
        displayQuestion(data);
      })
      .catch(error => {
        console.error('Error fetching question:', error);
      });
  }

  // Función para determinar el nivel de dificultad
  function getLevel(questionsAsked) {
    if (questionsAsked < 5) {
      return 'easy';
    } else if (questionsAsked < 10) {
      return 'medium';
    } else {
      return 'hard';
    }
  }

  // Función para obtener una categoría aleatoria
  function getRandomCategory() {
    return categories[Math.floor(Math.random() * categories.length)];
  }

  // Función para mostrar la pregunta en pantalla
  function displayQuestion(questionData) {
    const container = document.getElementById('question-container');
    container.innerHTML = '';

    const question = document.createElement('div');
    question.className = 'question';
    question.textContent = questionData.description;
    container.appendChild(question);

    const options = document.createElement('div');
    options.className = 'options';
    container.appendChild(options);

    const answerOptions = Object.values(questionData.answers);

    answerOptions.forEach(option => {
      const button = document.createElement('button');
      button.className = 'button';
      button.textContent = option;
      options.appendChild(button);

      button.addEventListener('click', function() {
        handleOptionClick(button, option);
      });
    });
  }

  // Función para manejar el clic en una opción
  function handleOptionClick(button, option) {
    if (selectedOption) {
      selectedOption.classList.remove('selected');
    }
    selectedOption = button;
    button.classList.add('selected');
    validateAnswer(option);
  }

  // Función para validar la respuesta del jugador
  function validateAnswer(selectedOptionText) {
    const correctAnswer = currentQuestionData.correctAnswer;
    const options = document.querySelectorAll('.button');
    
    options.forEach(option => {
      option.disabled = true;
      console.log(option.textContent);
      console.log(correctAnswer);
      
      if (option.textContent === correctAnswer) {
        option.classList.add('correct');
      } else if (option.textContent === selectedOptionText) {
        option.classList.add('incorrect');
      }
    });

    if (selectedOptionText === correctAnswer) {
      questionsAsked++;
      updateProgress();
      setTimeout(fetchQuestion, 3000);
    } else {
      displayGameOver('Incorrect answer! Game Over.');
    }
  }

  // Función para actualizar el progreso del jugador
  function updateProgress() {
    const progress = document.getElementById('progress');
    progress.innerHTML = '';
    for (let i = 0; i < maxQuestions; i++) {
      const phase = document.createElement('div');
      phase.className = 'phase';
      if (i < questionsAsked) {
        phase.classList.add('completed');
      } else if (i === questionsAsked) {
        phase.classList.add('active');
      }
      progress.appendChild(phase);
    }
  }

  // Función para mostrar Game Over y reiniciar el juego
  function displayGameOver(message) {
    const container = document.getElementById('question-container');
    container.innerHTML = `<div id="game-over">${message}</div>`;
    setTimeout(startGame, 3000);
  }

  // Iniciar el juego al cargar la página
  startGame();
});

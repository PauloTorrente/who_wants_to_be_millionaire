document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  let questionsAsked = 0;
  const maxQuestions = 15;

  // Función principal para iniciar el juego
  function startGame() {
    fetchQuestion();
  }

  // Función para obtener una pregunta de la API
  function fetchQuestion() {
    if (questionsAsked >= maxQuestions) {
      console.log('Game Over');
      return;
    }

    let level, category;

    if (questionsAsked < 5) {
      level = 'easy';
    } else if (questionsAsked < 10) {
      level = 'medium';
    } else {
      level = 'hard';
    }

    const categories = ['html', 'css', 'javascript',];
    category = categories[Math.floor(questionsAsked / 5)];

    const apiUrl = `https://quiz-api-ofkh.onrender.com/questions/random?level=${level}&category=${category}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        displayQuestion(data);
      })
      .catch(error => {
        console.error('Error fetching question:', error);
      });
  }

  // Función para mostrar la pregunta en pantalla
  function displayQuestion(questionData) {
    if (!questionData) {
      console.error('No se ha recibido ningún dato de pregunta.');
      return;
    }

    root.innerHTML = '';

    const question = document.createElement('div');
    question.className = 'question';
    question.textContent = questionData.description; // Usamos la propiedad 'description' en lugar de 'question'
    root.appendChild(question);

    const options = document.createElement('div');
    options.className = 'options';
    root.appendChild(options);

    const answerOptions = Object.values(questionData.answers); // Convertimos las opciones de respuesta en un array

    answerOptions.forEach(option => {
      const button = document.createElement('button');
      button.className = 'button';
      button.textContent = option;
      options.appendChild(button);

      button.addEventListener('click', function() {
        validateAnswer(option, questionData.correctAnswer);
      });
    });
  }


  // Función para validar la respuesta del jugador
  function validateAnswer(selectedOption, correctAnswer) {
    const options = document.querySelectorAll('.button');
    options.forEach(option => {
      option.disabled = true;
      if (option.textContent === correctAnswer) {
        option.classList.add('correct');
      } else if (option.textContent === selectedOption) {
        option.classList.add('incorrect');
      }
    });

    questionsAsked++;
    setTimeout(fetchQuestion, 3000);
  }

  // Iniciar el juego al cargar la página
  startGame();
});

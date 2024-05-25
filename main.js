document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root'); // Elemento raíz donde se mostrará el juego
  const maxQuestions = 15; // Número máximo de preguntas en el juego
  const categories = ['javascript', 'html', 'css',]; // Categorías de preguntas disponibles
  let questionsAsked = 0; // Contador de preguntas realizadas
  let currentQuestionData = null; // Datos de la pregunta actual
  let selectedOption = null; // Opción seleccionada por el jugador

  // Función principal para iniciar el juego
  function startGame() {
    root.innerHTML = '<div id="progress" style="display: flex;justify-content: space-between;"></div><div id="question-container"></div>';
    questionsAsked = 0; // Reiniciar el contador de preguntas
    selectedOption = null; // Reiniciar la opción seleccionada
    updateProgress(); // Actualizar la barra de progreso
    fetchQuestion(); // Obtener la primera pregunta
  }

  // Función para obtener una pregunta de la API
  function fetchQuestion() {
    // Verificar si se han alcanzado el máximo de preguntas
    if (questionsAsked >= maxQuestions) {
      displayGameOver('You completed all questions!'); // Mostrar mensaje de finalización
      return;
    }

    const level = getLevel(questionsAsked); // Obtener el nivel de dificultad basado en el número de preguntas
    const category = getRandomCategory(); // Obtener una categoría aleatoria

    const apiUrl = `https://quiz-api-ofkh.onrender.com/questions/random?level=${level}&category=${category}`;

    fetch(apiUrl)
      .then(response => response.json()) // Convertir la respuesta a JSON
      .then(data => {
        currentQuestionData = data; // Almacenar los datos de la pregunta actual
        displayQuestion(data); // Mostrar la pregunta en pantalla
      });
  }

  // Función para determinar el nivel de dificultad basado en el número de preguntas
  function getLevel(questionsAsked) {
    if (questionsAsked < 5) {
      return 'easy'; // Primeras 5 preguntas son fáciles
    } else if (questionsAsked < 10) {
      return 'medium'; // Siguientes 5 preguntas son de dificultad media
    } else {
      return 'hard'; // Últimas 5 preguntas son difíciles
    }
  }

  // Función para obtener una categoría aleatoria
  function getRandomCategory() {
    return categories[Math.floor(Math.random() * categories.length)]; // Selección aleatoria de categoría
  }

  // Función para mostrar la pregunta en pantalla
  function displayQuestion(questionData) {
    const container = document.getElementById('question-container'); // Contenedor de la pregunta
    container.innerHTML = ''; // Limpiar el contenedor

    const question = document.createElement('div'); // Crear elemento para la pregunta
    question.className = 'question';
    question.textContent = questionData.description; // Mostrar el texto de la pregunta
    container.appendChild(question); // Añadir la pregunta al contenedor

    const options = document.createElement('div'); // Crear contenedor para las opciones de respuesta
    options.className = 'options';
    container.appendChild(options); // Añadir el contenedor de opciones

    const answerOptions = Object.values(questionData.answers); // Obtener las opciones de respuesta

    // Crear un botón para cada opción de respuesta
    answerOptions.forEach(option => {
      const button = document.createElement('button'); // Crear botón para la opción
      button.className = 'button';
      button.textContent = option; // Establecer el texto del botón
      options.appendChild(button); // Añadir el botón al contenedor de opciones

      // Añadir evento de clic al botón
      button.addEventListener('click', function() {
        handleOptionClick(button, option); // Manejar el clic en la opción
      });
    });
  }

  // Función para manejar el clic en una opción de respuesta
  function handleOptionClick(button, option) {
    // Si la opción ya está seleccionada (indicado por la clase 'selected')
    if (button.classList.contains('selected')) {
      // Validar la respuesta seleccionada
      validateAnswer(option);
    } else {
      // Deseleccionar la opción previamente seleccionada
      if (selectedOption) {
        selectedOption.classList.remove('selected');
      }
      selectedOption = button; // Establecer la opción seleccionada
      button.classList.add('selected'); // Marcar la opción como seleccionada
    }
  }

  // Función para validar la respuesta del jugador
  function validateAnswer(selectedOptionText) {
    const correctAnswerKey = currentQuestionData.correctAnswer; // Clave de la respuesta correcta
    const correctAnswerText = currentQuestionData.answers[correctAnswerKey]; // Texto de la respuesta correcta
    const options = document.querySelectorAll('.button'); // Seleccionar todos los botones de opciones

    // Deshabilitar todas las opciones y marcar correctas/incorrectas
    options.forEach(option => {
      option.disabled = true; // Deshabilitar opción

      if (option.textContent === correctAnswerText) {
        option.classList.add('correct'); // Marcar opción correcta
      } else if (option.textContent === selectedOptionText) {
        option.classList.add('incorrect'); // Marcar opción incorrecta
      }
    });

    // Si la opción seleccionada es correcta
    if (selectedOptionText === correctAnswerText) {
      questionsAsked++; // Incrementar contador de preguntas
      updateProgress(); // Actualizar la barra de progreso
      setTimeout(fetchQuestion, 3000); // Obtener la siguiente pregunta después de 3 segundos
    } else {
      displayGameOver('Has fracasado.'); // Mostrar mensaje de fin del juego
    }
  }

  // Función para actualizar el progreso del jugador
  function updateProgress() {
    const progress = document.getElementById('progress'); // Contenedor de la barra de progreso
    progress.innerHTML = ''; // Limpiar el contenedor de progreso
    for (let i = 0; i < maxQuestions; i++) {
      const phase = document.createElement('div'); // Crear elemento para cada fase de progreso
      phase.className = 'phase';
      if (i < questionsAsked) {
        phase.classList.add('completed'); // Marcar como completada
      } else if (i === questionsAsked) {
        phase.classList.add('active'); // Marcar como activa
      }
      progress.appendChild(phase); // Añadir
      phase.addEventListener('click', function() {
        handleProgressClick(i); // Manejar clic en la fase de progreso
      });
    }
  }

  // Función para manejar el clic en una fase de progreso
  function handleProgressClick(phaseIndex) {
    if (phaseIndex < questionsAsked) {
      questionsAsked = phaseIndex; // Retroceder al clickear en una fase completada
      updateProgress(); // Actualizar el progreso
      fetchQuestion(); // Obtener la pregunta correspondiente
    }
  }

  // Función para mostrar Game Over y reiniciar el juego
  function displayGameOver(message) {
    const container = document.getElementById('question-container'); // Contenedor de la pregunta
    container.innerHTML = `<div id="game-over">${message}</div>`; // Mostrar mensaje de Game Over
    setTimeout(startGame, 3000); // Reiniciar el juego después de 3 segundos
  }

  // Iniciar el juego al cargar la página
  startGame();
});

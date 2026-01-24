    const intro = {question: "Are you ready?", image: "images/default1.jpg", name: "quizIntro", option1: "Option-1", option2: "Option-2", option3: "Option-3"};
    
    const qContainer = document.querySelector(".q-container");
    const initBtn = document.getElementById("initBtn");
    const health = document.getElementById("health");
    const difficultyBox = document.getElementById("difficulty");
    const attemptBox = document.getElementById("attempt")
    const starBox = document.getElementById("starCount");
    const bonusBox = document.getElementById("bonus");
    const totalBox = document.getElementById("total");
    const healthItem = "❣️";
    let correctAnswer = 0;
    let healthRemain = 2;
    let attempt = 0;
    let star = 0;
    let bonus = 0;
    let total = 0;
    const correctSound = new Audio("sounds/correct-light.mp3");
    const incorrectSound = new Audio("sounds/incorrect-buzzer.mp3");
    const victorySound = new Audio("sounds/victory-ending.mp3");
    const defeatSound = new Audio("sounds/defeat-ending.mp3");


    function loadQuestions(data) {
      const question = document.createElement("h2");
      const image = document.createElement("img");
      const optionContainer = document.createElement("ul");
      const option1 = document.createElement("li");
      const option2 = document.createElement("li");
      const option3 = document.createElement("li");

      image.className = "image";
      optionContainer.className = "option-container";

      question.textContent = `Q: ${data.question}`;
      image.src = data.image;
      option1.textContent = `A: ${data.option1}`;
      option1.dataset.value = data.option1;
      option2.textContent = `B: ${data.option2}`;
      option2.dataset.value = data.option2;
      option3.textContent = `C: ${data.option3}`;
      option3.dataset.value = data.option3;

      if (data.name !== "quizIntro") {
        option1.addEventListener("click", (e) => {
          checkAnswer(e.target, data);
        });
        option2.addEventListener("click", (e) => {
          checkAnswer(e.target, data);
        });
        option3.addEventListener("click", (e) => {
          checkAnswer(e.target, data);
        });
      } else {
        option1.style.backgroundColor = "red";
        option2.style.backgroundColor = "green";
        option3.style.backgroundColor = "blue";
      }

      optionContainer.append(option1, option2, option3);
      qContainer.innerHTML = "";
      qContainer.appendChild(question);
      qContainer.appendChild(image);
      qContainer.appendChild(optionContainer);
    }

    loadQuestions(intro); //initialize the quiz introduction

    // pick up and show the questions randomly
    function randomLoadQuestions(data) {
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomQuestion = data[randomIndex];
      loadQuestions(randomQuestion);
    }

    // check the answer if one of the options is clicked
    function checkAnswer(el, targetEl) {
      const answerClicked = (el.dataset.value || "").trim();

      if (answerClicked === targetEl.name) {
        correctSound.play();
        el.style.backgroundColor = "green";
        updateValues(true);
        setTimeout(() => {
          changeQuizLevel();
        }, 1000);

      } else {
        incorrectSound.play();
        el.style.backgroundColor = "red";
        updateValues(false);
        if (healthRemain >= 0) {
          setTimeout(() => {
            changeQuizLevel();          
          }, 1000);
        }

        if (healthRemain < 0) {
          loadQuestions(intro);
          initBtn.disabled = false;
          initBtn.textContent = "Retry";
          initBtn.style.backgroundColor = "red";
          setTimeout(() => {
            defeatSound.play();
            alert("Nice try! Check out how many ⭐ you've got!")
          }, 50);
        }
      }
    }

    // load questions with the right level
    function changeQuizLevel() {
      if (correctAnswer <= 1) {
        randomLoadQuestions(level0);
      } else if (correctAnswer >= 2 && correctAnswer <= 3) {
        randomLoadQuestions(level1);
      } else if (correctAnswer >= 4 && correctAnswer <= 5) {
        randomLoadQuestions(level2);
      } else if (correctAnswer >= 6 && correctAnswer <= 7) {
        randomLoadQuestions(level3);
      } else if (correctAnswer >= 8) {
        loadQuestions(intro);
        initBtn.disabled = false;
        initBtn.textContent = "Retry";
        initBtn.style.backgroundColor = "red";
        setTimeout(() => {
          victorySound.play();
          alert("Congratulations! You are a genius! 🎉🤓🎉");
        }, 5);
      }
    }

    // updating the values
    function updateValues(state) {
      attempt += 1;
      attemptBox.textContent = attempt;

      if (state) {
        correctAnswer += 1;
        star = correctAnswer;
        starBox.textContent = star;
        difficultyBox.textContent = Math.floor(correctAnswer / 2);
        if (correctAnswer >= 8) {
          bonus = 3;
          bonusBox.textContent = bonus;
        }
        total = star + bonus;
        totalBox.textContent = total;
      } else {
        healthRemain -= 1;
        health.textContent = healthRemain >= 0 ? healthItem.repeat(healthRemain) : "";
      }

    }

    // restore the values to default
    function resetValues() {
      correctAnswer = 0;
      healthRemain = 2;
      health.textContent = healthItem.repeat(healthRemain);
      difficultyBox.textContent = "0";
      attempt = 0;
      attemptBox.textContent = attempt;
      star = 0;
      starBox.textContent = star;
      bonus = 0;
      bonusBox.textContent = bonus;
      totalBox.textContent = 0;
    }

    // initiaize the questions on the click event
    initBtn.addEventListener("click", () => {
      (bgSound1 ?? bgSound2)?.play();
      initBtn.textContent = "Start";
      initBtn.style.backgroundColor = "rgb(0, 94, 255)";
      resetValues();
      randomLoadQuestions(level0);
      initBtn.disabled = true;
    })

    

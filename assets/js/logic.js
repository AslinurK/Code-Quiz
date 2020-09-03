// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");
var questionScreen = document.querySelector("#questions");
var startScreen = document.querySelector("#start-screen");
var endScreen = document.querySelector("#end-screen");
var questionTitle = document.querySelector("#question-title");

// sound effects
var sfxRight = new Audio("assets/sfx/correct.wav");
var sfxWrong = new Audio("assets/sfx/incorrect.wav");

function startQuiz() {
  // hide start screen
  startScreen.setAttribute("class", "hide");

  // un-hide questions section
  questionScreen.setAttribute("class", "show");

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timerEl.html = time;

  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];
  // update title with current question
  questionTitle.textContent = currentQuestion.title;
  // clear out any old question choices
  choicesEl.textContent = " ";
  // loop over choices
  currentQuestion.choices.forEach(function(choiceOptions, i){
      // create new button for each choice
      // attach click event listener to each choice
      // display on the page    var choiceNode = document.createElement("button");
      var choiceNode = document.createElement("button");
          choiceNode.setAttribute("class", "choice");
          choiceNode.setAttribute("value", choiceOptions);

          // will list out choice number and what it is
          choiceNode.textContent = i + 1 + ". " + choiceOptions;
  
          // attach click event listener to each choice
          choiceNode.onclick = questionClick;
  
          // display on the page
          choicesEl.appendChild(choiceNode);
  })
}
    
function questionClick() {
  // check if user guessed wrong
  if (this.value !== questions[currentQuestionIndex].answer) {
  // penalize time
  time -= 15;
  // display new time on page
  timerEl.html = time;
  // play "wrong" sound effect
  sfxWrong.play();
  feedbackEl.textContent = "Wrong!";
  // else
  // play "right" sound effect
  } else {
  feedbackEl.textContent = "Correct!";
  sfxRight.play();
}

  // flash right/wrong feedback on page for half a second
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
  feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);
  // move to next question
  currentQuestionIndex++;
  // check if we've run out of questions
  if (currentQuestionIndex === questions.length) {
  // quizEnd
  quizEnd();
  // else
  } else {
  // getQuestion
  getQuestion();
  }
 }

function quizEnd() {
  // stop timer
  clearInterval(timerId);
  // show end screen
  // show final score
  endScreen.setAttribute("class" , "show");
  // hide questions section
  questionScreen.setAttribute("class" , "hide");
}

function clockTick() {
  // update time
  time-- ;
  timerEl.textContent = time ;
  // check if user ran out of time
  if ( time < 0 ){
    quizEnd();
  }
}

function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value.trim();
  // make sure value wasn't empty
  if (initials !== "") {
  // get saved scores from localstorage, or if not any, set to empty array
  var highscores =
  JSON.parse(window.localStorage.getItem("highscores")) || [];
  // format new score object for current user
  var newScore = {
    score: time,
    initials: initials
  };
  // save to localstorage
  highscores.push(newScore);
  window.localStorage.setItem("highscores", JSON.stringify(highscores));
  // redirect to next page
  window.location.href = "highscore.html";
  }
}

function checkForEnter(event) {
  // check if event key is enter
  if (event.key === "Enter") {
  // saveHighscore
  saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

initialsEl.onkeyup = checkForEnter;

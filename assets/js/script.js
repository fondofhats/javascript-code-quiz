const initialTime = 75;
var highScoresArr = [];
var time = initialTime;
var score = 0;
var qCount = 0;
var timeset;
var clock;
var viewHighSoreEl = document.querySelector("#info");
var timeEl = viewHighSoreEl.querySelector("#time");
var startEl = document.querySelector("#intro button");
var quizholderEl = document.querySelector("#quizHolder");
var questionHolderEl = document.querySelector("#questionHolder");
var highScoreHolder = document.querySelector("#highScoreHolder");
var recordsEl = document.querySelector("#records");
var answers = document.querySelectorAll("#questionHolder button");


/* HANDLERS */
var highScoreButtonHandler = function (event) {
  var targetEl = event.target;

  if (targetEl.matches("#scores")) {
    event.preventDefault();
    clearInterval(clock);
    timeEl.innerHTML = 0;
    time = initialTime;
    score = 0;
    qCount = 0;
    onlyDisplaySection("#highScores");
    recordsHtmlReset();
  }
};
var resetButtonHandler = function () {
  time = initialTime;
  score = 0;
  qCount = 0;
  removeLastQuestions();
  onlyDisplaySection("#intro");
};

var quizanswerButtonHandler = function (e) {
  if (e.target.getAttribute("data-question") === questions[qCount].answer) {
    //CORRECT ANSWER
    score++;
    qCount++;
    quizUpdate("Correct");
  } else {
    //INCORRECT ANSWER
    time = time - 10;
    qCount++;
    quizUpdate("Wrong");
  }
};

// On intro button click start time and starts giving questions
var startQuizButtonHandler = function () {
  setQuestionData();
  onlyDisplaySection("#quizHolder");
  timeEl.innerHTML = initialTime;
  clock = setInterval(myTimer, 1000);
};

var quizUpdate = function (answerCopy) {
  getAnElement("#scoreIndicator p").innerHTML = answerCopy;
  getAnElement("#scoreIndicator").classList.remove(
    "invisible",
    scoreIndicator()
  );

  answers = document.querySelectorAll("#questionHolder button");
  //disable all answer buttons
  for (var i = 0; i < answers.length; i++) {
    answers[i].classList.add("disable");
  }
  setTimeout(function () {
    if (qCount === questions.length) {
      onlyDisplaySection("#finish");
      time = 0;
      getAnElement("#time").innerHTML = time;
    } else {
      //remove last questions
      removeLastQuestions();
      // Updates copy in questions with the net array's question text.
      setQuestionData();
      // Removed disabled status.
      Array.from(answers).forEach((answer) => {
        answer.classList.remove("disable");
      });
    }
  }, 1000);
};

var recordsButtonHandler = function (e) {
  if (e.target.type == "submit") {
    var initialsRecord = getAnElement("#initials").value;
    if (initialsRecord === "") {
      getAnElement("#errorIndicator p").innerHTML =
        "You need at least 1 character";
      getAnElement("#errorIndicator").classList.remove(
        "invisible",
        errorIndicator()
      );
    } else if (initialsRecord.length > 5) {
      getAnElement("#errorIndicator p").innerHTML =
        "Maximum of 5 characters allowed.";
      getAnElement("#errorIndicator").classList.remove(
        "invisible",
        errorIndicator()
      );
    } else {
      //Sends value to current array for use now.
      highScoresArr.push({
        initials: initialsRecord,
        score: score,
      });
      //Sends value to local storage for later use.
      localStorage.setItem("highScores", JSON.stringify(highScoresArr));
      getAnElement("#highScores div").innerHTML = "";
      getAnElement("#score").innerHTML = "";
      onlyDisplaySection("#highScores");
      recordsHtmlReset();
      getAnElement("#initials").value = "";
    }
  }
};

/* Clears highscores from the html, array and localstorage */
var clearScoresButtonHandler = function () {
    highScoresArr = [];
    getAnElement("#highScores div").innerHTML = "";
    localStorage.removeItem("highScores");
};

var onlyDisplaySection = function (element) {
  var thisElement = getAnElement(element);
  hideAllSections();
  thisElement.classList.remove("hide");
};

var setQuestionData = function () {
  var questionObj = questions[qCount];

  var qtitle = document.createElement("p");
  qtitle.textContent = questionObj.title;
  questionHolderEl.appendChild(qtitle);

  for (var j = 0; j < questionObj.choices.length; j++) {
    var qbutton = document.createElement("button");
    qbutton.textContent = questionObj.choices[j];
    qbutton.setAttribute("data-questionNum", qCount);
    qbutton.setAttribute("data-question", questionObj.choices[j]);
    questionHolderEl.appendChild(qbutton);
  }
};

var removeLastQuestions = function () {
  var ptitle = questionHolderEl.querySelector("p");
  if (ptitle) {
    var rmtitle = questionHolderEl.removeChild(ptitle);
    answers = document.querySelectorAll("#questionHolder button");
    for (var i = 0; i < answers.length; i++) {
      var throwaway = questionHolderEl.removeChild(answers[i]);
    }
  }

  getAnElement("#scoreIndicator").classList.add("invisible");
};

var myTimer = function () {
  if (time > 0) {
    time -= 1;
    timeEl.innerHTML = time;
  } else {
    clearInterval(clock);
    getAnElement("#score").innerHTML = score;
    onlyDisplaySection("#finish");
  }
};

var scoreIndicator = function () {
  clearTimeout(timeset);
  timeset =
    (function () {
      getAnElement("#scoreIndicator").classList.add("invisible");
    },
    1000);
};

function getAnElement(x) {
  return document.querySelector(x);
}
function hideAllSections() {
  var sections = document.querySelectorAll("section");
  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.add("hide");
  }
}
function loadHighScores() {
  var highScores = localStorage.getItem("highScores");
  if (!highScores) {
    highScoresArr = [];
    return false;
  }
  highScoresArr = JSON.parse(highScores);
}

// FUNCTION to reset HTML display for the score
var recordsHtmlReset = function () {
  highScoreHolder.innerHTML = "";
  highScoresArr.sort(function (a, b) {
    return b.score - a.score;
  });
  for (var i = 0; i < highScoresArr.length; i++) {
    var scores = document.createElement("div");
    scores.innerHTML =
      i + 1 + ". " + highScoresArr[i].initials + " - " + highScoresArr[i].score;
    highScoreHolder.appendChild(scores);
  }
  answers = document.querySelectorAll("#questionHolder button");
  //disable all answer buttons
  for (var j = 0; j < answers.length; j++) {
    answers[j].classList.remove("disable");
  }
};

var errorIndicator = function () {
  clearTimeout(timeset);
  timeset = setTimeout(() => {
    getAnElement("#errorIndicator").classList.add("invisible");
  }, 3000);
};

/* EVENT LISTENERS */
viewHighSoreEl.addEventListener("click", highScoreButtonHandler);
getAnElement("#reset").addEventListener("click", resetButtonHandler);
startEl.addEventListener("click", startQuizButtonHandler);
quizholderEl.addEventListener("click", quizanswerButtonHandler);
recordsEl.addEventListener("click", recordsButtonHandler);
getAnElement("#clearScores").addEventListener("click",clearScoresButtonHandler);

loadHighScores();

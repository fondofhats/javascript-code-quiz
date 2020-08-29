const initialTime = 75;
var highScoresArr = [];
var time = 75;
var score = 0;
var qCount = 0;
var timeset;
var clock;
var viewHighSoreEl = document.querySelector("#info");
var timeEl = viewHighSoreEl.querySelector("#time");
var poswrapperEl = document.querySelector("#positionWrapper");
var highScoresEl = document.querySelector("#highScores");
var resetEl = document.querySelector("#reset");
var startEl = document.querySelector("#intro button");
var quizholderEl = document.querySelector("#quizHolder");
var questionHolderEl = document.querySelector("#questionHolder");
var scoreEl = document.querySelector("#score");


var answers = document.querySelectorAll("#questionHolder button");

/* TEST SCORES OBJECT */
function CreateTestScores() {
    var testScores = [];
    var testScoreInit = ["aa", "bb", "cc"];
    var testScoreValues = ["50", "10", "90"];

    for(var i=0;i<testScoreInit.length;i++) {
        testScores[i] = {
            initals: testScoreInit[i],
            score: testScoreValues[i]
        };
    }
    localStorage.setItem("highScores", JSON.stringify(testScores));
}


/* HANDLERS */
var highScoreButtonHandler = function(event) {
    var targetEl = event.target;

    if(targetEl.matches("#scores")){
        event.preventDefault();
        /* clearInterval(clock); */
        timeEl.innerHTML=0;
		time = initialTime;
		score = 0;
		qCount = 0;
		onlyDisplaySection("#highScores");
		/* recordsHtmlReset(); */
    }

};
var resetButtonHandler = function(event) {
    var resetEl = event.target;
    time = initialTime;
    score = 0;
    qCount = 0;
    onlyDisplaySection("#intro");

};


var quizanswerButtonHandler = function(e) {
    console.dir(e.target);
    //console.log(e.target.getAttribute("data-question"));
    if(e.target.getAttribute("data-question")=== questions[qCount].answer){
        //CORRECT ANSWER
        console.log("CORRECT");
        score++;
        qCount++;
        quizUpdate("Correct");
    }
    else {
        //INCORRECT ANSWER
        console.log("INNCORRECT");
        time = time - 10;
        qCount++;
        quizUpdate("Wrong");
    }
};


// On intro button click start time and starts giving questions    
var startQuizButtonHandler = function(event) {
    setQuestionData();
    onlyDisplaySection("#quizHolder");
    clock = setInterval(myTimer, 1000);
};

var quizUpdate = function(answerCopy) {
    getAnElement('#scoreIndicator p').innerHTML = answerCopy;
    getAnElement('#scoreIndicator').classList.remove('invisible', scoreIndicator());

    answers = document.querySelectorAll("#questionHolder button");
    //disable all answer buttons
    for(var i=0;i<answers.length;i++)
    {
        answers[i].classList.add('disable');
    }
    setTimeout(function() {
        if (qCount === questions.length) {
            onlyDisplaySection("#finish");
            time = 0;
            getAnElement('#time').innerHTML = time;
        } else {
            //remove last questions
            removeLastQuestions();
            // Updates copy in questions with the net array's question text.
            setQuestionData();
            // Removed disabled status.
            Array.from(answers).forEach(answer => {
                answer.classList.remove('disable');
            });
        }
    }, 1000);

};





var onlyDisplaySection = function(element) {
    var thisElement = getAnElement(element);
    hideAllSections();
    thisElement.classList.remove('hide');    
};

var setQuestionData = function() {
    var questionObj = questions[qCount];

    var qtitle = document.createElement("p");
    qtitle.textContent = questionObj.title;
    questionHolderEl.appendChild(qtitle);
    
    for(var j=0;j<questionObj.choices.length;j++){
        var qbutton = document.createElement("button");
        qbutton.textContent=questionObj.choices[j];
        qbutton.setAttribute("data-questionNum",qCount);
        qbutton.setAttribute("data-question",questionObj.choices[j]);
        questionHolderEl.appendChild(qbutton);
    }
};

var removeLastQuestions = function(){
    var ptitle = questionHolderEl.querySelector("p");
    var rmtitle = questionHolderEl.removeChild(ptitle);
    answers = document.querySelectorAll("#questionHolder button");
    for(var i=0;i<answers.length;i++){
        var throwaway = questionHolderEl.removeChild(answers[i]);
    }
    getAnElement("#scoreIndicator").classList.add('invisible');
};

var myTimer = function() {
    if(time > 0) {
        time -= 1;
        timeEl.innerHTML= time;
    }
    else {
        clearInterval(clock);
        getAnElement('#score').innerHTML = score;
        onlyDisplaySection("#finish");
    }
};

var scoreIndicator = function() {
    clearTimeout(timeset);
    timeset = (function(){
        getAnElement("#scoreIndicator").classList.add('invisible');
    }, 1000);
};

function getAnElement(x) {
    return document.querySelector(x);
}
function hideAllSections() {
    var sections = document.querySelectorAll("section");
    for(var i=0;i<sections.length;i++) {
        sections[i].classList.add('hide');
    }
}
function loadHighScores(){
    var highScores = localStorage.getItem("highScores");
    if(!highScores) {
        highScoresArr=[];
        return false;
    }
    var highScoresDivEl = document.querySelector("#highScores div");

    highScores = JSON.parse(highScores);
    for(var i=0;i<highScores.length;i++) {
        var scores = document.createElement("div");
        scores.innerHTML = i + "." + highScores[i].initals + " - " + highScores[i].score;
        highScoresDivEl.appendChild(scores);
    }
}


/* EVENT LISTENERS */
viewHighSoreEl.addEventListener("click",highScoreButtonHandler);
resetEl.addEventListener("click", resetButtonHandler);
startEl.addEventListener("click", startQuizButtonHandler);
quizholderEl.addEventListener("click", quizanswerButtonHandler);

CreateTestScores();
loadHighScores();
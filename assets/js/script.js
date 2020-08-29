const initialTime = 75;
var highScoresArr = [];
var time = 75;
var score = 0;
var qCount = 0;
var timeset;
var viewHighSoreEl = document.querySelector("#info");
var timeEl = viewHighSoreEl.querySelector("#time");
var pageContentEl = document.querySelector("#page-content");
var highScoresEl = document.querySelector("#highScores");
var resetEl = document.querySelector("#reset");


var answers = document.querySelectorAll('#quizHolder button');

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

var onlyDisplaySection = function(element) {
    var thisElement = getAnElement(element);
    hideAllSections();
    thisElement.classList.remove('hide');    
};


var recordsArray = [];
	// Retrieve data if it exists or keep empty array otherwise.
    (localStorage.getItem('recordsArray')) ? recordsArray = JSON.parse(localStorage.getItem('recordsArray')): recordsArray = [];

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

 /*    var scores = document.createElement("div");
    scores.innerHTML = i + ". " + check.initialRecord + " - " + check.score;
    queryElement('#highScores div').appendChild(scores);
    i = i + 1 */
}


/* EVENT LISTENERS */
viewHighSoreEl.addEventListener("click",highScoreButtonHandler);
resetEl.addEventListener("click", resetButtonHandler);
/* pageContentEl.addEventListener("click", highScoreButtonHandler); */

CreateTestScores();
loadHighScores();
// ORDER: "Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Bold", "Docile", "Relaxed", "Impish", "Lax", "Timid", "Hasty", "Serious", "Jolly", "Naive", "Modest", "Mild", "Quiet", "Bashful", "Rash", "Calm", "Gentle", "Sassy", "Careful", "Quirky"
const natureList = ["Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Bold", "Docile", "Relaxed", "Impish", "Lax", "Timid", "Hasty", "Serious", "Jolly", "Naive", "Modest", "Mild", "Quiet", "Bashful", "Rash", "Calm", "Gentle", "Sassy", "Careful", "Quirky"];
var score = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var questionOrder = [];
var selectionID = 0;
var currQuestion;
var gender;
var typeBoost;
var season;
var result;
var questions;
var musicStarted = false;
var introComplete = false;

startProcess();

async function startProcess()
{
    specialScript = await loadData("data/scriptSpecial.json");
    await startScreen();
    setTimeout(mainProcess, 3000);
}

async function startScreen()
{

    let introText = await specialScript.filter(q => q.type == "Intro");
    await darkMonologue(introText[0].dialogue, introText[0].dialogue.length - 1);
}

async function darkMonologue(dialogue, iterations)
{
    await fadeInDarkBackground();
    await createMonologueContainer();
    for (let i = 0; i < iterations + 1; i++)
    {
        await monologueText(dialogue[i]);
        await waitForMonologueClick(i, iterations);
    }
}

async function fadeInDarkBackground()
{
    let a = document.getElementById("background");
    let darkBG = document.createElement("div");
    darkBG.classList = "fadeIn";
    darkBG.id = "darkBG";
    a.insertBefore(darkBG, a.firstChild);
}

async function fadeOutDarkBackground()
{
    let a = document.getElementById("darkBG");
    a.classList = "fadeOut";
}

async function createMonologueContainer()
{
    let a = document.getElementById("results");
    let dialogueContainer = document.createElement("div");
    dialogueContainer.id = "monologueContainer";
    a.appendChild(dialogueContainer);
}

async function monologueText(text)
{
    let a = document.getElementById("monologueContainer");
    let dialogue = document.createElement("p");
    dialogue.id = "monologueDialogue";
    dialogue.innerHTML = text;
    a.appendChild(dialogue);
}

function waitForMonologueClick(currentLine, finalLine) {
    return new Promise((resolve) => {
        const container = document.getElementById("monologueContainer");

        const progressMonologue = (event) => {
            if (!musicStarted)
            {
                playMusic();
            };
            eraseMonologueText();
            if (currentLine == finalLine)
            {
                fadeOutDarkBackground();
                setTimeout(endMonologueScene, 3000);
            }
            container.removeEventListener('click', progressMonologue);
            resolve();
        };
    
    container.addEventListener('click', progressMonologue);
    });
}

function eraseMonologueText()
{
    let a = document.getElementById("monologueDialogue");
    a.remove();
}

async function endMonologueScene()
{
    let a = document.getElementById("monologueContainer");
    let b = document.getElementById("darkBG");
    a.remove();
    b.remove();
}
async function mainProcess()
{
    questions = await loadData("data/questions.json");
    
    selectQuestions();
    fillVerticalSpace();

    for (var i = 0; i < questionOrder.length; i++)
    {
        currQuestion = questions.find(q => q.id == questionOrder[i]);
        generateQuestion(i);
        selectionID = await waitForButtonClick(".answerButton");
        switch (currQuestion.id)
        {
            case 0:
                season = currQuestion.values[selectionID];
                break;
            case 1:
                typeBoost = currQuestion.values[selectionID];
                break;
            case 39:
                gender = currQuestion.values[selectionID];
                break;
            default:
                addScore(currQuestion.influence[selectionID], currQuestion.values[selectionID]);
        }
        
        clearDisplay();
    }

    result = await window.getResult(score, season, typeBoost, gender);
    console.log("Result");
    console.log(result);
    freeVerticalSpace();
    window.sendResult(result);
}

async function loadData(url)
{
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        data = await response.json();
        return data;
    } catch (error) {
        console.warn(`Failed to load ${url}, using fallback.`, error);
    }
}

function selectQuestions()
{
    // Starts with two of the guaranteed questions
    var questionIDs = [0, 1];
    var a = 0;

    // Selects a special question
    questionIDs.push(Math.floor(Math.random() * (4 - 2 + 1) + 2));

    while (questionIDs.length < 10)
    {
        // This pulls from question IDs 5 - 38. 0 and 1 are reserved for season and type, 2-4 are special questions, 39 is gender
        a = Math.floor(Math.random() * (38 - 5 + 1) + 5);
        if (!questionIDs.includes(a))
        {
            questionIDs.push(a);
        }
    }

    questionOrder = jumbleArray(questionIDs);
    console.log(questionOrder);
    // Guaranteed final question added after the reshuffle
    questionOrder.push(39)
}

function jumbleArray(oldArray)
{
    let newArray = oldArray;

    for (let i = newArray.length -1; i > 0; i--) 
    {
        let a = Math.floor(Math.random() * (i+1));
        let b = newArray[i];
        newArray[i] = newArray[a];
        newArray[a] = b;
    }

    return newArray;
}

function fillVerticalSpace()
{
    let a = document.getElementById("quiz");
    let spaceFiller = document.createElement("div");
    spaceFiller.classList = "fillSpace";
    a.insertBefore(spaceFiller, a.firstChild);
}

function freeVerticalSpace()
{
    let a = document.getElementById("quiz");
    a.firstChild.remove();
}

// Display dialogue boxes, invoke this in later functions. Add "skippable" flag for ones that can be clicked through (this would be false for questions for example) and "selectable" for answers
function createTextbox(container, skippable, clickable, boxClass, text)
{

    textbox = document.createElement("div");
    textbox.classList = boxClass;
    
    if(boxClass == "question")
    {
        textbox.classList.add("hasBorder");
    }

    if (skippable)
    {
        textbox.classList.add("skippable");
        window.addEventListener("click", () => 
            {
                if (textBox) 
                {
                    textBox.remove();
                }
            }
        );
    }
    if (clickable)
    {
        textbox.classList.add("clickable");
    }
    
    boxText = document.createElement("p");
    boxText.textContent = text;

    container.appendChild(textbox);
    textbox.appendChild(boxText);

}

// Pass through a "round" number so it knows where to look in the questions array, link to the appropriate data in the json and populate a textbox
function generateQuestion()
{
    a = document.getElementById("textbox");
    a.innerHTML = "";

    createTextbox(a, false, false, "question", currQuestion.question);

    generateAnswers();
}

function generateAnswers()
{
    a = document.getElementById("answers");
    a.innerHTML = "";

    buttonContainer = document.createElement("div");
    buttonContainer.classList = "answerList";

    a.appendChild(buttonContainer);

    for (var i = 0; i < currQuestion.options.length; i++)
    {
        answerButton = null;
        answerButton = document.createElement("button");
        answerButton.classList.add("answerButton");
        answerButton.classList.add("hasBorder");
        answerButton.textContent = currQuestion.options[i];
        answerButton.dataset.value = i;

        buttonContainer.appendChild(answerButton);
    }
}

function addScore(answerNature, points)
{
    nature = makeArray(answerNature);
    if (nature.length == 1)
    {
        var natureIndex = natureList.indexOf(nature[0]);
        score[natureIndex] = score[natureIndex] + points;
    }
    else if (nature.length > 1)
    {
        for (var i = 0; i < nature.length; i++)
        {
            var natureIndex = natureList.indexOf(nature[i]);
            if (points.length > 1)
            {
                score[natureIndex] += points[i];
            }
            else
            {
                score[natureIndex] = score[natureIndex] + points;
            }
        }
    }
    else
    {
        console.log("Error, no corresponding nature found.");
    }
}

function waitForButtonClick(buttonClass) {
    return new Promise((resolve) => {
        const buttons = document.querySelectorAll(buttonClass);

        const handleClick = (event) => {
            const index = Number(event.target.dataset.value);
            buttons.forEach(btn => btn.removeEventListener('click', handleClick));
            resolve(index);
        };
    
    buttons.forEach(btn => btn.addEventListener('click', handleClick));
    });
}

// Turns things into arrays
function makeArray(input) {

  if (Array.isArray(input))
    {
        return input;
    }

  // Attempts to parse a string into an array
  try 
  {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) return parsed;
  } 
  catch (e) 
  {
    
  }

  return [input];
}

function reset()
{
    clearDisplay();
    clearData();
    mainProcess();
}

function clearDisplay()
{
    a = document.getElementById("textbox");
    a.innerHTML = null;
    a = document.getElementById("answers");
    a.innerHTML = null;
    a = document.getElementById("results");
    a.innerHTML = null;
}

function clearData()
{
    score = [];
    questionOrder = [];
    selectionID = null;
    currQuestion = null;
    result = null;
}

function playMusic()
{
    let a = document.getElementById("music");
    a.play(); 
}

function debugLine()
{
    console.log("==================================");
}
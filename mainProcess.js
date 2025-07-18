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

mainProcess();

async function mainProcess()
{
    // Call question database
    questions = await loadData("data/questions.json");

    selectQuestions();
    fillVerticalSpace();

    for (var i = 0; i < questionOrder.length; i++)
    {
        console.log("Printing the value of i");
        console.log(i);
        console.log("It shouldn't stop until");
        console.log(questionOrder.length);
        currQuestion = questions.find(q => q.id == questionOrder[i]);
        generateQuestion(i);
        selectionID = await waitForButtonClick(".answer-button");
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
    await waitForButtonClick(".restart");
}

async function loadData(url)
{
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        data = await response.json();
        console.log(data);
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
    questionIDs.push(Math.floor(Math.random() * (4 - (2 + 1)) + 2));

    while (questionIDs.length < 10)
    {
        // Math hard. Make sure this pulls from question IDs 5 - 38. 0 and 1 are reserved for season and type, 2-4 are special questions, 39 is gender
        a = Math.floor(Math.random() * (38 - 5 + 1) + 5);

        if (!questionIDs.includes[a])
        {
            questionIDs.push(a);
        }
    }

    questionOrder = jumbleArray(questionIDs);
    // Guaranteed final question added after the reshuffle
    questionOrder.push(39)
}

function jumbleArray(oldArray)
{

    for (let i = oldArray.length -1; i > 0; i--) 
    {
        let a = Math.floor(Math.random() * (i+1));
        let b = oldArray[i];
        oldArray[i] = oldArray[a];
        oldArray[a] = b;
    }

    return oldArray;
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

    console.log(questions);
    console.log(currQuestion);
    console.log(currQuestion.options);

    generateAnswers()
}

function generateAnswers()
{
    a = document.getElementById("answers");
    a.innerHTML = "";

    buttonContainer = document.createElement("div");
    buttonContainer.classList = "answer-list";

    a.appendChild(buttonContainer);

    for (var i = 0; i < currQuestion.options.length; i++)
    {
        answerButton = null;
        answerButton = document.createElement("button");
        answerButton.classList.add("answer-button");
        answerButton.classList.add("hasBorder");
        answerButton.textContent = currQuestion.options[i];
        answerButton.dataset.value = i;

        buttonContainer.appendChild(answerButton);
    }
}

function addScore(answerNature, points)
{
    nature = makeArray(answerNature);
    console.log("Old score");
    console.log(score)
    if (nature.length == 1)
    {
        var natureIndex = natureList.indexOf(nature[0]);
        score[natureIndex] = score[natureIndex] + points;
    }
    else if (nature.length > 1)
    {
        console.log("MORE THAN ONE NATURE");
        for (var i = 0; i < nature.length; i++)
        {
            console.log(nature[i]);
            console.log(natureList.indexOf(nature[i]));
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

    console.log("New score");
    console.log(score);
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

function clearData()
{
    score = [];
    questionOrder = [];
    selectionID = 0;
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

function debugLine()
{
    console.log("==================================");
}
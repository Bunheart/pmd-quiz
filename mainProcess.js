
// ORDER: "Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Bold", "Docile", "Relaxed", "Impish", "Lax", "Timid", "Hasty", "Serious", "Jolly", "Naive", "Modest", "Mild", "Quiet", "Bashful", "Rash", "Calm", "Gentle", "Sassy", "Careful", "Quirky"
const natureList = ["Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Bold", "Docile", "Relaxed", "Impish", "Lax", "Timid", "Hasty", "Serious", "Jolly", "Naive", "Modest", "Mild", "Quiet", "Bashful", "Rash", "Calm", "Gentle", "Sassy", "Careful", "Quirky"];
var score = [];
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
    questions = await loadData("/data/questions.json");

    selectQuestions();

    for (i = 0; i < questionOrder.length; i++)
    {
        console.log("Printing the value of i");
        console.log(i);
        console.log("It shouldn't stop until");
        console.log(questionOrder.length);
        currQuestion = questions.find(q => q.id == questionOrder[i]);
        generateQuestion(i);
        selectionID = await waitForButtonClick(".answer-button");
        console.log("proceeding");
        switch (currQuestion.id)
        {
            case 0:
                season = currQuestion.values[selectionID];
                break;
            case 1:
                typeBoost = currQuestion.values[selectionID];
                break;
            case 42:
                gender = currQuestion.values[selectionID];
                break;
            default:
                addScore(currQuestion.influence[selectionID], currQuestion.values[selectionID]);
        }
        
        clearDisplay();
    }

    result = window.getResult(score, season, typeBoost, gender);
    sendResult(result);
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

// Display dialogue boxes, invoke this in later functions. Add "skippable" flag for ones that can be clicked through (this would be false for questions for example) and "selectable" for answers
function createTextbox(container, skippable, clickable, boxClass, text)
{

    textbox = document.createElement("div");
    textbox.classList = boxClass;
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

    for (i = 0; i < currQuestion.options.length; i++)
    {
        answerButton = null;
        answerButton = document.createElement("button");
        answerButton.classList.add("answer-button");
        answerButton.textContent = currQuestion.options[i];
        answerButton.dataset.value = i;

        buttonContainer.appendChild(answerButton);
    }
}

function addScore(nature, points)
{
    for (const n of nature)
    {
        i = 0;
        a = natureList.indexOf(n);
        if (points.length > 1)
        {
            score[a] += points[i];
            i++
        }
        else
        {
            score[a] += points[0];
        }
        
    }
}

function sendResult(result)
{
    a = document.getElementById("results");
    a.innerHTML = "";

    script = require('./data/questions.json');
    natureScript = script.filter(q => q.nature == result.nature);
    for(const text of natureScript.text)
    {
        createTextbox(a, true, false, "dialogue", text, "p", 0);
    }
    createTextbox(a, true, false, "dialogue", "Someone like you should be...", "p", 0);
    showImage(a, result);
    createTextbox(a, false, false, "dialogue", "A <style class=\"pokeName\">" & result.name & "</style>!", "p", 0);

}

function showImage(container, result)
{
    imageBox = document.createElement("div");
    imageBox.classList.add("portrait");

    imageContent = document.createElement("img");
    imageContent.src = "/img/" & result.ID & ".png";
    imageContent.alt = "A portrait showing a picture of " & result.name & ".";

    container.append(imageBox);
    container.append(imageContent);
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
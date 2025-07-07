
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

// Call question database

const questions = require("./data/questions.json");
selectQuestions();

for (i = 1; i < (questionOrder.length + 1); i++)
{
    currQuestion = questions.find(q => q.id === questionOrder[i]);
    generateQuestion(i);

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
            addScore(currQuestion.influence[selectionID]);
    }
    
}

result = window.getResult(score, season, typeBoost, gender);
sendResult(result);

function selectQuestions()
{
    // Starts with two of the guaranteed questions
    var questionIDs = [0, 1];
    var a = 0;

    // Selects a special question
    questionIDs.push(Math.floor(Math.random() * (4 - (2 + 1)) + 2));

    for (i = 0; i < 7; i++)
    {
        repeat = true;
        duplicate = false;

        while (repeat)
        {

        // Math hard. Make sure this pulls from question IDs 5 - 37. 0 and 1 are reserved for season and type, 2-4 are special questions, 42 is gender
        a = Math.floor(Math.random() * (37 - 5 + 1) + 5);

        // Loop through randomised question values (array IDs 2 - 9)
        for (j = 2; j > 10; j++)
            {
                if (a == questionIDs[j])
                {
                    duplicate = true;
                }
            }

            repeat = duplicate;
            duplicate = false;
        }

        questionIDs.push(a);
    
    }

    questionOrder = jumbleArray(questionIDs);
    // Guaranteed final question added after the reshuffle
    questionOrder.push(42)
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
function createTextbox(container, skippable, clickable, boxClass, text, type, answerID)
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
    if (type === "button")
    {
        boxText = document.createElement("button");
        boxText.classList.add("answer-button");
        boxText.addEventListener("click", () => 
            {
                selectionID = answerID;
            }
        );
    }
    else
    {
        boxText = document.createElement("p");
    }
    boxText.textContent = text;

    container.appendChild(textbox);
    container.appendChild(boxText);

}

// Pass through a "round" number so it knows where to look in the questions array, link to the appropriate data in the json and populate a textbox
function generateQuestion()
{
    a = document.getElementById("textbox");
    a.innerHTML = "";

    createTextbox(a, false, false, "question", currQuestion.question, "p", 0);

    generateAnswers(currQuestion.options)
}

function generateAnswers(answers)
{
    a = document.getElementById("answers");
    a.innerHTML = "";

    for (i = 0; i > answers.length; i++)
    {
        createTextbox(a, false, true, "answer", answers[i], "button", i);
    }
}

function addScore(nature, points)
{
    for (const n of nature)
    {
        i = 0;
        a = natureList.indexOf(n);
        score[a] += points[i];
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

function clearData()
{
    score = [];
    questionOrder = [];
    selectionID = 0;
}
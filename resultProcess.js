var finalName;
var finalID;
var finalNature;

async function sendResult(result)
{
    await resultReassignment(result);

    let a = document.getElementById("results");
    a.innerHTML = "";

    script = await loadData("data/script.json");

    natureScript = await script.filter(q => q.nature == finalNature);
    natureScript[0].dialogue.push("Someone like you should be...");

    let finalScript = await assembleFinalScript(natureScript[0].dialogue);

    await darkMonologue(finalScript, finalScript.length - 1);

    let b = document.createElement("div");
    b.id = "finalResult";
    a.appendChild(b);

    let resultContainer = document.createElement("div");
    resultContainer.classList = "resultContainer";
    b.appendChild(resultContainer);

    showImage(resultContainer);
    createTextboxResult(resultContainer, "A <span class=\"pokeName\">" + finalName + "</span>!", "p");
    createResetButton(resultContainer);

}

async function resultReassignment(oldData)
{
    finalName = oldData[0].name;
    finalID =  oldData[0].id;
    finalNature = oldData[0].nature;
}

function showImage(container)
{
    imageBox = document.createElement("div");

    imageContent = document.createElement("img");
    imageContent.src = "img/" + finalID + ".png";
    imageContent.alt = "A portrait showing a picture of " + finalName + ".";
    imageContent.classList.add("portrait");
    imageContent.classList.add("hasBorder");

    container.append(imageBox);
    imageBox.append(imageContent);
}

function createTextboxResult(container, text)
{

    textbox = document.createElement("div");
    textbox.classList.add("resultsDialogue");
    textbox.classList.add("hasBorder");
    
    boxText = document.createElement("p");
    boxText.innerHTML = text;
    container.appendChild(textbox);
    textbox.appendChild(boxText);

}

function createResetButton(container)
{
    let buttonContainer = document.createElement("div");
    buttonContainer.classList = "resetContainer";

    container.appendChild(buttonContainer);

    resetButton = document.createElement("button");
    resetButton.classList.add("resetButton");
    resetButton.classList.add("hasBorder");
    resetButton.textContent = "Reset";
    resetButton.addEventListener('click', reset);
    buttonContainer.appendChild(resetButton);
}

function assembleFinalScript(natureDialogue)
{
    let finalScript = [];

    let resultsIntro = specialScript.filter(q => q.type == "PreResults");

    console.log(resultsIntro)
    for(let i = 0; i < resultsIntro[0].dialogue.length; i++)
    {
        finalScript.push(resultsIntro[0].dialogue[i]);
    }

    for(let i = 0; i < natureDialogue.length; i++)
    {
        finalScript.push(natureDialogue[i]);
    }

    return finalScript;

}
window.sendResult = sendResult;
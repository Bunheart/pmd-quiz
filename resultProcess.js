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
    await darkMonologue(natureScript[0].dialogue, natureScript[0].dialogue.length - 1);

    let b = document.createElement("div");
    b.id = "finalResult";
    a.appendChild(b);

    let resultContainer = document.createElement("div");
    resultContainer.classList = "resultContainer";
    b.appendChild(resultContainer);

    showImage(resultContainer);
    createTextboxResult(resultContainer, false, false, "dialogue", "A <span class=\"pokeName\">" + finalName + "</span>!", "p", 0);
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

function createTextboxResult(container, skippable, clickable, boxClass, text)
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

window.sendResult = sendResult;
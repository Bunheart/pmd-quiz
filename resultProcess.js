var finalName;
var finalID;
var finalNature;

async function sendResult(result)
{
    await resultReassignment(result);

    console.log(finalName);
    console.log(finalNature);
    a = document.getElementById("results");
    a.innerHTML = "";

    script = await loadData("/data/script.json");

    natureScript = await script.filter(q => q.nature == finalNature);
    console.log("Nature Script");
    console.log(natureScript);
    console.log("Balls");
    for(const text of natureScript[0].dialogue)
    {
        createTextboxResult(a, true, false, "dialogue", text);
    }
    createTextbox(a, true, false, "dialogue", "Someone like you should be...", "p", 0);
    showImage(a);
    createTextboxResult(a, false, false, "dialogue", "A <span class=\"pokeName\">" + finalName + "</span>!", "p", 0);

}

async function resultReassignment(oldData)
{
    console.log("Data type");
    console.log(typeof oldData);
    console.log("Data");

    finalName = oldData[0].name;
    finalID =  oldData[0].id;
    finalNature = oldData[0].nature;
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

function showImage(container)
{
    imageBox = document.createElement("div");

    imageContent = document.createElement("img");
    imageContent.src = "/img/" + finalID + ".png";
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

window.sendResult = sendResult;
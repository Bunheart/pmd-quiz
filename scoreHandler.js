var natureScores = [];
var selSeason;
var typeBoost;
var gender;
var result;
var poipoleOverride = false;

async function getResult(scores, season, type, gen)
{
    let results = await loadData("data/results.json");
    
    assignValues(scores, season, type, gen);

    if (gender == "M")
    {
        await resultsSearch(results.male);
    }
    else if (gender == "F")
    {
        await resultsSearch(results.female);
    }
    else
    {
        poipoleOverride = true;
        await resultsSearch(results.female);
    }

    const normalisedResults = Array.isArray(result) ? result : [result];

    if (poipoleOverride)
    {
        normalisedResults[0].name = "Poipole";
        normalisedResults[0].id = "39"

    }
    return normalisedResults;

}

window.getResult = getResult;

function assignValues(scores, season, type, gen)
{
    natureScores = scores;
    selSeason = season;
    typeBoost = type;
    gender = gen;

}

// TODO: Test
async function resultsSearch(resultList)
{
    console.log(selSeason);
    const seasonalResults = resultList.filter(q => q.season == selSeason);

    natureRankings = naturePriority();

    let selectionFlat;
    let selected = false;
    let tieCount = 0;
    let filtered = [];

    while(!selected)
    {
        selectionFlat = null;
        selection = [];
        filtered = [];
        tieCount = tieCheck(natureRankings);

        for (i = 0; i < (tieCount + 1); i++)
        {
            filtered = seasonalResults.filter(q => q.nature == natureRankings[i].str);
            if (filtered.length > 0)
            {
                selection.push(filtered);
            }
        }

        selectionFlat = await objectToFlatArray(selection);
        console.log("Flattened");
        console.log(selectionFlat);
        
        if (selectionFlat == undefined || selectionFlat.length == 0)
        {
            a = natureRankings;
            b = tieCount + 1;
            natureRankings = [];
            for (j = 0; j < (a.length - (tieCount + 1)); j++)
            {
                natureRankings[j] = a[b];
                b++
            }
        }
        else if (selectionFlat.length > 1)
        {
            await tieBreakerNature(selectionFlat);
            selected = true;
        }
        else
        {
            result = selectionFlat;
            selected = true;
        }
    }

}

function naturePriority()
{
    let i = natureList.map((str, idx) => ({ str, num: natureScores[idx] }));

    i.sort((a, b) => b.num - a.num);

    return i;
}

// TODO change this to better support second best picks
function tieCheck(natureRankings)
{
    names = natureRankings.map(item => item.str);
    scores = natureRankings.map(item => item.num);
    let i = 0;

    let ties = 0;

    for (const nature of scores)
    {
        if (nature == scores[0])
        {
            ties++;
        }
        i++;
    }

    return ties;

}

async function tieBreakerNature(ties)
{
    typeFilter = ties.filter(q => q.type == typeBoost);

    if (typeFilter === undefined || typeFilter.length == 0)
        {
            tieBreakerResult(ties);
        }
        else if (typeFilter.length > 1)
        {
            tieBreakerResult(typeFilter);
        }
        else
        {
            result = typeFilter;
        }

}

function tieBreakerResult(ties)
{
    var a = Math.floor(Math.random() * (ties.length - 0));

    result = ties[a];

}

async function objectToFlatArray(object)
{
    let a = Array.from(object);

    console.log(a);
    console.log(typeof a);


    let b = a.flat();


    console.log(b);
    console.log(typeof b);

    return b;
}
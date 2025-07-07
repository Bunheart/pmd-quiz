// TODO: Means of getting the scores, default nature list order

const natures = ["Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Bold", "Docile", "Relaxed", "Impish", "Lax", "Timid", "Hasty", "Serious", "Jolly", "Naive", "Modest", "Mild", "Quiet", "Bashful", "Rash", "Calm", "Gentle", "Sassy", "Careful", "Quirky"]
var natureScores = [];
var selSeason;
var typeBoost;
var gender;
var result;
var poipoleOverride = false;
// var region; Potential alternate attribute

// TODO: Load in the results.json file
function getResult(scores, season, type, gen)
{

    assignValues(scores, season, type, gen);
    const results = require('./data/results.json');


    if (gender != "M" || "F")
    {
        poipoleOverride = true;
        resultsSearch(results.female)
    }
    else if (gender == M)
    {
        resultsSearch(results.male);
    }
    else
    {
        resultsSearch(results.female);
    }

    if (poipoleOverride)
    {
        result.name = "Poipole";
        result.id = "39"

    }
    return result;

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
function resultsSearch(resultList)
{
    const seasonalResults = resultList.filter(q => q.season == selSeason);

    natureRankings = naturePriority();

    var selected = false;

    while(!selected)
    {
        tieCount = tieCheck(natureRankings);
        selection = [];

        for (i = 0; i < (tieCount + 1); i++)
        {
            filtered = seasonalResults.filter(q => q.nature == natureRankings[i].text);
            if (filtered.length > 0)
            {
                selection.push(filtered);
            }
        }

        if (selection == undefined || selection.length == 0)
        {
            a = natureRankings;
            b = tiecount + 1;
            for (j = 0; j < (a.length - (tiecount + 1)); j++)
            {
                natureRankings[j] = a[b];
                b++
            }
        }
        else if (selection.length > 1)
        {
            tieBreakerNature(selection);
            selected = true;
        }
        else
        {
            result = selection;
            selected = true;
        }
    }

}

function naturePriority()
{
    var i = natures.map((str, idx) => ({ str, num: natureScores[idx] }));

    i.sort((a, b) => b.num - a.num);

    return i;
}

// TODO: Return an updated version of the array
function tieCheck(natureRankings)
{
    names = natureRankings.map(item => item.str);
    scores = natureRankings.map(item => item.num);
    i = 0;

    var ties = 0;

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

function tieBreakerNature(ties)
{
    typeFilter = ties.filter(q => q.type == typeBoost);

    if (typeFilter === undefined || typeFilter.length == 0)
        {

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
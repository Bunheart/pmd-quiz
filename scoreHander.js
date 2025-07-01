// TODO: Means of getting the scores, default nature list order

const natures = [];
var natureScores = [];
var selSeason;
var gender;
// var region; Potential alternate attribute

// TODO: Load in the results.json file
function getResult()
{
    if (gender != "M" || "F")
    {
        natureRankings = naturePriority();
        tieCheck(natureRankings);
        showResult("Poipole");
    }
    else if (gender == M)
    {
        resultsSearch(results.male);
    }
    else
    {
        resultsSearch(results.female);
    }

}

// TODO: Test
function resultsSearch(resultList)
{
    const seasonalResults = resultList.filter(q => q.season == selSeason);

    natureRankings = naturePriority();

    tieCheck(natureRankings);

    var selected = false;

    while(!selected)
    {
        for (const nature of natureRankings.text)
        {
            selection = seasonalResults.filter(q => q.nature == nature);

            if (selection === undefined || selection.length == 0)
            {

            }
            else if (selection.length > 1)
            {
                tieBreaker(selection);
            }
            else
            {
                sendResult(selection)
            }
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

    var ties = [];

    for (const nature of scores)
    {
        if (nature == scores[0])
        {
            ties.push(names[i]);
        }
        i++;
    }

    console.log(ties);

    if (ties.length > 1)
    {
        tieBreaker(ties);
    }
}

// TODO: Split into two separate functions, one for the nature tiebreaker (to rearrange the array further as needed and account for later ties) and the final selection
//  Code to pick between remaining options when all else fails
function tieBreaker(ties)
{
    var a = Math.floor(Math.random() * (ties.length - 0));

    //
}

// TODO: Make this whole feature
function sendResult(result)
{

}
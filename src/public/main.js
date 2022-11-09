const jour_url = 'https://api.sl.se/api2/LineData.json?model=jour&key=5da196d47f8f4e5facdb68d2e25b9eae&transportmode=1';
const stop_url = 'https://api.sl.se/api2/LineData.json?model=stop&key=dffee72342104a0494748bfdc3a818a1&transportmode=1';

async function getLinesWithUniqueJourneys() {
  //get all lines from jour_url
  const response = await fetch(jour_url);
  const data = await response.json();
  const lines = data.ResponseData.Result;

  //Line numbers without duplicates
  const lineNumbers = [];
  lines.map((line) => {
    return !lineNumbers.includes(line.LineNumber) ? lineNumbers.push(line.LineNumber) : null;
  });

  //bus lines with unique journey point pattern numbers
  const journeyPointPatternsPerLine = [];
  lineNumbers.map((lineNumber) => {
    const journeyPointPatterns = [];
    lines.map((line) => {
      if (lineNumber === line.LineNumber) {
        return !journeyPointPatterns.includes(line.JourneyPatternPointNumber) ? journeyPointPatterns.push(line.JourneyPatternPointNumber) : null;
      }
    });
    journeyPointPatternsPerLine.push({ lineNumber, journeyPointPatterns });
  });
  //console.log("journey point patterns per line: " + journeyPointPatternsPerLine.length);
  return journeyPointPatternsPerLine;
}

async function getBusStops() {
  //get bus stops
  const res = await fetch(stop_url);
  const stopData = await res.json();
  const busStops = stopData.ResponseData.Result;
  return busStops;
}

//get bus stops 
async function getTop10BusLineswithStopAreaNames() {
  const journeyPointPatternsPerLine = await getLinesWithUniqueJourneys();
  const busStops = await getBusStops();

  //Top 10 journey point pattern numbers with sorted order
  const top10JourneyPointPatterns = journeyPointPatternsPerLine.sort((a, b) => b.journeyPointPatterns.length - a.journeyPointPatterns.length).slice(0, 10);

  //top 10 journey point pattern numbers with busStopAreaNames
  const top10JourneyPointsWithBusStopAreaNames = [];
  top10JourneyPointPatterns.map((top10JourneyPointPattern) => {
    const busStopAreaNames = [];
    busStops.map((busStop) => {
      if (top10JourneyPointPattern.journeyPointPatterns.includes(busStop.StopPointNumber)) {
        return !busStopAreaNames.includes(busStop.StopPointName) ? busStopAreaNames.push(busStop.StopPointName) : null;
      }
    });
    top10JourneyPointsWithBusStopAreaNames.push({ lineNumber: top10JourneyPointPattern.lineNumber, journeyPointPatterns: top10JourneyPointPattern.journeyPointPatterns, busStopAreaNames });
  });
  return top10JourneyPointsWithBusStopAreaNames;

}

async function displayTop10BusLineswithStopAreaNames() {

  const top10JourneyPointsWithBusStopAreaNames = await getTop10BusLineswithStopAreaNames();

  //create bootstrap collapsible area with cards for each bus line
  const collapsibleArea = document.getElementById("collapsibleArea");
  top10JourneyPointsWithBusStopAreaNames.map((top10JourneyPointPatternWithBusStopAreaName) => {
    const card = document.createElement("div");
    card.className = "card";
    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
    cardHeader.setAttribute("id", "heading" + top10JourneyPointPatternWithBusStopAreaName.lineNumber);
    cardHeader.id = "heading" + top10JourneyPointPatternWithBusStopAreaName.lineNumber;
    const button = document.createElement("button");
    button.className = "btn btn-link";
    button.type = "button";
    button.setAttribute("data-toggle", "collapse");
    button.setAttribute("data-target", "#collapse" + top10JourneyPointPatternWithBusStopAreaName.lineNumber);
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", "collapse" + top10JourneyPointPatternWithBusStopAreaName.lineNumber);
    button.innerHTML = "Line Num " + top10JourneyPointPatternWithBusStopAreaName.lineNumber + " - " + "Total Stops " + top10JourneyPointPatternWithBusStopAreaName.journeyPointPatterns.length;
    cardHeader.appendChild(button);
    card.appendChild(cardHeader);
    card.style.borderRadius = "30px";
    const collapse = document.createElement("div");
    collapse.id = "collapse" + top10JourneyPointPatternWithBusStopAreaName.lineNumber;
    collapse.className = "collapse";
    collapse.setAttribute("aria-labelledby", "heading" + top10JourneyPointPatternWithBusStopAreaName.lineNumber);
    collapse.setAttribute("data-parent", "#collapsibleArea");
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    cardBody.innerHTML = top10JourneyPointPatternWithBusStopAreaName.busStopAreaNames;
    collapse.appendChild(cardBody);
    card.appendChild(collapse);
    collapsibleArea.appendChild(card);
  });
}

displayTop10BusLineswithStopAreaNames();




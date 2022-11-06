const jour_url = 'https://api.sl.se/api2/LineData.json?model=jour&key=6a32ac34d172409a8c42ed14b16d3b09&transportmode=1';
const stop_url = 'https://api.sl.se/api2/LineData.json?model=stop&key=6a32ac34d172409a8c42ed14b16d3b09&transportmode=1';


//get bus lines with unique journey point pattern numbers
async function getBusLines() {
    const response = await fetch(jour_url);
    const data = await response.json();
    const lines = data.ResponseData.Result;

    //line numbers without duplicates
    const lineNumbers = [];
    lines.map((line) => {
        return !lineNumbers.includes(line.LineNumber) ? lineNumbers.push(line.LineNumber) : null;
    });

   // console.log("line numbers without duplicates: " + lineNumbers.length);
    
    //journey point pattern numbers for each line using map
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

    //console.log("journey point pattern numbers for each line using map: " + journeyPointPatternsPerLine.length);

    //Top 10 journey point pattern numbers with sorted order
    const top10JourneyPointPatterns = journeyPointPatternsPerLine.sort((a, b) => b.journeyPointPatterns.length - a.journeyPointPatterns.length).slice(0, 10);
   // console.log("Top 10 journey point pattern numbers with sorted order: " + top10JourneyPointPatterns.length);

    //print top 10 journey point pattern numbers with sorted order
    top10JourneyPointPatterns.map((top10JourneyPointPattern) => {
        //console.log("line number: " + top10JourneyPointPattern.lineNumber);
        //console.log("journey point pattern numbers: " + top10JourneyPointPattern.journeyPointPatterns);
        //console.log("journey point pattern numbers: " + top10JourneyPointPattern.journeyPointPatterns.length);
    });

    // display top 10 bus line numbers and journey point pattern numbers in html in the existing table
    const table = document.getElementById("table");
    for (let i = 0; i < top10JourneyPointPatterns.length; i++) {
        const row = table.insertRow(i + 1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.innerHTML = top10JourneyPointPatterns[i].lineNumber;
        cell2.innerHTML = top10JourneyPointPatterns[i].journeyPointPatterns.length;
    }
   
    //get bus stops

    const res = await fetch(stop_url);
    const stopData = await res.json();
    const busStops = stopData.ResponseData.Result;

    //top 10 journey point pattern numbers with busStopAreaName
    const top10JourneyPointPatternsWithBusStopAreaName = [];
    top10JourneyPointPatterns.map((top10JourneyPointPattern) => {
        const busStopAreaNames = [];
        busStops.map((busStop) => {
            if (top10JourneyPointPattern.journeyPointPatterns.includes(busStop.StopPointNumber)) {
                return !busStopAreaNames.includes(busStop.StopPointName) ? busStopAreaNames.push(busStop.StopPointName) : null;
            }
        });
        top10JourneyPointPatternsWithBusStopAreaName.push({ lineNumber: top10JourneyPointPattern.lineNumber, journeyPointPatterns: top10JourneyPointPattern.journeyPointPatterns, busStopAreaNames });
    }
    );

    //print top 10 journey point pattern numbers with busStopAreaName
    top10JourneyPointPatternsWithBusStopAreaName.map((top10JourneyPointPatternWithBusStopAreaName) => {
        console.log("line number: " + top10JourneyPointPatternWithBusStopAreaName.lineNumber);
       // console.log("journey point pattern numbers: " + top10JourneyPointPatternWithBusStopAreaName.journeyPointPatterns);
        console.log("bus stop area names: " + top10JourneyPointPatternWithBusStopAreaName.busStopAreaNames);
    }
    );

    // display top 10 bus line numbers and bus stop area names in html in beautified way
    const table1 = document.getElementById("table1");
    for (let i = 0; i < top10JourneyPointPatternsWithBusStopAreaName.length; i++) {
        const row = table1.insertRow(i + 1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.innerHTML = top10JourneyPointPatternsWithBusStopAreaName[i].lineNumber;
        cell2.innerHTML = top10JourneyPointPatternsWithBusStopAreaName[i].busStopAreaNames;
    }
    


}




getBusLines();



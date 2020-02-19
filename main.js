google.charts.load( 'current', { 'packages': [ 'line','corechart' ] } )
google.charts.setOnLoadCallback( main )

function bmicalc( weight, height ){
    console.log( 'BMI Calc Function Start' )
    console.log( `BMI calculation:`, ( 703 * weight / Math.pow( height, 2 ) ) )
    return ( 703 * weight / Math.pow( height, 2 ) )
}

function dayString( index ){
    console.log( 'Day String Function Start' )

    return `Day ${ index + 1 }`
}

function pushToArray( arr, index, weight, height ){
    console.log( 'Push to array Function Start' )

    //push an array of [ "Day 1", 24.1 ] to arr
    arr.push( [ dayString( index ), bmicalc( weight, height ) ] ) 
    console.log( `Pust to array function updated array:`, arr )

}

function arrayForDataTable( chart_data ){
    console.log( 'Array for data table Function Start' )

    // array of arrays for google api thing
    // index 0 is chart data titles
    let d = [ chart_data.columns ]


    // use array.map function to push [ day, BMI ] arrays into d
    //BMI = 703 x weight (lbs) / [height (in)]^2 (correct way)
    chart_data.data.days.map( ( weight, index ) => pushToArray( d, index, weight, chart_data.data.height ) )

    return d
}

function intro( div_obj ){

    console.log( 'Intro Function Start' )

    let introPrompt = `<div class="promptdiv" id="intro-prompt">
                            <h1>BMI Tracker</h1>
                            <p>Please enter your name, height, and initial weight</p>
                            <input placeholder="your name" type="text" id="username" />
                            <input placeholder="height in inches" type="number" id="height" />
                            <input placeholder="weight in lbs" type="number" id="weight" />
                            <div onclick="generateGraph( promptCallback( false ) )" class="submit-button">Submit</div>
                        </div>`

    div_obj.curve_chart_div.innerHTML = ""
    div_obj.area_chart_div.innerHTML = ""
    div_obj.line_chart_div.innerHTML = ""
    div_obj.stepped_chart_div.innerHTML = ""
    
    div_obj.curve_chart_div.className += " displaynone"
    div_obj.area_chart_div.className += " displaynone"
    div_obj.line_chart_div.className += " displaynone"
    div_obj.stepped_chart_div.className += " displaynone"

    div_obj.prompt_div.innerHTML = introPrompt

}

function update( div_obj ){
    console.log( 'Update Function Start' )

    console.log( `localStorage.getItem JTSBMI:`, JSON.parse( localStorage.getItem( 'JTSBMI' ) ) )

    let updatePrompt = `<div class="promptdiv" id="update-prompt">
                            <h1>BMI Tracker Daily Update</h1>
                            <p>How fat are you today?</p>
                            <input placeholder="weight in lbs" type="number" id="weight" />
                            <div onclick="generateGraph( promptCallback( true ) )" class="submit-button">Submit</div>
                        </div>`

    div_obj.curve_chart_div.innerHTML = ""
    div_obj.area_chart_div.innerHTML = ""
    div_obj.line_chart_div.innerHTML = ""
    div_obj.stepped_chart_div.innerHTML = ""

    div_obj.curve_chart_div.className += " displaynone"
    div_obj.area_chart_div.className += " displaynone"
    div_obj.line_chart_div.className += " displaynone"
    div_obj.stepped_chart_div.className += " displaynone"

    div_obj.prompt_div.innerHTML = updatePrompt

}

function update_two( div_obj ){
    console.log( 'Update Function Start' )

    console.log( `localStorage.getItem JTSBMI:`, JSON.parse( localStorage.getItem( 'JTSBMI' ) ) )

    let updatePrompt = `<div class="promptdiv" id="update-prompt">
                            <h1>BMI Tracker Daily Update</h1>
                            <p>Add more daily weights</p>
                            <input placeholder="weight in lbs" type="number" id="weight" />
                            <div onclick="generateGraph( promptCallback( true ) )" class="submit-button">Submit</div>
                        </div>`

    div_obj.prompt_div.innerHTML = updatePrompt

}

function promptCallback( isUpdateFunc ){

    console.log( 'submit-button clicked' )

    //lso = local storage object
    let lso = isUpdateFunc ? JSON.parse( localStorage.getItem( 'JTSBMI' ) ) : { "name": document.getElementById( "username" ).value, "height": document.getElementById( "height" ).value, "days": [ ] }

    document.getElementById( "weight" ).value.length == 0 ? false : lso.days.push( document.getElementById( "weight" ).value )

    localStorage.setItem( 'JTSBMI',  JSON.stringify( lso ) )

    console.log( `lso:`, lso )
    console.log( `localStorage:`, JSON.parse( localStorage.getItem( 'JTSBMI' ) ) )

    return lso
}

function generateGraph( prompt_callback_data ){

    console.log( 'generateGraph Function Start' )
    console.log( `prompt_callback_data: `, prompt_callback_data )

    let div_obj = {
        prompt_div: document.getElementById( "prompt_div" ),
        curve_chart_div: document.getElementById( "curve_chart" ),
        line_chart_div: document.getElementById( "line_chart" ),
        area_chart_div: document.getElementById( "area_chart" ),
        stepped_chart_div: document.getElementById( "stepped_chart" )
    }
    
    div_obj.curve_chart_div.className = "divclass"
    div_obj.area_chart_div.className = "divclass"
    div_obj.line_chart_div.className = "divclass"
    div_obj.stepped_chart_div.className = "divclass"
    div_obj.prompt_div.className = "divclass"

    div_obj.prompt_div.innerHTML = `<div class="promptdiv" id="update-prompt">
                                        <h1>BMI Progress Chart for ${ prompt_callback_data.name }</h1>
                                        <div onclick='update_two( {
                                            prompt_div: document.getElementById( "prompt_div" ),
                                            curve_chart_div: document.getElementById( "curve_chart" ),
                                            line_chart_div: document.getElementById( "line_chart" ),
                                            area_chart_div: document.getElementById( "area_chart" ),
                                            stepped_chart_div: document.getElementById( "stepped_chart" )
                                        } )' class="submit-button">Add another day's weight</div>
                                        <div onclick='intro( {
                                            prompt_div: document.getElementById( "prompt_div" ),
                                            curve_chart_div: document.getElementById( "curve_chart" ),
                                            line_chart_div: document.getElementById( "line_chart" ),
                                            area_chart_div: document.getElementById( "area_chart" ),
                                            stepped_chart_div: document.getElementById( "stepped_chart" )
                                        } )' class="submit-button">Clear data and start over</div>
                                    </div>`

    let chart_data = {
        columns: [ 'Day', 'BMI' ],
        data:  prompt_callback_data
    }

    let data = google.visualization.arrayToDataTable( arrayForDataTable( chart_data ) )

    let options1 = {
        title: 'BMI Tracker',
        vAxis: {title: 'Calculated BMI'},
        curveType: 'function',
        legend: { position: 'bottom' },
        animation: {"startup": true},
        width: 900,
        height: 500
    }
    let options2 = {
        title: 'BMI Tracker',
        vAxis: {title: 'Calculated BMI'},
        animation: {"startup": true},
        legend: { position: 'bottom' },
        width: 900,
        height: 500
    }
    let options3 = {
        title: 'BMI Tracker',
        vAxis: {title: 'Calculated BMI'},
        animation: {"startup": true},
        legend: { position: 'bottom' },
        width: 900,
        height: 500
    }
    let options4 = {
        title: 'BMI Tracker',
        vAxis: {title: 'Calculated BMI'},
        animation: {"duration": 500, "easing": "inAndOut"},
        legend: { position: 'bottom' },
        width: 900,
        height: 500
    }
    let chart1 = new google.visualization.LineChart( document.getElementById( 'curve_chart' ) )
    let chart2 = new google.charts.Line( document.getElementById( 'line_chart' ) )
    let chart3 = new google.visualization.AreaChart( document.getElementById( 'area_chart' ) )
    let chart4 = new google.visualization.SteppedAreaChart( document.getElementById( 'stepped_chart' ) )
    
    chart1.draw( data, options1 )
    chart2.draw( data, google.charts.Line.convertOptions( options2 ) )
    chart3.draw( data, options3 )
    chart4.draw( data, options4 )
}

function drawChart( chartdata ) {
  // Disabling the buttons while the chart is drawing.
  addButton.disabled = true
  removeButton.disabled = true
  google.visualization.events.addListener(chart, 'ready',
      function() {
        // Enabling only relevant buttons.
        addButton.disabled = (data.getNumberOfColumns() - 1) >= chars.length
        removeButton.disabled = (data.getNumberOfColumns() - 1) < 2
      })
  chart.draw(data, options)
}

function main( ) {
    console.log( 'Main Function Start' )
    let div_obj = {
        prompt_div: document.getElementById( "prompt_div" ),
        curve_chart_div: document.getElementById( "curve_chart" ),
        line_chart_div: document.getElementById( "line_chart" ),
        area_chart_div: document.getElementById( "area_chart" ),
        stepped_chart_div: document.getElementById( "stepped_chart" )
    }
    console.log( `div_obj`, div_obj )
    
    localStorage.getItem( "JTSBMI" ) !== null && typeof JSON.parse( localStorage.getItem( "JTSBMI" ) ) === "object" ? update( div_obj ) : intro( div_obj )

}

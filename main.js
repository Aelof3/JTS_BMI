google.charts.load('current', { 'packages': ['corechart'] })
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

    div_obj.chart_div.innerHTML = ""
    div_obj.chart_div.className += " displaynone"
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

    div_obj.chart_div.innerHTML = ""
    div_obj.chart_div.className += " displaynone"

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
        chart_div: document.getElementById( "curve_chart" )
    }

    div_obj.chart_div.innerHTML = ""
    div_obj.chart_div.className = "divclass"
    div_obj.prompt_div.className = "divclass"

    div_obj.prompt_div.innerHTML = `<div class="promptdiv" id="update-prompt">
                                        <div onclick="main( )" class="submit-button">Add another day's weight</div>
                                    </div>`

    let chart_data = {
        columns: [ 'Day', 'BMI' ],
        data:  prompt_callback_data
    }

    let data = google.visualization.arrayToDataTable( arrayForDataTable( chart_data ) )

    let options = {
        title: 'BMI Tracker',
        curveType: 'function',
        legend: { position: 'bottom' },
        width: 900,
        height: 500
    }

    let chart = new google.visualization.LineChart( document.getElementById( 'curve_chart' ) )

    chart.draw( data, options )
}

function main( ) {
    console.log( 'Main Function Start' )
    let div_obj = {
        prompt_div: document.getElementById( "prompt_div" ),
        chart_div: document.getElementById( "curve_chart" )
    }
    console.log( `div_obj`, div_obj )
    
    localStorage.getItem( "JTSBMI" ) !== null && typeof JSON.parse( localStorage.getItem( "JTSBMI" ) ) === "object" ? update( div_obj ) : intro( div_obj )

}

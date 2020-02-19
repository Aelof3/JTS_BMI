google.charts.load( 'current', { 'packages': [ 'line','corechart' ] } )
google.charts.setOnLoadCallback( main )

class PAINTBMI{
    constructor( ){
        
        this.div_obj = {
            charts: {
                curve_chart_div: document.getElementById( "curve_chart" ),
                line_chart_div: document.getElementById( "line_chart" ),
                area_chart_div: document.getElementById( "area_chart" ),
                stepped_chart_div: document.getElementById( "stepped_chart" )
            },
            prompt_div: document.getElementById( "prompt_div" )
        }
        this.chart_data = {
            columns: [ 'Day', 'BMI' ],
        }
        this.options = {
            options1: {
                title: 'BMI Tracker',
                vAxis: {title: 'Calculated BMI'},
                curveType: 'function',
                legend: { position: 'bottom' },
                animation: {"duration": 500, "easing": "inAndOut"},
                width: 600,
                height: 320
            },
            options2: {
                title: 'BMI Tracker',
                vAxis: {title: 'Calculated BMI'},
                animation: {"duration": 500, "easing": "inAndOut"},
                legend: { position: 'bottom' },
                width: 600,
                height: 320
            }, 
            options3: {
                title: 'BMI Tracker',
                vAxis: {title: 'Calculated BMI'},
                animation: {"duration": 500, "easing": "inAndOut"},
                legend: { position: 'bottom' },
                width: 600,
                height: 320
            },
            options4: {
                title: 'BMI Tracker',
                vAxis: {title: 'Calculated BMI'},
                animation: {"duration": 500, "easing": "inAndOut"},
                legend: { position: 'bottom' },
                width: 600,
                height: 320
            }
        }
        
        this.div_obj.prompt_weight_input = this.htmlToElement( `<input placeholder="weight in lbs" type="number" id="weight" />` )
        this.div_obj.prompt_height_input = this.htmlToElement( `<input placeholder="height in inches" type="number" id="height" />` )
        this.div_obj.prompt_name_input = this.htmlToElement( `<input placeholder="your name" type="text" id="username" />` )

        console.log( 'Main Function Start' )
        
        console.log( `div_obj`, this.div_obj )
        
        localStorage.getItem( "JTSBMI" ) !== null && typeof JSON.parse( localStorage.getItem( "JTSBMI" ) ) === "object" ? this.update( ) : this.intro( )

    }

    htmlToElement( html ) {
        let template = document.createElement('template')
        html = html.trim() // Never return a text node of whitespace as the result
        template.innerHTML = html
        return template.content.firstChild
    }

    bmicalc( weight, height ){
        console.log( 'BMI Calc Function Start' )
        console.log( `BMI calculation:`, ( 703 * weight / Math.pow( height, 2 ) ) )
        return ( 703 * weight / Math.pow( height, 2 ) )
    }

    dayString( index ){
        console.log( 'Day String Function Start' )

        return `Day ${ index + 1 }`
    }

    pushToArray( arr, index, weight, height ){
        console.log( 'Push to array Function Start' )
        let self = this
        //push an array of [ "Day 1", 24.1 ] to arr
        arr.push( [ self.dayString( index ), self.bmicalc( weight, height ) ] ) 
        console.log( `Push to array function updated array:`, arr )

    }

    arrayForDataTable( chart_data ){
        console.log( 'Array for data table Function Start' )
        let self = this
        // array of arrays for google api thing
        // index 0 is chart data titles
        let d = [ chart_data.columns ]


        // use array.map function to push [ day, BMI ] arrays into d
        //BMI = 703 x weight (lbs) / [height (in)]^2 (correct way)
        chart_data.data.days.map( ( weight, index ) => self.pushToArray( d, index, weight, chart_data.data.height ) )

        return d
    }

    intro( ){
        
        this.chart1 = new google.visualization.LineChart( document.getElementById( 'curve_chart' ) )
        this.chart2 = new google.charts.Line( document.getElementById( 'line_chart' ) )
        this.chart3 = new google.visualization.AreaChart( document.getElementById( 'area_chart' ) )
        this.chart4 = new google.visualization.SteppedAreaChart( document.getElementById( 'stepped_chart' ) )
        
        console.log( 'Intro Function Start' )
        let self = this
        this.div_obj.intro_prompt = self.htmlToElement( `<div class="promptdiv" id="intro-prompt">
                                <h1>BMI Tracker</h1>
                                <p>Please enter your name, height, and initial weight</p>
                            </div>` )

        this.div_obj.intro_div_click = self.htmlToElement( `<div class="submit-button">Submit</div>` )

        this.div_obj.intro_div_click.onclick = () => self.generateGraph( self.promptCallback( false ) )
        this.div_obj.intro_prompt.appendChild( self.div_obj.prompt_name_input )
        this.div_obj.intro_prompt.appendChild( self.div_obj.prompt_height_input )
        this.div_obj.intro_prompt.appendChild( self.div_obj.prompt_weight_input )

        this.div_obj.intro_prompt.appendChild( self.div_obj.intro_div_click )

        this.div_obj.charts.curve_chart_div.innerHTML = ""
        this.div_obj.charts.area_chart_div.innerHTML = ""
        this.div_obj.charts.line_chart_div.innerHTML = ""
        this.div_obj.charts.stepped_chart_div.innerHTML = ""
        
        this.div_obj.charts.curve_chart_div.className = "divclass displaynone"
        this.div_obj.charts.area_chart_div.className = "divclass displaynone"
        this.div_obj.charts.line_chart_div.className = "divclass displaynone"
        this.div_obj.charts.stepped_chart_div.className = "divclass displaynone"

        this.div_obj.prompt_div.innerHTML = ""
        this.div_obj.prompt_div.appendChild( self.div_obj.intro_prompt )
    }

    update( ){
        console.log( 'Update Function Start' )
        let self = this
        console.log( `localStorage.getItem JTSBMI:`, JSON.parse( localStorage.getItem( 'JTSBMI' ) ) )

        this.div_obj.update_prompt = self.htmlToElement( `<div class="promptdiv" id="update-prompt">
                                                            <h1>BMI Tracker Daily Update</h1>
                                                            <p>How much do you weigh today?</p>
                                                        </div>` )

        this.div_obj.update_div_click = self.htmlToElement( `<div class="submit-button">Submit</div>` )

        this.div_obj.update_div_click.onclick = () => self.generateGraph( self.promptCallback( true ) )
        this.div_obj.update_prompt.appendChild( self.div_obj.prompt_weight_input )

        this.div_obj.update_prompt.appendChild( self.div_obj.update_div_click )

        this.div_obj.charts.curve_chart_div.innerHTML = ""
        this.div_obj.charts.area_chart_div.innerHTML = ""
        this.div_obj.charts.line_chart_div.innerHTML = ""
        this.div_obj.charts.stepped_chart_div.innerHTML = ""

        this.div_obj.charts.curve_chart_div.className = "divclass displaynone"
        this.div_obj.charts.area_chart_div.className = "divclass displaynone"
        this.div_obj.charts.line_chart_div.className = "divclass displaynone"
        this.div_obj.charts.stepped_chart_div.className = "divclass displaynone"

        this.div_obj.prompt_div.innerHTML = ""
        this.div_obj.prompt_div.appendChild( self.div_obj.update_prompt )

    }

    update_two( ){
        console.log( 'Update Function Two Start' )
        let self = this
        console.log( `localStorage.getItem JTSBMI:`, JSON.parse( localStorage.getItem( 'JTSBMI' ) ) )

        this.div_obj.update_prompt_two = self.htmlToElement( `<div class="promptdiv" id="update-prompt">
                                                            <h1>BMI Tracker Daily Update</h1>
                                                            <p>Add more daily weights</p>
                                                        </div>` )

        this.div_obj.update_two_div_click = self.htmlToElement( `<div class="submit-button">Submit</div>` )
        this.div_obj.update_two_div_click.onclick = () => self.generateGraph( self.promptCallback( true ) )

        this.div_obj.update_prompt_two.appendChild( self.div_obj.prompt_weight_input )
        this.div_obj.update_prompt_two.appendChild( self.div_obj.update_two_div_click )

        this.div_obj.prompt_div.innerHTML = ""
        this.div_obj.prompt_div.appendChild( self.div_obj.update_prompt_two )
    }

    promptCallback( isUpdateFunc ){

        console.log( 'submit-button clicked' )
        let self = this
        //lso = local storage object
        let lso = isUpdateFunc ? JSON.parse( localStorage.getItem( 'JTSBMI' ) ) : { "name": self.div_obj.prompt_name_input.value, "height": self.div_obj.prompt_height_input.value, "days": [ ] }

        this.div_obj.prompt_weight_input.value.length == 0 ? false : lso.days.push( self.div_obj.prompt_weight_input.value )

        localStorage.setItem( 'JTSBMI',  JSON.stringify( lso ) )

        console.log( `lso:`, lso )
        console.log( `localStorage:`, JSON.parse( localStorage.getItem( 'JTSBMI' ) ) )

        return lso
    }

    generateGraph( prompt_callback_data ){

        console.log( 'generateGraph Function Start' )
        console.log( `prompt_callback_data: `, prompt_callback_data )
        let self = this

        this.div_obj.charts.curve_chart_div.className = "divclass"
        this.div_obj.charts.area_chart_div.className = "divclass"
        this.div_obj.charts.line_chart_div.className = "divclass"
        this.div_obj.charts.stepped_chart_div.className = "divclass"
        this.div_obj.prompt_div.className = "divclass"

        this.div_obj.add_weight = self.htmlToElement( `<div id="add_weight" class="submit-button">Add another day's weight</div>` )
        this.div_obj.add_weight.onclick = () => self.update_two( )
        this.div_obj.clear_data = self.htmlToElement( `<div id="clear_data" class="submit-button">Clear data and start over</div>` )
        this.div_obj.clear_data.onclick = () => self.intro( )

        this.div_obj.prompt_div.innerHTML = ""
        let tempdiv = self.htmlToElement( `<div class="promptdiv" id="update-prompt">
                                            <h1>BMI Progress Chart for ${ prompt_callback_data.name }</h1>
                                        </div>` )
        tempdiv.appendChild( self.div_obj.add_weight )
        tempdiv.appendChild( self.div_obj.clear_data )
        this.div_obj.prompt_div.appendChild( tempdiv )

        this.chart_data.data = prompt_callback_data

        this.datatable = google.visualization.arrayToDataTable( self.arrayForDataTable( self.chart_data ) )

        
        this.chart1.draw( self.datatable, self.options.options1 )
        this.chart2.draw( self.datatable, google.charts.Line.convertOptions( self.options.options2 ) )
        this.chart3.draw( self.datatable, self.options.options3 )
        this.chart4.draw( self.datatable, self.options.options4 )
    }

}


function main( ){
    let p = new PAINTBMI( )
}

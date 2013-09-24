/**
 * User: haksudol
 * Date: 9/22/13
 * Time: 4:20 PM
 * To change this template use File | Settings | File Templates.
 */

var anbado = window.anbado || {};



var timeline;

var data = [

]

    var temp;



// Called when the Visualization API is loaded.
function drawTimelineVisualization() {

    console.log("in draw");
    // Create a JSON data table

    // specify options
    var options = {

        'width': '80%',
        'height': '400px',
        'editable': false,   // enable dragging and editing events
        'style': 'box',
        'start': new Date(CLIENTVAR.pageGenerationTime.getTime()),
        'end': new Date(CLIENTVAR.pageGenerationTime.getTime() + CLIENTVAR.popcornobj.duration()*1000), // 밀리세컨드 단위이므로 1000을 곱함
//        'scale': links.Timeline.StepDate.SCALE.SECOND,
//        'step' : 1000,
//        'zoomable' : false,
        'showCurrentTime' : false,

//        'stackEvents' : 'true',
        'min' : new Date(CLIENTVAR.pageGenerationTime.getTime()),
        'max' : new Date(CLIENTVAR.pageGenerationTime.getTime() + CLIENTVAR.popcornobj.duration()*1000), // 밀리세컨드 단위이므로 1000을 곱함
        'showMinorLabels' : false,
        'showMajorLabels' : false
    };


    // Instantiate our timeline object.
    timeline = new links.Timeline(document.getElementById('mytimeline'));

    // attach an event listener using the links events handler
//    links.events.addListener(timeline, 'rangechanged', onRangeChanged);

    // Draw our timeline with the created data and options
    timeline.draw(data, options);

}


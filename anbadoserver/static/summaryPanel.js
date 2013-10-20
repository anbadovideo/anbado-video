"use strict";
/**
 * User: haksudol
 * Date: 9/22/13
 * Time: 4:20 PM
 */

var anbado = window.anbado || {};


var timeline;

var data = [
];


// Called when the Visualization API is loaded.

/**
 * 플레이어 페이지 밑의 드로잉 페이지를 그리는 함수. 전반적인 설정값을 결정한다.
 *
 */

function drawTimelineVisualization() {

    console.log("in draw");
    // Create a JSON data table

    // specify options
    var options = {

        'width': '640px',
        'height': '400px',
        'editable': true,   // enable dragging and editing events
        'style': 'box',
        'start': new Date(CLIENTVAR.pageGenerationTime.getTime()),
        'end': new Date(CLIENTVAR.pageGenerationTime.getTime() + CLIENTVAR.popcornobj.duration() * 1000), // 밀리세컨드 단위이므로 1000을 곱함
//        'scale': links.Timeline.StepDate.SCALE.SECOND,
//        'step' : 1000,
        'zoomable': true,
        'showCurrentTime': false,
        'showCustomTime' : true,



//        'stackEvents' : 'true',
        'min': new Date(CLIENTVAR.pageGenerationTime.getTime() - 1000*CLIENTVAR.popcornobj.duration()/10),
        'max': new Date(CLIENTVAR.pageGenerationTime.getTime() + CLIENTVAR.popcornobj.duration() * 1000), // 밀리세컨드 단위이므로 1000을 곱함
        'showMinorLabels': false,
        'showMajorLabels': false
    };


    // Instantiate our timeline object.
    timeline = new links.Timeline(document.getElementById('mytimeline'));

    // attach an event listener using the links events handler
//    links.events.addListener(timeline, 'rangechanged', onRangeChanged);

    // Draw our timeline with the created data and options
    timeline.draw(data, options);

}


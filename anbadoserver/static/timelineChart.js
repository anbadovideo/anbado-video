/**
 * Created with JetBrains WebStorm.
 * User: mijong
 * Date: 13. 8. 22.
 * Time: 오후 3:01
 * To change this template use File | Settings | File Templates.
 */


/**
 *
 * @param evt
 * 타임라인 마우스 클릭할경우
 */

function timeLineCover(evt){



    //if(CLIENTVAR.popcornobj.paused()==true)
    //{

//if(testObj.test==0){
    var offsetLeft=$('#rect2').offset().left;
    var offsetWidth=document.getElementById("rect2");
    //console.log(offsetLeft);

    // alert("x:"+(evt.clientX-398));}// 여기 동영상 left 값을 offset 값으로 수정해줘야함


    var currentTime =(evt.clientX-offsetLeft);
    var timeLineWidth=offsetWidth.width.baseVal.value;

    var perTime = CLIENTVAR.popcornobj.duration();
    perTime=(perTime/timeLineWidth);

         CLIENTVAR.popcornobj.currentTime(perTime*currentTime);

        //CLIENTVAR.popcornobj.play();
//testObj.test++;
//}
    //}


        //testObj.currentTime=perTime*currentTime;
        //CLIENTVAR.popcornobj.play();
        //testObj.currentTime=perTime*currentTime;


//    CLIENTVAR.popcornobj.pause(perTime*currentTime);
//
//
//    setTimeout(function(){
//        CLIENTVAR.popcornobj.play();
//    },3000);
//
    //CLIENTVAR.popcornobj.currentTime(perTime*currentTime);
    //CLIENTVAR.popcornobj.play(perTime*currentTime);
}

/**
 *
 * @param evt
 * 타임라인 에 마우스가 올라갔을 경우
 */
function mooseOnCover(evt)
{
    var offsetLeft=$('#rect2').offset().left;

    // var offsetWidth=document.getElementById("rect2");
    var offsetBarWidth=$('.nv-bar.positive.nv-bar-0-1').offset().left-$('.nv-bar.positive.nv-bar-0-0').offset().left;


    var currentTime =(evt.clientX-offsetLeft);


    var barName='.nv-bar.positive.nv-bar-0-'+parseInt(currentTime/offsetBarWidth);
    //var timeLineWidth=offsetWidth.width.baseVal.value;

    //var perTime = CLIENTVAR.popcornobj.duration();
    //perTime=(perTime/timeLineWidth);
    testObj.positionId.setAttribute('r',5);

    testObj.positionId.setAttribute('cy',90-($(barName)[0].height.baseVal.value));
    testObj.positionId.setAttribute('cx',currentTime+70);
    // console.log('evt:'+evt.clientX);
    //console.log('evt:'+parseInt(currentTime/offsetBarWidth));
    //console.log('evt:'+(90-($(barName)[0].height.baseVal.value)));

}


/**
 *
 * @param evt
 * 마우스가 커버 밖으로 나갔을 경우
 */
function mouseOutCover(evt)
{

    testObj.positionId.setAttribute('r',0);

}

/**
 * 안바도 타임라인과 width 를 동기화할 html id 를 가져와서 객체를 생성한다.
 * @class
 * @param getId
 * html  id 를 가져온다.
 *
 * @example var test=anbadoTimeLine('player');
 */

var anbadoTimeLine = function(getId) {


    this.test=0
    /**
     * getid  로 동영상 플레이어의 width 와 height 의 길이를 불러와서
     * 타임라인에 적용시킨다.
     * @type {string}
     */

    this.videoId = "#" + getId;
    /**
     * 타임라인 그래프의 종류를 나타낸다.
     *
     *  1: Stacked Area Chart
     *  2: Line Chart
     *  3: Pie Chart
     *  4: Half Pie Chart
     *
     * @type {number}
     */
    this.graphShape = 1;

    /**
     * Good 버튼을 누른 타임라인 데이터
     *
     * @type {Array}
     */
    this.goodData = [];

    /**
     * Bad 버튼을 누른 타임라인 데이터
     *
     * @type {Array}
     */
    this.badData = [];

    this.dummData = [];

    /**
     *
     * @type {number}
     * 커버 아이디를 저장함
     */
    this.coverId=0;
    /**
     *
     * @type {number}
     * 백그라운드 커버아이디
     */
    this.backcoverId=0;
    /**
     *
     * @type {number}
     * 포인트 아이디
     */
    this.positionId=0;
    this.imageId=0;

    /**
     * 현재시간을 받아들인다.
     * @type {number}
     */
    this.currentTime = 0;
    /**
     * 동영상을 총 시간을 받아들인다.
     * @type {number}
     */
    this.durationTime = 0;
    /**
     * 타임을 커팅하기위한 더미값 추후 수정 필요
     * @type {number}
     */
    this.dummy=0;


    /**
     * jquery id 받기
     * jauery 의 사용을 줄이기 위해서 한번 쓰고 이후에
     * this 에서 받아서 처리한다.
     */

    this.areajQueryId=0;
    this.linejQueryId=0;
    this.pijQueryId=0;
    this.halfjQueryId=0;
    this.barjQueryId=0;

    this.$areaDom=0;
    this.$lineDom=0;
    this.$pieDom=0;
    this.$halfDom=0;
    this.$barDom=0;

}




// anbadoTimeLine.prototype.timeLineCover = function(evt)
//{
//
//            var offsetLeft=$('#rect2').offset().left;
//
//
//        var currentTime =(evt.clientX-offsetLeft);
//        //var timeLineWidth=this.backcoverId.width.baseVal.value;
//
//        var perTime = CLIENTVAR.popcornobj.duration();
//            perTime=(perTime/timeLineWidth);
//
//
//            console.log('time :'+perTime*currentTime);
//        CLIENTVAR.popcornobj.play();
//        CLIENTVAR.popcornobj.play(perTime*currentTime);
//
//
//}
//

/**
 * @class
 * @param inputTime
 * 동영상의 current time  를 넣는다.
 * @example
 * var test=anbadoTimeLine('player');
 *
 * timeupdate()
 * {
 *  test.getCurrentTime(currenttime);
 * }
 *
 */

anbadoTimeLine.prototype.getCurrentTime = function(inputTime) {
    this.currentTime = inputTime;

}

//
//anbadoTimeLine.prototype.timeLineCover = function(evt)
//{
//
//            var offsetLeft=$('#rect2').offset().left;
//
//
//        var currentTime =(evt.clientX-offsetLeft);
//        var timeLineWidth=this.backcoverId.width.baseVal.value;
//
//        var perTime = CLIENTVAR.popcornobj.duration();
//            perTime=(perTime/timeLineWidth);
//
//
//            console.log('time :'+perTime*currentTime);
//        CLIENTVAR.popcornobj.play();
//        CLIENTVAR.popcornobj.play(perTime*currentTime);
//
//
//}


/**
 * 타임라인 그래프를 초기화 한다.
 * @class
 * @param time 동영상의 길이
 * duration time  동영상의 총 플레이시간을 받는다.
 * @example
 * var test=anbadoTimeLine();
 *
 * test.initialize(duration);
 *
 */
anbadoTimeLine.prototype.initialize = function(time) {

    /**
     * @type {*|jQuery|HTMLElement}
     * 비디오 아이디를 jquery 를  받아온다.
     */
    var vidjQueryId=$(this.videoId);
    /**
     *
     * @type {*}
     * 비디오의 높이를 받는다.
     */
    var height = vidjQueryId.css("height");
    /**
     * @type {*}
     * 비디오의 width 를받는다.
     */
    var width = vidjQueryId.css("width");

    vidjQueryId.append('<div class="areadiv"><svg id="stackedarea"></svg></div>');
    vidjQueryId.append('<div class="linediv" ><svg id="linechart"></svg></div>');
    vidjQueryId.append('<div class="piediv" id="pichart"><svg id="pie" class="mypiechart"></svg></div>');
    vidjQueryId.append('<div class="halfdiv" id="halfchart"><svg id="halfpi" class="mypiechart"></svg></div>');
    vidjQueryId.append('<div class="bardiv" ><svg id="barchart"> ' +
        '<circle id="circle1"></circle>' +
//        '<image id="image1" x="20" y="20" width="20" height="20" xlink:href="../examples/img/flower.png" />'+
        '<rect onclick="timeLineCover(evt)" onmousemove="mooseOnCover(evt)" onmouseout="mouseOutCover(evt)" id="rect1" x="50" y="20"  style="fill:gray;fill-opacity:0.5;"  />' +
        '<rect onmousemove="mooseOnCover(evt)" onclick="timeLineCover(evt)" onmouseout="mouseOutCover(evt)" id="rect2" x="50" y="20"  style="fill:blue;fill-opacity:0.1;"  /> </svg></div>');

    this.$areaDom=$('.areadiv');
    this.$lineDom=$('.linediv');
    this.$pieDom=$('.piediv');
    this.$halfDom=$('.halfdiv');
    this.$barDom=$('.bardiv');




    this.areajQueryId=$('#stackedarea');
    this.linejQueryId=$('#linechart');
    this.pijQueryId=$('#pichart');
    this.halfjQueryId=$('#halfchart');
    this.barjQueryId= $('#barchart');


//        $("#youtube").append(" <div id ='chartWrapper'></div>");
    this.areajQueryId.css("top", height);
    this.areajQueryId.css('width', width);
    this.linejQueryId.css('top', height);
    this.linejQueryId.css('width', width);

    this.pijQueryId.css('top', height);
    this.pijQueryId.css('left', (parseInt(width) / 3) + 'px');
    this.halfjQueryId.css('top', height);
    this.halfjQueryId.css('left', (parseInt(width) / 3) + 'px');
    this.barjQueryId.css('top', parseInt(height) -25);
    this.barjQueryId.css('left', -80);

    this.barjQueryId.css('width', parseInt(width) +130);

    this.coverId= document.getElementById("rect1");
    this.backcoverId= document.getElementById("rect2");
    this.positionId=document.getElementById("circle1");
    this.imageId=document.getElementById("image1");
    if(false)
    {
        this.dummy=time/100;
        this.makeTimelineDataArray(100);
    }
    else if(true)
    {
        this.dummy=1;
        this.makeTimelineDataArray(time);
    }
    //this.drawStackedAreaChart();



    this.durationTime = time;

};

/**
 * 주어진 시간 길이에 맞게 타임라인에 필요한 배열을 생성한다.
 * @class
 * @param time 동영상의 길이
 *
 */
anbadoTimeLine.prototype.makeTimelineDataArray = function(time) {


    this.goodData = [];
    this.badData = [];
    this.dummData = [];

    var data2 = anbado.restful.getVideoInfo(videoID);

    var weightValue =  data2.video.timeline_chart;

    time = parseInt(time) + 1; // TODO: time 값에 1을 더하는 이유에 대해서 확인하기
//    console.log("array time: " + time);


//    for (var tempCounter = 0; tempCounter < testObj.durationTime; tempCounter++){
//        console.log(tempCounter);
//        testObj.goodData[tempCounter] = [tempCounter,2];
//
//    }

    for (var i = 0; i < time; i++) {


        if(weightValue[i]===undefined){
            weightValue[i]=0;
        }

        // TODO: 0.5 값이 적당한지 확인 필요
        // goodData[i][0] = 시간
        // goodData[i][1] = 데이터 (갯수)
        this.goodData[i] = [i*1000, weightValue[i]];
        this.badData[i] = [i, 0];
        this.dummData[i] = [i, 0.1];

    }
};




/**
 * 주어지는 timeline canvas위에 툴팁을 그린다.
 * @class
 * @param svgObject 툴팁을 그릴 timeline canvas
 */
anbadoTimeLine.prototype.tooltip = function(svgObject) {

    /**
     * html 툴팁에 남는 글
     */
    var con;
    /**
     * jquery 로 타임라인의 width 와 height 를 받기위해 사용한다.
     * @type {*|jQuery|HTMLElement}
     */
    var $svgObject = $(svgObject);

    var top = parseInt($svgObject.css("height"));
    // TODO: CLIENTVAR를 사용하지 않도록 popcornobj에 대한 대책 필요
    var offset = parseInt($svgObject.css("left"));

    var time = this.durationTime;

    time = parseInt(time);
    time = ((parseInt($svgObject.css("width"))) / time);
    con = parseInt(this.currentTime);
    //con=parseInt(con/60)+":"+(con%60);
    con = "good" + (this.goodData[con][1]);

    nv.tooltip.cleanup();
    nv.tooltip.show([offset + this.currentTime * time, top], con, '', null, 0);
};

/**
 * 그래프 모양을 변경한다.
 * @class
 * @param newGraphShape 새로 변경할 그래프 모양
 */
anbadoTimeLine.prototype.setGraphShape = function(newGraphShape) {
    this.graphShape = newGraphShape;
};

/**
 * Stacked Area Chart를 그린다.
 */
anbadoTimeLine.prototype.drawStackedAreaChart = function() {
    var videoData = [
        {
            "key": "good",
            "values": this.goodData,
            color: "red"
        },
        {
            "key": "bad",
            "values": this.badData,
            color: "green"
        },
        {
            "key": "dummy",
            "values": this.dummData,
            color: "white"
        }

    ];


    var colors = d3.scale.category20();
    var keyColor = function(d, i) {
        return colors(d.key)
    };

    var chart;
    nv.addGraph(function() {
        chart = nv.models.stackedAreaChart()
            .x(function(d) {
                return d[0];
            })
            .y(function(d) {
                return d[1];
            })
            .color(keyColor)
        //.clipEdge(false);

// chart.stacked.scatter.clipVoronoi(false);        // x축 날짜로 나타남
//
//  chart.xAxis
//      .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });

        chart.yAxis
            .tickFormat(d3.format(',.2f'));

        d3.select('#stackedarea')
            .datum(videoData)
            .transition().duration(500).call(chart);

        nv.utils.windowResize(chart.update);

        chart.dispatch.on('stateChange', function(e) {
            nv.log('New State:', JSON.stringify(e));
        });

        return chart;
    });
};

/**
 * Line Chart를 그린다.
 */
anbadoTimeLine.prototype.drawLineChart = function() {
    // Wrapping in nv.addGraph allows for '0 timeout render', stores rendered charts in nv.graphs, and may do more in the future... it's NOT required
    var chart;
    var lineGoodData = [], lineBadData = [], linedummy = [];
    for (var i = 0; i < this.goodData.length; i++) {
        lineGoodData.push({x: this.goodData[i][0], y: this.goodData[i][1]}); //the nulls are to show how defined works
        lineBadData.push({x: this.badData[i][0], y: this.badData[i][1]});
        linedummy.push({x: this.dummData[i][0], y: this.dummData[i][1]})
    }


    var test = [
        {
            values: linedummy,
            key: "dummy",
            color: "white"
        }

        ,
        {
            values: lineGoodData,
            key: "good",
            color: "red"
        },
        {
            values: lineBadData,
            key: "bad",
            color: "green"
        }


    ];


    nv.addGraph(function() {
        chart = nv.models.lineChart();

        chart
            .x(function(d, i) {
                return i
            })


        chart.xAxis // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
            .tickFormat(d3.format(',.1f'));

        chart.yAxis
            .axisLabel('Voltage (v)')
            .tickFormat(d3.format(',.2f'));

        chart.showXAxis(true);

        d3.select('#linechart')
            //.datum([]) //for testing noData
            .datum(test)
            .transition().duration(500)
            .call(chart);

        //TODO: Figure out a good way to do this automatically
        nv.utils.windowResize(chart.update);
        //nv.utils.windowResize(function() { d3.select('#chart1 svg').call(chart) });

        chart.dispatch.on('stateChange', function(e) {
            nv.log('New State:', JSON.stringify(e));
        });

        return chart;
    });
};

/**
 * pie chart 를 그린다.
 */
anbadoTimeLine.prototype.drawPieChart = function() {
    var goodpi = 0, badpi = 0;

    for (var k = 0; k < this.goodData.length; k++) {
        goodpi = goodpi + (this.goodData[k][1]);
        badpi = badpi + (this.badData[k][1]);
    }

    var testdata = [
        {
            key: "good",
            y: goodpi
        },
        {
            key: "bad",
            y: badpi
        }
    ];

    nv.addGraph(function() {
        var width = 200,
            height = 200;

        var chart = nv.models.pieChart()
            .x(function(d) {
                return d.key
            })
            .y(function(d) {
                return d.y
            })
            //.showLabels(false)
            .values(function(d) {
                return d
            })
            .color(d3.scale.category10().range())
            .width(width)
            .height(height);

        d3.select("#pie")
            .datum([testdata])
            .transition().duration(1200)
            .attr('width', width)
            .attr('height', height)
            .call(chart);

        chart.dispatch.on('stateChange', function(e) {
            nv.log('New State:', JSON.stringify(e));
        });

        return chart;
    });
};

/**
 * Half Pie Chart를 그린다.
 */
anbadoTimeLine.prototype.drawHalfPieChart = function() {
    var goodpi = 0, badpi = 0;

    for (var k = 0; k < this.goodData.length; k++) {
        goodpi = goodpi + (this.goodData[k][1]);
        badpi = badpi + (this.badData[k][1]);
    }

    var testdata = [
        {
            key: "good",
            y: goodpi
        },
        {
            key: "bad",
            y: badpi
        }
    ];

    nv.addGraph(function() {

        var width = 200,
            height = 200;

        var chart = nv.models.pieChart()
            .x(function(d) {
                return d.key
            })
            //.y(function(d) { return d.value })
            .values(function(d) {
                return d
            })
            //.labelThreshold(.08)
            //.showLabels(false)
            .color(d3.scale.category10().range())
            .width(width)
            .height(height)
            .donut(true);

        chart.pie
            .startAngle(function(d) {
                return d.startAngle / 2 - Math.PI / 2
            })
            .endAngle(function(d) {
                return d.endAngle / 2 - Math.PI / 2
            });

        //chart.pie.donutLabelsOutside(true).donut(true);

        d3.select("#halfpi")
            //.datum(historicalBarChart)
            .datum([testdata])
            .transition().duration(1200)
            .attr('width', width)
            .attr('height', height)
            .call(chart);

        return chart;
    });
};

/**
 * bar chart 를 그린다.
 */
anbadoTimeLine.prototype.drawBarChart = function() {

//

    var testdata = [
        {
            "key": "Quantity",
            "bar": true,
            "values": this.goodData,
            color: "red"
        }
    ].map(function(series) {
            series.values = series.values.map(function(d) {
                return {x: d[0], y: d[1] }
            });
            return series;
        });


    var chart;

    nv.addGraph(function() {

        chart = nv.models.linePlusBarChart()
            .margin({top: 30, right: 60, bottom: 50, left: 70})
            .x(function(d, i) {
                return i
            })
            .color(d3.scale.category10().range());

        chart.xAxis.tickFormat(function (d) {
            var dx = testdata[0].values[d] && testdata[0].values[d].x || 0;

            return dx ? d3.time.format('%M'+':'+'%S')(new Date(dx)) : '';
        })
            .showMaxMin(false);

        chart.y1Axis
            .tickFormat(d3.format(',f'));

        chart.y2Axis
            .tickFormat(function(d) {
                return '$' + d3.format(',.2f')(d)
            });

//            chart.bars.forceY([0]).padData(false);
//            chart.lines.forceY([0]);

        d3.select('#barchart')
            .datum(testdata)
            .transition().duration(500).call(chart);

        nv.utils.windowResize(chart.update);

        chart.dispatch.on('stateChange', function(e) {
            nv.log('New State:', JSON.stringify(e));
        });

        return chart;
    });
};



/**
 * 지정된 그래프 타입에 따라 적절한 그래프를 선택하여 그린다.
 * @class
 * @param type good 인지 bad 인지에 따라 구분함
 * @example
 * var test = anbadoTimeLine('player');
 *
 * test.drawVisualization('g');// 차트 해당시간에 good 카운트 증가
 *
 * test.drawVisualization('b');// 차트 해당시간에 bad 카운트 증가
 *
 * test.drawVisualization();// offset 차트 그리기
 */
anbadoTimeLine.prototype.drawVisualization = function(type,think) {

    /**
     *
     * @type {number}
     * 현재시간을 받아온다.
     */



    if(think === undefined){
        var inttime = this.currentTime;
    }
    else{
        var inttime = think.clickTime;
    }
    inttime = parseInt(inttime);


//           for(var i=0;i<$('.tick.major line').length+1;i++)
//            {
//            $('.tick.major line')[i].y2.baseVal.value=0;
//            $('.tick.major line')[i].x2.baseVal.value=0;
//            }

//        inttime=inttime/this.dummy;
//        inttime=parseInt(inttime);
//        console.log("time"+inttime);

    if (type === 'g') {
        this.goodData[inttime][1] = (this.goodData[inttime][1] + 1);
    }
    else if (type === 'b') {
        this.badData[inttime][1] = (this.badData[inttime][1] + 1);
    }


    switch (this.graphShape) {
        case 1:
            this.$areaDom.show();
            this.$lineDom.hide();
            this.$pieDom.hide();
            this.$halfDom.hide();
            this.$barDom.hide();
            this.drawStackedAreaChart();
            break;
        case 2:
            this.$areaDom.hide();
            this.$lineDom.show();
            this.$pieDom.hide();
            this.$halfDom.hide();
            this.$barDom.hide();
            this.drawLineChart();
            break;
        case 3:
            this.$areaDom.hide();
            this.$lineDom.hide();
            this.$pieDom.show();
            this.$halfDom.hide();
            this.$barDom.hide();
            this.drawPieChart();
            break;
        case 4:
            this.$areaDom.hide();
            this.$lineDom.hide();
            this.$pieDom.hide();
            this.$halfDom.show();
            this.$barDom.hide();
            this.drawHalfPieChart();
            break;
        case 5:
            this.$areaDom.hide();
            this.$lineDom.hide();
            this.$pieDom.hide();
            this.$halfDom.hide();
            this.$barDom.show();
            this.drawBarChart();
            break;
    }


};

//    return {
//        timeline: {
//            initialize: initialize,
//            drawVisualization: drawVisualization,
//            tooltip: tooltip,
//            setGraphShape: setGraphShape,
//            getCurrentTime:getCurrentTime
//        }
//    }
//});
//
//
//
//jQuery.extend(true, anbado,anbadoDummy(jQuery));


//var timeset=2;
//function happybutton()
//{
//
//    if (timeset === 2) {
//        console.log("gray");
//        $("#happy1").css({"background": 'gray'});
//        anbado.timeline.drawVisualization('g');
//        timeset = 1;
//
//        if (timeset === 1) {
//            setTimeout(function () {
//                console.log("red");
//                $("#happy1").css({"background": 'crimson'});
//               timeset = 2;
//            }, 5000);
//            timeset = 0;
//        }
//    }
//
//}
//
//function sadbutton()
//{
//
//    if (timeset === 2) {
//        anbado.timeline.drawVisualization('b');
//        timeset = 1;
//        if (timeset === 1) {
//            setTimeout(function () {
//                timeset = 2;
//            }, 5000);
//            timeset = 0;
//        }
//    }
//
//}

//function graphselect()
//{
////    var gra=document.selectform;
//    var graphTemp = $("#graphSelector").val();
//
//    if (graphTemp === "1")//area graph
//    {
//        anbado.timeline.setGraphShape(1);
//        anbado.timeline.drawVisualization();
//
//    }
//    else if (graphTemp === "2") //line graph
//    {
//        anbado.timeline.setGraphShape(2);
//        anbado.timeline.drawVisualization();
//        console.log("top:"+($('#linechart').top));
//    }
//    else if (graphTemp === "3") {
//
//        anbado.timeline.setGraphShape(3);
//        anbado.timeline.drawVisualization();
//    }
//    else if (graphTemp === "4") {
//
//        anbado.timeline.setGraphShape(4);
//        anbado.timeline.drawVisualization();
//    }
//    else if (graphTemp === "5") {
//
//        anbado.timeline.setGraphShape(5);
//        anbado.timeline.drawVisualization();
//        console.log("top:"+($('#barchart').top));
//    }
//
//}

/**
 * Created with JetBrains WebStorm.
 * User: mijong
 * Date: 13. 8. 22.
 * Time: 오후 3:01
 * To change this template use File | Settings | File Templates.
 */

var anbado = window.anbado || {};

var anbadoDummy=(function($){

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
    var graphShape = 1;

    /**
     * Good 버튼을 누른 타임라인 데이터
     *
     * @type {Array}
     */
    var goodData = [];

    /**
     * Bad 버튼을 누른 타임라인 데이터
     *
     * @type {Array}
     */
    var badData = [];

    var currentTime=0;
    var durationTime=0;

    var getCurrentTime= function(inputTime)
    {
        currentTime=inputTime;

    }



    /**
     * 타임라인 그래프를 초기화 한다.
     *
     * @param time 동영상의 길이
     */
    var initialize = function(time) {
        var hei=$("#youtube").css("height");
        var wid=$("#youtube").css("width");


//        $("#youtube").append(" <div id ='chartWrapper'></div>");
        $("#youtube").append("<div class='areadiv'><svg id='stackedarea'></svg></div>");
        $("#stackedarea").css("top",hei);
        $("#stackedarea").css("width",wid);
        $("#youtube").append("<div class='linediv' ><svg id='linechart'></svg></div>");
        $("#linechart").css("top",hei);
        $("#linechart").css("width",wid);
        $("#youtube").append("<div class='piediv' id='pichart'><svg id='pie' class='mypiechart'></svg></div>");
        $("#pichart").css("top",hei);
        $("#pichart").css("left",(parseInt(wid)/3)+"px");
        $("#youtube").append("<div class='halfdiv' id='halfchart'><svg id='halfpi' class='mypiechart'></svg></div>");
        $("#halfchart").css("top",hei);
        $("#halfchart").css("left",(parseInt(wid)/3)+"px");
        $("#youtube").append("  <div class='bardiv' ><svg id='barchart'> </svg></div>");
        $("#barchart").css("top",hei);
        $("#barchart").css("width",wid);

        makeTimelineDataArray(time);
        drawStackedAreaChart();
        durationTime=time;
    };

    /**
     * 주어진 시간 길이에 맞게 타임라인에 필요한 배열을 생성한다.
     *
     * @param time 동영상의 길이
     */
    var makeTimelineDataArray = function(time) {

        goodData = [];
        badData = [];


        time = parseInt(time) + 1; // TODO: time 값에 1을 더하는 이유에 대해서 확인하기
        console.log("array time: " + time);

        for (var i = 0; i < time; i++) {
            // TODO: 0.5 값이 적당한지 확인 필요
            // goodData[i][0] = 시간
            // goodData[i][1] = 데이터 (갯수)
            goodData[i] = [i, 0.5];
            badData[i] = [i, 0.5];

        }
    };

    /**
     * 주어지는 timeline canvas위에 툴팁을 그린다.
     *
     * @param svgObject 툴팁을 그릴 timeline canvas
     */
    var tooltip = function(svgObject) {
        var offset = 345;
        var con;
        var $svgObject = $(svgObject);

        var top=parseInt($svgObject.css("top"));
        // TODO: CLIENTVAR를 사용하지 않도록 popcornobj에 대한 대책 필요

        var time=durationTime;

        time=parseInt(time);
        time=((parseInt($svgObject.css("width"))-85)/time);
        con=parseInt(currentTime);
        //con=parseInt(con/60)+":"+(con%60);
        con="good"+(goodData[con][1]-0.5);

        nv.tooltip.cleanup();
        nv.tooltip.show([offset+currentTime*time, top+150], con, '', null, 0);
    };

    /**
     * 그래프 모양을 변경한다.
     *
     * @param newGraphShape 새로 변경할 그래프 모양
     */
    var setGraphShape = function(newGraphShape) {
        graphShape = newGraphShape;
    };

    /**
     * Stacked Area Chart를 그린다.
     */
    var drawStackedAreaChart = function() {
        var videoData = [
            {
                "key": "good",
                "values": goodData,
                color: "red"
            },
            {
                "key": "bad",
                "values": badData,
                color: "green"
            }

        ];



        var colors = d3.scale.category20();
        var keyColor = function (d, i) {
            return colors(d.key)
        };

        var chart;
        nv.addGraph(function () {
            chart = nv.models.stackedAreaChart()
                .x(function (d) {
                    return d[0];
                })
                .y(function (d) {
                    return d[1];
                })
                .color(keyColor);
            //.clipEdge(true);

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

            chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

            return chart;
        });
    };

    /**
     * Line Chart를 그린다.
     */
    var drawLineChart = function() {
        // Wrapping in nv.addGraph allows for '0 timeout render', stores rendered charts in nv.graphs, and may do more in the future... it's NOT required
        var chart;
        var lineGoodData = [], lineBadData = [];
        for (var i = 0; i < goodData.length; i++) {
            lineGoodData.push({x: goodData[i][0], y: goodData[i][1]}); //the nulls are to show how defined works
            lineBadData.push({x: badData[i][0], y: badData[i][1]-0.5});
        }


        var test =[
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
                .x(function(d,i) { return i })


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

            chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

            return chart;
        });
    };

    /**
     * pie chart 를 그린다.
     */
    var drawPieChart = function() {
        var goodpi = 0, badpi = 0;

        for (var k = 0; k < goodData.length; k++) {
            goodpi = goodpi + (goodData[k][1] - 0.5);
            badpi = badpi + (badData[k][1] - 0.5);
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

        nv.addGraph(function () {
            var width = 200,
                height = 200;

            var chart = nv.models.pieChart()
                .x(function (d) {
                    return d.key
                })
                .y(function (d) {
                    return d.y
                })
                //.showLabels(false)
                .values(function (d) {
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

            chart.dispatch.on('stateChange', function (e) {
                nv.log('New State:', JSON.stringify(e));
            });

            return chart;
        });
    };

    /**
     * Half Pie Chart를 그린다.
     */
    var drawHalfPieChart = function() {
        var goodpi = 0, badpi = 0;

        for (var k = 0; k < goodData.length; k++) {
            goodpi = goodpi + (goodData[k][1] - 0.5);
            badpi = badpi + (badData[k][1] - 0.5);
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

        nv.addGraph(function () {

            var width = 200,
                height = 200;

            var chart = nv.models.pieChart()
                .x(function (d) {
                    return d.key
                })
                //.y(function(d) { return d.value })
                .values(function (d) {
                    return d
                })
                //.labelThreshold(.08)
                //.showLabels(false)
                .color(d3.scale.category10().range())
                .width(width)
                .height(height)
                .donut(true);

            chart.pie
                .startAngle(function (d) {
                    return d.startAngle / 2 - Math.PI / 2
                })
                .endAngle(function (d) {
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
    var drawBarChart = function() {
        var testdata = [
            {
                "key": "Quantity",
                "bar": true,
                "values": goodData }
        ].map(function (series) {
                series.values = series.values.map(function (d) {
                    return {x: d[0], y: d[1] }
                });
                return series;
            });


        var chart;

        nv.addGraph(function () {

            chart = nv.models.linePlusBarChart()
                .margin({top: 30, right: 60, bottom: 50, left: 70})
                .x(function (d, i) {
                    return i
                })
                .color(d3.scale.category10().range());

//            chart.xAxis.tickFormat(function (d) {
//                var dx = testdata[0].values[d] && testdata[0].values[d].x || 0;
//                return dx ? d3.time.format('%x')(new Date(dx)) : '';
//            })
//                .showMaxMin(false);

//            chart.y1Axis
//                .tickFormat(d3.format(',f'));

//            chart.y2Axis
//                .tickFormat(function (d) {
//                    return '$' + d3.format(',.2f')(d)
//                });

            //chart.bars.forceY([0]).padData(false);
            //chart.lines.forceY([0]);

            d3.select('#barchart')
                .datum(testdata)
                .transition().duration(500).call(chart);

            nv.utils.windowResize(chart.update);

            chart.dispatch.on('stateChange', function (e) {
                nv.log('New State:', JSON.stringify(e));
            });

            return chart;
        });
    };


    /**
     * 지정된 그래프 타입에 따라 적절한 그래프를 선택하여 그린다.
     */
    var drawVisualization = function(state) {

        var inttime=currentTime;
        inttime=parseInt(inttime);


        if(state==='g')
        {goodData[inttime][1] = (goodData[inttime][1]+1);}
        else if(state==='b')
        {badData[inttime][1] = (badData[inttime][1]+1);}



        switch(graphShape) {
            case 1:
                $('.areadiv').show();
                $('.linediv').hide();
                $('.piediv').hide();
                $('.halfdiv').hide();
                $('.bardiv').hide();
                drawStackedAreaChart();
                break;
            case 2:
                $('.areadiv').hide();
                $('.linediv').show();
                $('.piediv').hide();
                $('.halfdiv').hide();
                $('.bardiv').hide();
                drawLineChart();
                break;
            case 3:
                $('.areadiv').hide();
                $('.linediv').hide();
                $('.piediv').show();
                $('.halfdiv').hide();
                $('.bardiv').hide();
                drawPieChart();
                break;
            case 4:
                $('.areadiv').hide();
                $('.linediv').hide();
                $('.piediv').hide();
                $('.halfdiv').show();
                $('.bardiv').hide();
                drawHalfPieChart();
                break;
            case 5:
                $('.areadiv').hide();
                $('.linediv').hide();
                $('.piediv').hide();
                $('.halfdiv').hide();
                $('.bardiv').show();
                drawBarChart();
                break;
        }
    };

    return {
        timeline: {
            initialize: initialize,
            drawVisualization: drawVisualization,
            tooltip: tooltip,
            setGraphShape: setGraphShape,
            getCurrentTime:getCurrentTime
        }
    }
});



jQuery.extend(true, anbado,anbadoDummy(jQuery));


var timeset=2;
function happybutton()
{

    if (timeset === 2) {
        console.log("gray");
        $("#happy1").css({"background": 'gray'});
        anbado.timeline.drawVisualization('g');
        timeset = 1;

        if (timeset === 1) {
            setTimeout(function () {
                console.log("red");
                $("#happy1").css({"background": 'crimson'});
               timeset = 2;
            }, 5000);
            timeset = 0;
        }
    }

}

function sadbutton()
{

    if (timeset === 2) {
        anbado.timeline.drawVisualization('b');
        timeset = 1;
        if (timeset === 1) {
            setTimeout(function () {
                timeset = 2;
            }, 5000);
            timeset = 0;
        }
    }

}

function graphselect()
{
//    var gra=document.selectform;
    var graphTemp = $("#graphSelector").val();

    if (graphTemp === "1")//area graph
    {
        anbado.timeline.setGraphShape(1);
        anbado.timeline.drawVisualization();
        console.log("top:"+($('#stackedarea').top));
    }
    else if (graphTemp === "2") //line graph
    {
        anbado.timeline.setGraphShape(2);
        anbado.timeline.drawVisualization();
        console.log("top:"+($('#linechart').top));
    }
    else if (graphTemp === "3") {

        anbado.timeline.setGraphShape(3);
        anbado.timeline.drawVisualization();
    }
    else if (graphTemp === "4") {

        anbado.timeline.setGraphShape(4);
        anbado.timeline.drawVisualization();
    }
    else if (graphTemp === "5") {

        anbado.timeline.setGraphShape(5);
        anbado.timeline.drawVisualization();
        console.log("top:"+($('#barchart').top));
    }

}

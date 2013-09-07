/**
 * Created with JetBrains WebStorm.
 * User: mijong
 * Date: 13. 8. 22.
 * Time: 오후 3:01
 * To change this template use File | Settings | File Templates.
 */




function make_array( gettime )
{

    gettime=parseInt(gettime);
    gettime=gettime+1;
    console.log("array time:"+gettime);


    //array 2d ㅁ만들기
    for (var i=0;i<gettime;i++)
    {// 앞에 꺼 time
        CLIENTVAR.arrayg[i] = [];
        CLIENTVAR.arrayb[i] = [];
    }


    for(var j=0;j<gettime;j++)
    {
        CLIENTVAR.arrayg[j][0] = j;CLIENTVAR.arrayg[j][1] = 0.5;
        CLIENTVAR.arrayb[j][0] = j;CLIENTVAR.arrayb[j][1] = 0.5;

    }
}


function drawVisualization() {



    CLIENTVAR.inttime=CLIENTVAR.popcornobj.currentTime();
    CLIENTVAR.inttime=parseInt(CLIENTVAR.inttime);


    CLIENTVAR.arrayg[CLIENTVAR.inttime][1] = (CLIENTVAR.arrayg[CLIENTVAR.inttime][1]+CLIENTVAR.good);
    CLIENTVAR.arrayb[CLIENTVAR.inttime][1] = (CLIENTVAR.arrayb[CLIENTVAR.inttime][1]+CLIENTVAR.bad);
    CLIENTVAR.good=0;
    CLIENTVAR.bad=0;



    if(CLIENTVAR.graphshape==1)
    {stactareachart();}
    else if(CLIENTVAR.graphshape==2)
    {line();}
    else if(CLIENTVAR.graphshape==3)
    {pichart();}
    else if(CLIENTVAR.graphshape==4)
    {halfpichart();}
    else if(CLIENTVAR.graphshape==5)
    {barchart();}
}




function happybutton()
{
     
         if(CLIENTVAR.timeset===2)
        {      console.log("gray");
$("#happy1").css({"background":'gray'});
                  CLIENTVAR.good++;
            drawVisualization();
            CLIENTVAR.timeset=1;

        if(CLIENTVAR.timeset===1)
        {
            setTimeout(function()
            {
                console.log("red");
    $("#happy1").css({"background":'crimson'});
            CLIENTVAR.timeset=2;
            },5000);
        CLIENTVAR.timeset=0;
        }
        }

}

function sadbutton()
{
  
         if(CLIENTVAR.timeset===2)
        {
                  CLIENTVAR.bad++;
            drawVisualization();
            CLIENTVAR.timeset=1;
        if(CLIENTVAR.timeset===1)
        {
            setTimeout(function()
            {
            CLIENTVAR.timeset=2;
            },5000);
        CLIENTVAR.timeset=0;
        }
        }
   
}

function stactareachart()
{

    var vidiOdata = [
        {
            "key" : "good" ,
            "values" : CLIENTVAR.arrayg,
            color: "ivory"
        },
        {
            "key" : "bad" ,
            "values" : CLIENTVAR.arrayb,
            color: "green"
        }

    ];
    var colors = d3.scale.category20();
    var keyColor = function(d, i) {return colors(d.key)};

    var chart;
    nv.addGraph(function() {
        chart = nv.models.stackedAreaChart()
            .x(function(d) { return d[0] })
            .y(function(d) { return d[1] })
            .color(keyColor)
        //.clipEdge(true);

// chart.stacked.scatter.clipVoronoi(false);        // x축 날짜로 나타남
//
//  chart.xAxis
//      .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });

        chart.yAxis
            .tickFormat(d3.format(',.2f'));

        d3.select('#stackedarea')
            .datum(vidiOdata)
            .transition().duration(500).call(chart);

        nv.utils.windowResize(chart.update);

        chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

        return chart;
    });

}

function line()
{
    // Wrapping in nv.addGraph allows for '0 timeout render', stores rendered charts in nv.graphs, and may do more in the future... it's NOT required
    var chart;
    var goood = [],baad=[];
    for (var i = 0; i < CLIENTVAR.arrayg.length; i++) {
        goood.push({x: CLIENTVAR.arrayg[i][0], y: CLIENTVAR.arrayg[i][1]}); //the nulls are to show how defined works
        baad.push({x: CLIENTVAR.arrayb[i][0], y: CLIENTVAR.arrayb[i][1]-0.5});
    }


    var test =[
        {
            values: goood,
            key: "good",
            color: "red"
        },
        {
            values: baad,
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

        d3.select('#linechart svg')
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
}



function pichart()
{


    var goodpi= 0,badpi=0;

    for(var k=0;k<CLIENTVAR.arrayg.length;k++)
    {
        goodpi=goodpi+(CLIENTVAR.arrayg[k][1]-0.0001);
        badpi=badpi+(CLIENTVAR.arrayb[k][1]-0.0001);
    }
    console.log("pichrt:"+CLIENTVAR.arrayg[CLIENTVAR.inttime][1]);



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
            .x(function(d) { return d.key })
            .y(function(d) { return d.y })
            //.showLabels(false)
            .values(function(d) { return d })
            .color(d3.scale.category10().range())
            .width(width)
            .height(height);

        d3.select("#pie")
            .datum([testdata])
            .transition().duration(1200)
            .attr('width', width)
            .attr('height', height)
            .call(chart);

        chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

        return chart;
    });
}


function halfpichart()
{

    var goodpi= 0,badpi=0;

    for(var k=0;k<CLIENTVAR.arrayg.length;k++)
    {
        goodpi=goodpi+(CLIENTVAR.arrayg[k][1]-0.0001);
        badpi=badpi+(CLIENTVAR.arrayb[k][1]-0.0001);
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
            .x(function(d) { return d.key })
            //.y(function(d) { return d.value })
            .values(function(d) { return d })
            //.labelThreshold(.08)
            //.showLabels(false)
            .color(d3.scale.category10().range())
            .width(width)
            .height(height)
            .donut(true);

        chart.pie
            .startAngle(function(d) { return d.startAngle/2 -Math.PI/2 })
            .endAngle(function(d) { return d.endAngle/2 -Math.PI/2 });

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

}

function barchart()
{


var testdata = [
  {
    "key" : "Quantity" ,
    "bar": true,
    "values" : [ [ 1136005200000 , 1271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]]
  }
].map(function(series) {
  series.values = series.values.map(function(d) { return {x: d[0], y: d[1] } });
  return series;
});


var chart;

nv.addGraph(function() {
    chart = nv.models.linePlusBarChart()
        .margin({top: 30, right: 60, bottom: 50, left: 70})
        .x(function(d,i) { return i })
        .color(d3.scale.category10().range());

    chart.xAxis.tickFormat(function(d) {
      var dx = testdata[0].values[d] && testdata[0].values[d].x || 0;
      return dx ? d3.time.format('%x')(new Date(dx)) : '';
      })
      .showMaxMin(false);

    chart.y1Axis
        .tickFormat(d3.format(',f'));

    chart.y2Axis
        .tickFormat(function(d) { return '$' + d3.format(',.2f')(d) });

    chart.bars.forceY([0]).padData(false);
    //chart.lines.forceY([0]);

    d3.select('#barchart svg')
        .datum(testdata)
      .transition().duration(500).call(chart);

    nv.utils.windowResize(chart.update);

    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

    return chart;
});
}


function graphselect()
{
//    var gra=document.selectform;
    var graphTemp = $("#graphSelector").val();

    if(graphTemp === "1" )//area graph
    {CLIENTVAR.graphshape=1;

        stactareachart();
        $('.areadiv').show();
        $('.linediv').hide();
        $('.piediv').hide();
        $('.halfdiv').hide();
        $('.bardiv').hide();
    }
    else if(graphTemp === "2") //line graph
    {CLIENTVAR.graphshape=2;
        line();
        $('.areadiv').hide();
        $('.linediv').show();
        $('.piediv').hide();
        $('.halfdiv').hide();
        $('.bardiv').hide();
    }
    else if(graphTemp === "3")
    {CLIENTVAR.graphshape=3;
        pichart();
        $('.areadiv').hide();
        $('.linediv').hide();
        $('.piediv').show();
        $('.halfdiv').hide();
        $('.bardiv').hide();
    }
    else if(graphTemp === "4")
    {CLIENTVAR.graphshape=4;
        halfpichart();
        $('.areadiv').hide();
        $('.linediv').hide();
        $('.piediv').hide();
        $('.halfdiv').show();
        $('.bardiv').hide();
    }
        else if(graphTemp === "5")
    {CLIENTVAR.graphshape=5;
        barchart();
        $('.areadiv').hide();
        $('.linediv').hide();
        $('.piediv').hide();
        $('.halfdiv').hide();
        $('.bardiv').show();
    }

}

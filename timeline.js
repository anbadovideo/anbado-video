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
        CLIENTVAR.arrayg[j][0] = j;CLIENTVAR.arrayg[j][1] = 0.0001;
        CLIENTVAR.arrayb[j][0] = j;CLIENTVAR.arrayb[j][1] = 0.0001;

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
}




function happybutton()
{

    CLIENTVAR.good++;
    drawVisualization();
}

function sadbutton()
{
    CLIENTVAR.bad++;
    drawVisualization();
}

function stactareachart()
{

    var histcatexplong = [
        {
            "key" : "good" ,
            "values" : CLIENTVAR.arrayg
        },
        {
            "key" : "bad" ,
            "values" : CLIENTVAR.arrayb
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
            .datum(histcatexplong)
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
        baad.push({x: CLIENTVAR.arrayb[i][0], y: CLIENTVAR.arrayb[i][1]-0.0001});
    }


    var test =[
        {
            values: goood,
            key: "good",
            color: "#2ca02c"
        },
        {
            values: baad,
            key: "bad",
            color: "red"
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
    }
    else if(graphTemp === "2") //line graph
    {CLIENTVAR.graphshape=2;
        line();
        $('.areadiv').hide();
        $('.linediv').show();
        $('.piediv').hide();
        $('.halfdiv').hide();
    }
    else if(graphTemp === "3")
    {CLIENTVAR.graphshape=3;
        pichart();
        $('.areadiv').hide();
        $('.linediv').hide();
        $('.piediv').show();
        $('.halfdiv').hide();
    }
    else if(graphTemp === "4")
    {CLIENTVAR.graphshape=4;
        halfpichart()
        $('.areadiv').hide();
        $('.linediv').hide();
        $('.piediv').hide();
        $('.halfdiv').show();
    }

}

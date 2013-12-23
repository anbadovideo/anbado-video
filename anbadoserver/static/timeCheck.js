/**
 * @author anbado video
 * @since 0.1
 * timeCheck.js
 */


document.addEventListener("DOMContentLoaded", function() {

    var inti;    // 타임체크 함수를 위한 카운터
    var totalCount = 0; // 이벤트들이 제대로 숫자가 생성되었는지를 확인하기 위한 부분임


    CLIENTVAR.popcornobj.on("loadeddata", function() {


        var durationtime = CLIENTVAR.popcornobj.duration();

        testObj.initialize(durationtime);
        testObj.setGraphShape(5);

        testObj.drawVisualization();


        setTimeout(function()
        {

            var ba = document.getElementsByClassName("nv-linePlusBar");
            ba[0].parentNode.insertBefore(ba[0],ba[0].parentNode.firstChild);
            //ba[0].setAttribute("transform","translate(10,8)");

            /**
             * 원 svg
             */
                //testObj.positionId.setAttribute('r',5);
            testObj.positionId.setAttribute('cy',0);
            testObj.positionId.setAttribute('cx',10);
            testObj.positionId.setAttribute('fill','red');
            /**
             * 타임라인 앞 뒤 커버
             */
            testObj.coverId.setAttribute('height',80);
            testObj.coverId.setAttribute('x',10);
            testObj.coverId.setAttribute('y',0);
            testObj.coverId.setAttribute('width',parseInt($(testObj.videoId).css('width'))-10);
            testObj.backcoverId.setAttribute('height',80);
            testObj.backcoverId.setAttribute('x',10);
            testObj.backcoverId.setAttribute('y',0);
            testObj.backcoverId.setAttribute('width',parseInt($(testObj.videoId).css('width'))-10);


            /**
             * 차트 뒤에 시간이 가려지는 문제 해결
             */
            //$('#barchart').width(980);

            /**
             * 동영상 타임 , 클릭수 에서 나오는 하얀색 기준선을 없애는 jauery
             */
            $('.tick.major line').remove();
            /**
             * 타임라인위에 있는 바차트 설명 해주는 거 숨김
             */
            $('.nv-legendWrap').hide();

        },100)
    });

    //setInterval(function() {console.log('1');},500)


    var teststate=1;
    var pauseState=0;
    var agt = navigator.userAgent.toLowerCase();

    CLIENTVAR.popcornobj.on('play', function() {

//        anbado.realtime.enterVideo(videoID, userID);
        $("#canvas1").show();

        // var stackedAreaObject = $('#stackedarea');


        inti = self.setInterval(function() {

            summaryTimeline.setCustomTime(new Date(CLIENTVAR.pageGenerationTime.getTime() + CLIENTVAR.popcornobj.currentTime()*1000));
            summaryTimeline.setVisibleChartRange(new Date(CLIENTVAR.pageGenerationTime.getTime() + CLIENTVAR.popcornobj.currentTime()*1000 - 1000*CLIENTVAR.popcornobj.duration()/10), new Date(CLIENTVAR.pageGenerationTime.getTime() + CLIENTVAR.popcornobj.currentTime()*1000 + 1000*CLIENTVAR.popcornobj.duration()/10));
            timeCheck();

            if(CLIENTVAR.popcornobj.paused()==false)// 플레이 상태
            {

                if(testObj.clickEvtCheck==1)
                {testObj.clickEvtCheck=0;CLIENTVAR.popcornobj.currentTime(testObj.clickPoint);}
                //else if(testObj.watchDog!=1&&testObj.clickEvtCheck!=1)//타임업데이트가 안일어난다.
                //{CLIENTVAR.popcornobj.pause();teststate=1;pauseState=1;}


            }

            else if(CLIENTVAR.popcornobj.paused()==true)// 일시정지상태
            {

//                    if (agt.indexOf("chrome") != -1) {
//                    if(testObj.watchDog==1&&teststate==1)// 타임업데이트
//                    {CLIENTVAR.popcornobj.play();teststate=0;pauseState=0;}
//                    else if(testObj.watchDog!=1)// 타임업데이트 안일어남
//                    {CLIENTVAR.popcornobj.pause();pauseState=1;}
//                    }
//
//                if (agt.indexOf("safari") != -1)
//                {
//                    if(testObj.watchDog==1&&teststate==1)// 타임업데이트
//                    {CLIENTVAR.popcornobj.play();teststate=0;pauseState=0;}
//                    else if(testObj.watchDog!=1)// 타임업데이트 안일어남
//                    {CLIENTVAR.popcornobj.play();pauseState=1;}
//                }
//                else
//                {
                    if(testObj.watchDog==1&&teststate==1)// 타임업데이트
                    {CLIENTVAR.popcornobj.play(testObj.clickPoint);teststate=0;pauseState=0;}
                    else if(testObj.watchDog!=1)// 타임업데이트 안일어남
                    {CLIENTVAR.popcornobj.pause(testObj.clickPoint);pauseState=1;}
                //}

            }



        }, 500);




        var k=parseInt($(testObj.videoId).css('width'))-10;
        var ti=(k/testObj.durationTime);



        CLIENTVAR.popcornobj.on('timeupdate', function() {
//            console.log(this.media.src);
            testObj.watchDog=1;

            var coverTime=parseInt(ti*testObj.currentTime);

            testObj.coverId.setAttribute('x',coverTime+10);
            testObj.coverId.setAttribute('width',parseInt($(testObj.videoId).css('width'))-coverTime-10);

            testObj.getCurrentTime(CLIENTVAR.popcornobj.currentTime());
            //testObj.tooltip();
//          anbado.summaryTimeline.tooltip(stackedAreaObject)

        });
        // socket.emit('sample',{hello: CLIENTVAR.popcornobj.currentTime()});




    });

    CLIENTVAR.popcornobj.on('pause',function(){
        $('#canvas1').hide();
        $('#summaryPanel').hide();

        if(pauseState!=1)
        {inti = window.clearInterval(inti);}
    });

//
//    CLIENTVAR.popcornobj.cue( 10, function() {
//
//        testObj.watchDog=0;
//        this.currentTime(60);
//
//    });






    CLIENTVAR.popcornobj.on('seeking', function() {
        console.log('seek');
        timeCheck();
    });

    CLIENTVAR.popcornobj.on('ended', function() {
        $("#canvas1").hide();
//        anbado.realtime.exitVideo();
    });

    var activeThinkList = [];
    var thinkTriggerList = []; // 2차원 배열을 통해 각 초에서 생성될 이벤트를 할당함


    function timeCheck() { // 시간대에서 각 이벤트의 듀레이션을 체크함
        for (CLIENTVAR.currentEventPosition = 0; CLIENTVAR.currentEventPosition < CLIENTVAR.eventList.length; CLIENTVAR.currentEventPosition++) {
            var deltaTime = CLIENTVAR.popcornobj.currentTime() - CLIENTVAR.eventList[CLIENTVAR.currentEventPosition].clickTime; // 현재시간과 객체가 표시되기로 한 시간을 비교

            if (deltaTime <= CLIENTVAR.eventList[CLIENTVAR.currentEventPosition].displayDuration) {
                CLIENTVAR.stage.addChild(CLIENTVAR.eventList[CLIENTVAR.currentEventPosition].eaCanvasDisplayObject); // 보여주기
                CLIENTVAR.stage.update();
            }

            /* elseif 를 쓰면 잡아내지 못한다. 위에서 델타타임이 이미 보여주기로 설정되므로*/
            if ((deltaTime < 0) || (deltaTime >= CLIENTVAR.eventList[CLIENTVAR.currentEventPosition].displayDuration) || (CLIENTVAR.popcornobj.currentTime() === CLIENTVAR.popcornobj.duration())) {   // seeking bar가 생성시간 뒤에 있을시, 객체가 보여준 후 일정 시간이 지나면 비디오가 끝나면 디스플레이를 없애준다.

                CLIENTVAR.stage.removeChild(CLIENTVAR.eventList[CLIENTVAR.currentEventPosition].eaCanvasDisplayObject); // 제한 시간이 되면 캔버스에서 표현된 객체를 지움
                CLIENTVAR.stage.update();
            }
            totalCount++;
//            console.log("TOTAL : " + totalCount);
//            console.log("this time:"+this.currentTime());
        }


        if (CLIENTVAR.popcornobj.duration() === CLIENTVAR.popcornobj.currentTime()) {
            inti = window.clearInterval(inti); // 시간이 같은 경우에 초기화
        }

        //console.log("videotime:"+this.currentTime()+"inttime:"+intvidiotime );
    }
//    function timeCheck(){
//        for(var tempCounter = 0; tempCounter < CLIENTVAR.thinkTriggerList[Math.floor(CLIENTVAR.popcornobj.currentTime())].length; tempCounter++){
//            activeThinkList.push(CLIENTVAR.thinkTriggerList[Math.floor(CLIENTVAR.popcornobj.currentTime())][tempCounter]);
//            CLIENTVAR.thinkTriggerList[Math.floor(CLIENTVAR.popcornobj.currentTime())].splice(0,1);
//
//        }
//        for(var tempCounter = 0; tempCounter < activeThinkList.length; tempCounter++){
//            var deltaTime = CLIENTVAR.popcornobj.currentTime() - activeThinkList[tempCounter].clickTime; // 현재시간과 객체가 표시되기로 한 시간을 비교
//
//            if (deltaTime <= activeThinkList[tempCounter].displayDuration) {
//                CLIENTVAR.stage.addChild(activeThinkList[tempCounter].eaCanvasDisplayObject); // 보여주기
//                CLIENTVAR.stage.update();
//            }
//
//            /* elseif 를 쓰면 잡아내지 못한다. 위에서 델타타임이 이미 보여주기로 설정되므로*/
//            if ((deltaTime < 0) || deltaTime >= activeThinkList[tempCounter].displayDuration|| (CLIENTVAR.popcornobj.currentTime() === CLIENTVAR.popcornobj.duration())){   // seeking bar가 생성시간 뒤에 있을시, 객체가 보여준 후 일정 시간이 지나면 비디오가 끝나면 디스플레이를 없애준다.
//                CLIENTVAR.stage.removeChild(activeThinkList[tempCounter].eaCanvasDisplayObject); // 제한 시간이 되면 캔버스에서 표현된 객체를 지움
//                CLIENTVAR.stage.update();
//
//                CLIENTVAR.thinkTriggerList[Math.floor(activeThinkList[tempCounter].clickTime)].push(activeThinkList[tempCounter]);
//                activeThinkList.splice(0,1);
//
//            }
//        }
//
//    }


});

function graphselect() {
//    var gra=document.selectform;
    var graphTemp = $("#graphSelector").val();

    if (graphTemp === "1")//area graph
    {
        testObj.setGraphShape(1);
        testObj.drawVisualization();

    }
    else if (graphTemp === "2") //line graph
    {
        testObj.setGraphShape(2);
        testObj.drawVisualization();
        console.log("top:" + ($('#linechart').top));
    }
    else if (graphTemp === "3") {

        testObj.setGraphShape(3);
        testObj.drawVisualization();
    }
    else if (graphTemp === "4") {

        testObj.setGraphShape(4);
        testObj.drawVisualization();
    }
    else if (graphTemp === "5") {

        testObj.setGraphShape(5);
        testObj.drawVisualization();
        console.log("top:" + ($('#barchart').top));
    }

}



var timeset = 2;
function happybutton(think) {

    testObj.drawVisualization('g',think);


//    console.log('time:'+parseInt(anbadoTimeLine.currentTime));

    setTimeout(function(){

        //var offsetBarWidth=$('.nv-bar.positive.nv-bar-0-1').offset().left-$('.nv-bar.positive.nv-bar-0-0').offset().left;
        //var barName='.nv-bar.positive.nv-bar-0-'+parseInt((testObj.coverId.x.baseVal.value-70)/offsetBarWidth);
        // var barName='.nv-bar.positive.nv-bar-0-'+parseInt(testObj.currentTime);
        var barName='.nv-bar.positive.nv-bar-0-'+parseInt(think.clickTime);

        var docSelector= document.querySelector(barName);

        docSelector.setAttribute('fill','green');

        //var ba = document.getElementsByClassName("nv-linePlusBar");
        //ba[0].setAttribute("transform","translate(10,8)");


    },10)



    //testObj.positionId.setAttribute('r',5);
//      testObj.positionId.setAttribute('cy',(90-($(barName)[0].height.baseVal.value)));
//        testObj.positionId.setAttribute('cx',testObj.coverId.x.baseVal.value);
//        testObj.imageId.setAttribute('y',(90-($(barName)[0].height.baseVal.value)-testObj.imageId.height.baseVal.value));
//        testObj.imageId.setAttribute('x',testObj.coverId.x.baseVal.value-(testObj.imageId.width.baseVal.value/2));


//    console.log('current:'+(90-($(barName)[0].height.baseVal.value)));
    $('.tick.major line').remove();
    anbado.realtime.postEvent({
        user_id: userID,
        video_id: videoID,
        appeared: parseInt(think.clickTime),
        disappeared: parseInt(think.clickTime + 5),

        category: 'good',
        content:'good',
        permission:'public',
        coord: [0, 0],
        size: [CLIENTVAR.popcornobj.media.width, CLIENTVAR.popcornobj.media.height]
    });

//               for(var i=0;i<$('.tick.major line').length+1;i++)
//            {
//            $('.tick.major line')[i].y2.baseVal.value=0;
//            $('.tick.major line')[i].x2.baseVal.value=0;
//            }

//    if (timeset === 2) {
//        console.log("gray");
//        $("#happy1").css({"background": 'gray'});
//        testObj.drawVisualization('g');
//        timeset = 1;
//
//        if (timeset === 1) {
//            setTimeout(function () {
//                console.log("red");
//                $("#happy1").css({"background": 'crimson'});
//                timeset = 2;
//            }, 5000);
//            timeset = 0;
//        }
//    }

}

function sadbutton() {
    testObj.drawVisualization('b');
}

//    if (timeset === 2) {
//        testObj.drawVisualization('b');
//        timeset = 1;
//        if (timeset === 1) {
//            setTimeout(function () {
//                timeset = 2;
//            }, 5000);
//            timeset = 0;
//        }
//    }


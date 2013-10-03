/**
 * timeCheck.js
 */


document.addEventListener("DOMContentLoaded", function(){

    var inti;
    var totalCount = 0; // 이벤트들이 제대로 숫자가 생성되었는지를 확인하기 위한 부분임

    CLIENTVAR.popcornobj.on("loadeddata", function() {

        durationtime = CLIENTVAR.popcornobj.duration();

        testObj.initialize(durationtime);
        testObj.setGraphShape(5);
        testObj.drawVisualization();


    });


    CLIENTVAR.popcornobj.on("playing", function() {


        var stackedAreaObject = $('#stackedarea');
        console.log(this.media.src);
        $("#canvas1").show();

        inti = self.setInterval(function(){timeCheck()},10);


        CLIENTVAR.popcornobj.on("timeupdate", function(){

//            anbado.timeline.getCurrentTime(CLIENTVAR.popcornobj.currentTime());
//            anbado.timeline.tooltip(stackedAreaObject)
        });
        // socket.emit('sample',{hello: CLIENTVAR.popcornobj.currentTime()});

    });
    CLIENTVAR.popcornobj.on("seeking", function(){
        timeCheck();
    });

    CLIENTVAR.popcornobj.on("ended", function(){
        $("#canvas1").hide();
    });


    function timeCheck(){ // 시간대에서 각 이벤트의 듀레이션을 체크함
        for(CLIENTVAR.currentEventPosition = 0; CLIENTVAR.currentEventPosition<CLIENTVAR.eventList.length; CLIENTVAR.currentEventPosition++){
            var deltaTime = CLIENTVAR.popcornobj.currentTime()-CLIENTVAR.eventList[CLIENTVAR.currentEventPosition].eventVideoClickTime; // 현재시간과 객체가 표시되기로 한 시간을 비교

            if(deltaTime <= CLIENTVAR.eventList[CLIENTVAR.currentEventPosition].eventVideoClickDuration ){
                CLIENTVAR.stage.addChild(CLIENTVAR.eventList[CLIENTVAR.currentEventPosition].eaCanvasDisplayObject); // 보여주기
                CLIENTVAR.stage.update();
            }

            /* elseif 를 쓰면 잡아내지 못한다. 위에서 델타타임이 이미 보여주기로 설정되므로*/
            if((deltaTime<0)||(deltaTime>=CLIENTVAR.eventList[CLIENTVAR.currentEventPosition].eventVideoClickDuration)||(CLIENTVAR.popcornobj.currentTime()===CLIENTVAR.popcornobj.duration())){   // seeking bar가 생성시간 뒤에 있을시, 객체가 보여준 후 일정 시간이 지나면 비디오가 끝나면 디스플레이를 없애준다.

                CLIENTVAR.stage.removeChild(CLIENTVAR.eventList[CLIENTVAR.currentEventPosition].eaCanvasDisplayObject); // 제한 시간이 되면 캔버스에서 표현된 객체를 지움
                CLIENTVAR.stage.update();
            }
            totalCount++;
//            console.log("TOTAL : " + totalCount);
//            console.log("this time:"+this.currentTime());
        }


        if(CLIENTVAR.popcornobj.duration() === CLIENTVAR.popcornobj.currentTime())
        {
            inti=window.clearInterval(inti); // 시간이 같은 경우에 초기화
        }

        //console.log("vidiotime:"+this.currentTime()+"inttime:"+intvidiotime );
    }
});
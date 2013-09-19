/**
 * webrtc refactoring
 * @type {*|{}}
 */


var anbado= window.anbado ||{};


jQuery.extend(true,anbado,(function($){

    /**
     *  n개의 녹화된 비디오 저장
     * @type {Array}
     */
    var videoarray=[];
    /**
     * 녹화된 비디오의 넘버링
     * @type {number}
     */
    var videoTagnum=0;

    /**
     * n개의 캔버스 저장
     * @type {Array}
     */
    var dum=[];

    /**
     * n 개의 스트림을 받아와서 로컬로 저장
     * @type {Array}
     */
    var localStream =[];

    /**
     * 현재 비디오의 녹화된 비디오와 상태의 넘버링
     * 1 이면 첫번째 녹화 된 비디오 구간
     * n은 offset값
     * s 는 녹화 가되지 않은 구간 에서의 리턴 값
     * @type {string}
     */
    var tagNumber='n';

    /**
     * 컴파일 하는거 ? whammy에 서 하는데 잘모르겠음 일단 배열로 만듬
     * @type {Array}
     */
    var compile =[];
    /**
     * stop 에쓰이는 아이디
     * @type {number}
     */
    var requestId = 0;
    /**
     * whammu에서 객체를 불러옴 15 프레임 늘리면 녹화된 영상이 빠르게 나옴
     * @type {Whammy.Video}
     */
    var whammy = new Whammy.Video(15);
    /**
     * 카메라 녹화 상태
     * 1= test 2= 녹화중 3= 녹화 끝내고 감시
     * @type {number}
     */
    var camRecordsta=0;//0=none, 1=record 2=offset
    /**
     * n개의 녹화된 영상의 시작된 시간을 저장
     * @type {Array}
     */
    var camRecordStartTime=[];

    /**
     * 비디오 넘버링
     * @type {number}
     */
    var viddom=0;
    /**
     * 비디오 html id
     * @type {string}
     */
    var tempID = "test"+viddom;
    /**
     * canvas htl id
     * @type {string}
     */
    var cnavasID="canvas"+viddom;
    /**
     * 마지막으로 저장된 비디오의 넘버
     * @type {number}
     */
    var lastsavedvid=0;



    var dummy=function()
    {
        alert("hello");

    }

    /**
     * 녹화 시작하는 함수
     */
    var startRecord =function() {
        //videoarray[videoTagnum] = document.getElementById(tempID);
        dum[videoTagnum]=document.getElementById(cnavasID);
        var context = 0;
        context = dum[videoTagnum].getContext("2d");
        camRecordsta=2;
        if(localStream[videoTagnum]) {

            //canvas.width = videoarray[videoTagnum].videoWidth;
            //canvas.height = videoarray[videoTagnum].videoHeight;

            dum[videoTagnum].width = videoarray[videoTagnum].videoWidth;
            dum[videoTagnum].height = videoarray[videoTagnum].videoHeight;

            function animation (timestamp) {
                context.drawImage(videoarray[videoTagnum], 0, 0);
                whammy.add(dum[videoTagnum]);
                handle = window.requestAnimationFrame(animation);
            };

            animation(Date.now());
        }
        camRecordStartTime[videoTagnum]=CLIENTVAR.popcornobj.currentTime();
    };

    /**
     * 카메라 on
     */
    var onCam = function() {

        $("#"+"test"+(viddom-1)).hide();
        $("#"+tempID).show();
        videoarray[videoTagnum] = document.getElementById(tempID);

        camRecordsta=0;
        /*
         getUserMedia ->
         chrome -> webkitGetUserMedia
         firefox -> mozGetUserMedia
         opera -> getUserMedia
         ie -> msGetUserMedia
         */
        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );

        if (!navigator.getUserMedia){
            alert('지원이 되지 않는 브라우저 입니다.');
            return ;
        }

        navigator.getUserMedia({
                video : true,
                audio : false
            },
            function(stream) {//onSuccess
                videoarray[videoTagnum].src = window.URL.createObjectURL(stream);
                localStream[videoTagnum] = stream;
                videoarray[videoTagnum].onloadedmetadata = function(e) {
                    console.log(e);
                };
                videoarray[videoTagnum].autoplay = true;
            },
            function(err) { //onError
                console.log(err);
            }
        );

    };
    /**
     * 카메라 끄고 녹화 종료하기
     */
   var stopRecord =function() {
        if (requestId) {
            window.cancelAnimationFrame(requestId);
            requestId = 0;
        }
        compile[videoTagnum] = whammy.compile();

        videoarray[videoTagnum].src = window.URL.createObjectURL(compile[videoTagnum]);

        videoarray[videoTagnum].pause();

        localStream[videoTagnum].stop();

        camRecordsta=3;


        //camRecordEndTime[videoTagnum]=CLIENTVAR.popcornobj.currentTime();


    };

    /**
     * 새로운  dom(video와 cnavas )을 아이디를 받아서 생성
     */
    var testfunc=function(){

        $("vidtag").append("<video style='width:340px;height:280px' id = " + tempID + " controls/>");
        $("vidtag").append("<canvas id="+cnavasID+" style='display:none'/>");
    };

    /**
     * 감지된 시간대의 녹화된 동영상의 상태를 확인하여 싱크를 맞추어 준다.
     * @param n 동영상의 넘버링을 받아넘김
     */
   var testcall=function(n){

        if(n===0)
        {
            if(videoarray[lastsavedvid].paused&&!(CLIENTVAR.popcornobj.paused()))
            {
                videoarray[lastsavedvid].currentTime=(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[0]);
                videoarray[lastsavedvid].play();
            }

            else if(CLIENTVAR.popcornobj.paused())
            {
                videoarray[lastsavedvid].currentTime=(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[0]);
                videoarray[lastsavedvid].pause();
            }

            if(videoarray[lastsavedvid].currentTime+0.4>=videoarray[0].duration)
            {tagNumber='s';videoarray[lastsavedvid].pause();console.log("stop00");}
        }

        else if(n>0)
        {
            if(videoarray[lastsavedvid].paused&&!(CLIENTVAR.popcornobj.paused()))//녹화정지그리고 동영상 플레이시
            {
                videoarray[lastsavedvid].currentTime=(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[n])+videoarray[n-1].duration;
                videoarray[lastsavedvid].play();
            }
            else if(CLIENTVAR.popcornobj.paused())// 동영상 정지시
            {
                videoarray[lastsavedvid].currentTime=(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[n])+videoarray[n-1].duration;
                videoarray[lastsavedvid].pause();
            }

            if((videoarray[lastsavedvid].currentTime+0.4)>=videoarray[n].duration)
            {tagNumber='s';videoarray[lastsavedvid].pause();console.log("stop11");}
        }
        else if(n=='s')
        {


        }

    };

    /**
     * 녹화할 동영상의 넘버링을 증가시키고 이전의 돔을 숨긴다. 새로운 돔을 생성한다.
     */
    var num1=function()
    {
        $("#"+tempID).hide();
        lastsavedvid=viddom;
        viddom++;
        videoTagnum++;
        tempID = "test"+viddom;
        $("vidtag").append("<video style='width:340px;height:280px' id = " + tempID + " controls/>");
        $("vidtag").append("<canvas id="+cnavasID+" style='display:none'/>");
        $("#"+"test"+(viddom-1)).show();
        $("#"+tempID).hide();
        tagNumber='s';

    }


    var sinkRecord=function()//단순히 basic video와 videotag를 sink 시켜주는 부분
    {

        if(camRecordsta===1)
        {
            console.log("videotag current time:"+videoarray[videoTagnum].currentTime);
        }
        if(camRecordsta===2){
            if( (CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[videoTagnum])>=10)
            {stopRecord();num1();}
        }
        if(camRecordsta===3)
        {

            for(var i=0;i<lastsavedvid+1;i++)
            {

                if(i===0)
                {
                    if((CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[i])>0&&(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[i])<=videoarray[i].duration)
                    {tagNumber=i;console.log("time"+i);}// 애가 동영상과 처음 녹화시간을 비교해서 타임 인터벌 상태 알려
                }

                else if(i>0)
                {
                    //compiledTime[i]=videoarray[i-1].duration
                    if((CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[i])>0&&(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[i])<=(videoarray[i].duration-videoarray[i-1].duration))
                    {tagNumber=i;console.log("time"+i);}
                }

            }


            testcall(tagNumber);

        }

//console.log("statepause"+videoarray[videoTagnum].paused);
//CLIENTVAR.popcornobj.duration();// 동영상 전체시간
//CLIENTVAR.popcornobj.currentTime();// 동영상 현재시간
//video.duration//녹화된 동영상 모든시간
//video.currentTime// 녹화된 동영상 현재시간 & 위치 조절가능
//video.paused//videotag paused상태에대한 true false 상태 return
    }


    return {
        webrtc : {
            dummy:dummy,
            onCam:onCam,
            startRecord:startRecord,
            sinkRecord:sinkRecord,
            testfunc:testfunc
        }
}



})(jQuery));




//
//dummy=function()
//{
////    $("#"+"test"+(viddom-1)).show();
////    $("#"+tempID).hide();
////    tagNumber='s';
//    alert("hello");
//    //console.log("state:"+camRecordStartTime[videoTagnum]);
////videoarray[videoTagnum].currentTime=0;
////videoarray[videoTagnum].play();
//
//
//}
//
//
//
//
//console.log("first");
//
//// (function() {
//    //var start = document.getElementById('record-video');
//     //var stop = document.getElementById('stop-video');
//     var videoarray=[];
//     var videoTagnum=0
//     var video
//    //var video = document.getElementById('test');
//    //var cameraOn = document.getElementById('camera-on');
//    //var canvas = document.getElementById('canvas');
//    var dum=[];
//
//    //var img = document.querySelector('img');
//    var localStream =[];
//
//var tagNumber='n';
//
//    //var result = document.getElementById('test');
////var compile =0;
//var compile =[];
//// animation id
//var requestId = 0;
//// whammy is webm encoder.
//var whammy = new Whammy.Video(15);
//var camRecordsta=0;//0=none, 1=record 2=offset
//var camRecordStartTime=[];
//var camRecordEndTime=[];
//var viddom=0;
//var tempID = "test"+viddom;
//var cnavasID="canvas"+viddom;
//var lastsavedvid=0;
//console.log("last");
////start.onclick = function() {
//
//startRecord =function() {
//  //videoarray[videoTagnum] = document.getElementById(tempID);
//  dum[videoTagnum]=document.getElementById(cnavasID);
//  var context = 0;
//  context = dum[videoTagnum].getContext("2d");
//  camRecordsta=2;
//  if(localStream[videoTagnum]) {
//
//      //canvas.width = videoarray[videoTagnum].videoWidth;
//      //canvas.height = videoarray[videoTagnum].videoHeight;
//
//      dum[videoTagnum].width = videoarray[videoTagnum].videoWidth;
//      dum[videoTagnum].height = videoarray[videoTagnum].videoHeight;
//
//      function animation (timestamp) {
//                context.drawImage(videoarray[videoTagnum], 0, 0);
//                whammy.add(dum[videoTagnum]);
//                handle = window.requestAnimationFrame(animation);
//      };
//
//            animation(Date.now());
//    }
//    camRecordStartTime[videoTagnum]=CLIENTVAR.popcornobj.currentTime();
//  };
//
//  onCam = function() {
//
//      $("#"+"test"+(viddom-1)).hide();
//      $("#"+tempID).show();
// videoarray[videoTagnum] = document.getElementById(tempID);
//
//    camRecordsta=0;
//    /*
//     getUserMedia ->
//     chrome -> webkitGetUserMedia
//     firefox -> mozGetUserMedia
//     opera -> getUserMedia
//     ie -> msGetUserMedia
//     */
//     navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );
//
//     if (!navigator.getUserMedia){
//        alert('지원이 되지 않는 브라우저 입니다.');
//        return ;
//    }
//
//    navigator.getUserMedia({
//        video : true,
//        audio : false
//    },
//    function(stream) {//onSuccess
//        videoarray[videoTagnum].src = window.URL.createObjectURL(stream);
//        localStream[videoTagnum] = stream;
//        videoarray[videoTagnum].onloadedmetadata = function(e) {
//            console.log(e);
//        };
//        videoarray[videoTagnum].autoplay = true;
//    },
//    function(err) { //onError
//        console.log(err);
//    }
//    );
//
//};
//
//// snapshot.onclick = function() {
////     if (!localStream) console.log('test');
////     canvas.width = video.videoWidth;
////     canvas.height = video.videoHeight;
//
////     context.drawImage(video, 0, 0);
////     img.src = canvas.toDataURL('image/png');
//// };
//
//
//
////stop.onclick = function() {
//  stopRecord =function() {
//    if (requestId) {
//        window.cancelAnimationFrame(requestId);
//        requestId = 0;
//    }
//    compile[videoTagnum] = whammy.compile();
//
//     videoarray[videoTagnum].src = window.URL.createObjectURL(compile[videoTagnum]);
//
//videoarray[videoTagnum].pause();
//
// localStream[videoTagnum].stop();
//
//    camRecordsta=3;
//
////console.log("hahahaha"+videoarray[videoTagnum].duration);
////console.log("sub:"+(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[videoTagnum]));
//
//  camRecordEndTime[videoTagnum]=CLIENTVAR.popcornobj.currentTime();
//
//
//};
//
//testfunc=function(){
////videoTagnum++;
////console.log("tagnum"+videoTagnum);
//    //$("#"+"test"+(viddom-1)).hide();
//   $("vidtag").append("<video style='width:340px;height:280px' id = " + tempID + " controls/>");
//   $("vidtag").append("<canvas id="+cnavasID+" style='display:none'/>");
//  //$("vidtag").append("<canvas style='display:none' id='canvas'/>");
//// viddom++;
//}
//
//testcall=function(n){
////console.log("position:"+n);
//
//if(n===0)
//{
//  if(videoarray[lastsavedvid].paused&&!(CLIENTVAR.popcornobj.paused()))
//  {
//  videoarray[lastsavedvid].currentTime=(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[0]);
//  videoarray[lastsavedvid].play();
//  }
//
//  else if(CLIENTVAR.popcornobj.paused())
//  {
//  videoarray[lastsavedvid].currentTime=(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[0]);
//  videoarray[lastsavedvid].pause();
//  }
//
//    if(videoarray[lastsavedvid].currentTime+0.4>=videoarray[0].duration)
//     {tagNumber='s';videoarray[lastsavedvid].pause();console.log("stop00");}
//}
//
////else if(n===1)
////{
////   if(videoarray[lastsavedvid].paused&&!(CLIENTVAR.popcornobj.paused()))//녹화정지그리고 동영상 플레이시
////  {
////  videoarray[lastsavedvid].currentTime=(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[1])+videoarray[0].duration;
////  videoarray[lastsavedvid].play();
////  }
////   else if(CLIENTVAR.popcornobj.paused())// 동영상 정지시
////  {
////  videoarray[lastsavedvid].currentTime=(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[1])+videoarray[0].duration;
////  videoarray[lastsavedvid].pause();
////  }
////
////    if((videoarray[lastsavedvid].currentTime+0.4)>=videoarray[1].duration)
////   {tagNumber='s';videoarray[lastsavedvid].pause();console.log("stop11");}
////}
//    else if(n>0)
//    {
//        if(videoarray[lastsavedvid].paused&&!(CLIENTVAR.popcornobj.paused()))//녹화정지그리고 동영상 플레이시
//        {
//            videoarray[lastsavedvid].currentTime=(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[n])+videoarray[n-1].duration;
//            videoarray[lastsavedvid].play();
//        }
//        else if(CLIENTVAR.popcornobj.paused())// 동영상 정지시
//        {
//            videoarray[lastsavedvid].currentTime=(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[n])+videoarray[n-1].duration;
//            videoarray[lastsavedvid].pause();
//        }
//
//        if((videoarray[lastsavedvid].currentTime+0.4)>=videoarray[n].duration)
//        {tagNumber='s';videoarray[lastsavedvid].pause();console.log("stop11");}
//    }
//else if(n=='s')
//{
//  //videoarray[videoTagnum].currentTime=0;
//
//  // videoarray[videoTagnum].currentTime=0;
//  // videoarray[videoTagnum].pause();
//  // localStream[videoTagnum].stop();
//
//}
//
////videoarray[videoTagnum].currentTime=(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[videoTagnum]);
////videoarray[videoTagnum].play();
//
//
//
//
////camRecordsta=0;
////camRecordsta=1;
//
////console.log("hahahaha"+video.duration);
////console.log("sub:"+(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime));
////console.log("state:"+video.src);
//// video.src = window.URL.createObjectURL(compile);
//// video.pause();
////CLIENTVAR.popcornobj.duration();// 동영상 전체시간
////CLIENTVAR.popcornobj.currentTime();// 동영상 현재시간
////video.duration//녹화된 동영상 모든시간
////video.currentTime// 녹화된 동영상 현재시간 & 위치 조절가능
//
////video.currentTime=;
// //console.log("hahaha"+video.currentTime);
//
////video.play();
//
// //startTime = (new Date().getTime()-startTime)/1000;
////console.log("data"+startTime);
//
//// requestId = 0;
////     var compile = whammy.compile();
////     var result = document.getElementById('test');
////     result.src = window.URL.createObjectURL(compile);
////     result.autoplay = true;
//}
//
//num1=function()
//{
//   $("#"+tempID).hide();
//    lastsavedvid=viddom;
//viddom++;
//videoTagnum++;
//tempID = "test"+viddom;
//    $("vidtag").append("<video style='width:340px;height:280px' id = " + tempID + " controls/>");
//    $("vidtag").append("<canvas id="+cnavasID+" style='display:none'/>");
//    $("#"+"test"+(viddom-1)).show();
//    $("#"+tempID).hide();
//    tagNumber='s';
//   // $("#"+"test"+(viddom-1)).hide();
// //cnavasID="canvas"+viddom;
//    //$("#"+"test"+(viddom)).show();
//
//}
//
//num0=function()
//{
//   $("#"+tempID).hide();
//viddom=0;
//videoTagnum=0;
//tempID = "test"+viddom;
// cnavasID="canvas"+viddom;
//}
//
//
////var compiledTime=[];
//
//
//sinkRecord=function()//단순히 basic video와 videotag를 sink 시켜주는 부분
//{
//
//
//
//  if(camRecordsta===1)
//  {
//    console.log("videotag current time:"+videoarray[videoTagnum].currentTime);
//  }
//  if(camRecordsta===2){
//  if( (CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[videoTagnum])>=10)
//   {stopRecord();num1();}
//  }
//  if(camRecordsta===3)
//  {
//
////  if((CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[0])>0&&(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[0])<=videoarray[0].duration)
////    {tagNumber=0;console.log("0time");}// 애가 동영상과 처음 녹화시간을 비교해서 타임 인터벌 상태 알려
////  else if((CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[1])>0&&(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[1])<=(videoarray[1].duration-videoarray[0].duration))
////    {tagNumber=1;console.log("1time");}
//
//      for(var i=0;i<lastsavedvid+1;i++)
//      {
//
//        if(i===0)
//        {
//            if((CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[i])>0&&(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[i])<=videoarray[i].duration)
//            {tagNumber=i;console.log("time"+i);}// 애가 동영상과 처음 녹화시간을 비교해서 타임 인터벌 상태 알려
//        }
//
//        else if(i>0)
//        {
//            //compiledTime[i]=videoarray[i-1].duration
//            if((CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[i])>0&&(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[i])<=(videoarray[i].duration-videoarray[i-1].duration))
//            {tagNumber=i;console.log("time"+i);}
//        }
////        else if(i===1)
////            {
////                //compiledTime[i]=compiledTime[i-1]+videoarray[i-1].duration
////                if((CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[i])>0&&(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[i])<=(videoarray[i].duration-videoarray[i-1].duration))
////                {tagNumber=i;console.log("time"+i);}
////            }
////        else if(i===2)
////        {
////            //compiledTime[i]=videoarray[i-1].duration
////            if((CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[i])>0&&(CLIENTVAR.popcornobj.currentTime()-camRecordStartTime[i])<=(videoarray[i].duration-videoarray[i-1].duration))
////            {tagNumber=i;console.log("time"+i);}
////        }
//      }
//
//
//    testcall(tagNumber);
//
//   }
//
////console.log("statepause"+videoarray[videoTagnum].paused);
////CLIENTVAR.popcornobj.duration();// 동영상 전체시간
////CLIENTVAR.popcornobj.currentTime();// 동영상 현재시간
////video.duration//녹화된 동영상 모든시간
////video.currentTime// 녹화된 동영상 현재시간 & 위치 조절가능
////video.paused//videotag paused상태에대한 true false 상태 return
//}
//
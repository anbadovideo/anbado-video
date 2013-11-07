/**
 * @author : haksudol
 * @since : 0.1
 *
 * Copyright 2013 anbado video

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// TODO : 유저 프로파일 리스트 만들어 놓기. Participants



if(userID === undefined){
    var userID = 1;
}
if(videoID === undefined){
    var videoID = 1;
}


var data1 = anbado.restful.getUserInfo(userID);
var data2 = anbado.restful.getVideoInfo(videoID);
var data3 = anbado.restful.getParticipants(videoID);


$(window).bind('beforeunload', function(){
    anbado.realtime.exitVideo();
});

$(window).unload(function(){
    anbado.realtime.exitVideo();
});
document.addEventListener("DOMContentLoaded", function(){


    /**
     * restful api를 이용하여 현재의 사용자 정보, 비디오 정보, 이 비디오에 참여한 사람들을 받아옴
     *
     * @type {json}
     */
//
//    console.log(data1);
//    console.log(data2);
//    console.log(data3);

//    hidePanel(); // 입력 패널은 DOM객체이므로 이를 보이지 않도록 한다. TODO: 동적 생성으로 하여 이 부분이 필요하지 않도록 하기


    $("#player1").remove();





//    $("#player").append("<video id='videoEmbed' controls ></video>");    // 요걸로 하면 정렬됨
//    $("#player").append("<video id='videoEmbed' controls style='position: absolute;'></video>");


//    $("#canvas1").position({left:0, top:0});



//    $("#canvas1").offset({top: 0,left:0});

//    $("#youtube").offset($("#vid").offset);


    videoPositioning('#player', 880, 540);


//    CLIENTVAR.popcornobj= Popcorn.smart( "#youtube", "http://download.ted.com/talks/DanDennett_2003-480p-pt-br.mp4" );

    var video_id = data2.video.provider_vid;
    var provider = data2.video.provider;

    if(provider === 'youtube'){

        CLIENTVAR.popcornobj= Popcorn.youtube( "#videoEmbed", "http://www.youtube.com/embed/"+ video_id +"?hd=1" + "&iv_load_policy=3" );
    }
    else if(provider === 'vimeo'){
        CLIENTVAR.popcornobj= Popcorn.vimeo( "#videoEmbed", "vimeo.com/"+ video_id);
    }

    else if (provider === 'anbado'){
        CLIENTVAR.popcornobj= Popcorn.smart( "#videoEmbed", data2.video.provider_vid.toString());
    }



    jqVideoEmbed = $('#videoEmbed');
    CLIENTVAR.popcornobj.media.width = parseInt(jqVideoEmbed.css('width'));
    CLIENTVAR.popcornobj.media.height = parseInt(jqVideoEmbed.css('height'));
    CLIENTVAR.popcornobj.controls(false);



    CLIENTVAR.popcornobj.on("loadeddata",function(){
        for(var tempCounter = 0; tempCounter <= Math.floor(CLIENTVAR.popcornobj.duration()); tempCounter++){
            CLIENTVAR.thinkTriggerList[tempCounter] = []; // 2차원 배열 할당을 위해 할당함. 각 초에서 시작할 이벤트를 모두 기록한다.
        }

        anbado.realtime.enterVideo(videoID,userID);

        anbado.realtime.onEvent(function(evt){ // 이벤트 도착 처리 핸들러
            var tempType = "";
            if(evt.category == "text"){
                tempType = "textinput1"

            }
            else if(evt.category === 'image'){

                tempType = 'image';

            }
//            console.log("evt.userid is " + evt.user_id);
            var thinkOwner = anbado.restful.getUserInfo(evt.user_id).user;

            var think = {  // 전역 이벤트 없이 통과해가며 완성됨

                ID : CLIENTVAR.totalEvent,
                step :3, // 0은 생성상태. 1은 생성 중. 2는 생성완료. 3은 외부 이벤트

                ownerID : evt.user_id,

                ownerName : thinkOwner.name,
                profileImg : new Image(),

                clickTime : evt.appeared, // 플레어에서의 currentTime을 받는 것으로. 상대 시간
                occuredAbsoluteTime : evt.registered, // 이벤트가 생성된 현재 시간.(실제 현실 시간, 이를 이용해 사용자가 남긴 반응들을 시점별로 정렬이 가능)

                displayDuration : evt.disappeared - evt.appeared, // 얼마나 지속되는지
                x : evt.coord[0] ,  // 화면의 디스플레이를 표시하도록. 실제로 디스플레이 되는 것은 eaCanvasDisplayObject이나 좌표값은 보존한다.
                y : evt.coord[1] ,
                timelineOffset : {},  // 타임라인에서 얼마나 떨어져 있는가?
                category : tempType, // think type e.g text, emoticon, image, button action, webcam
                content : evt.content, // 이모티콘인 경우에 주소를
                permission : evt.permission,
                secUnit : {},// 몇번째 유닛인지?
                eaCanvasObject : {}, // easeljs 객체를 추가해주기 위해서 컨테이너를 하위 속성으로 가지고 있음.

                hasParent : false, // 이것이 최상위 이벤트인가? 밑에 댓글이 달려있는가? 부모 이벤트가 없다면 최상위 이벤트(이거나 독립 이벤트)로 간주
                parent : {}, // 이미 달린 반응에 클릭해서 남기는 경우 그에 대한 부모 이벤트 아이디를 저장함 TODO: 저장할 필요가 있나? 이미 아이디를 가지는데 객체를 저장할 필요는 없지 않을까?
                parentID: -1 , // 0 인 경우에 단독이고, 부모 이벤트 아이디가 있는 경우
                childrenIDarray:[] // 자식들이 생기게 되면 이를 표현해줌. 객체 배열을 가지지 말고 eventList에서 참조할 수 있도록 아이디만 가지고 가도록
            }; // 이벤트의 생성시점



            think.profileImg.src = thinkOwner.profile_image;
            CLIENTVAR.totalEvent++;
            think.profileImg.onload = function(){
                thinkGenerate(think)
            };

        });
    });

    CLIENTVAR.pageGenerationTime = new Date(); // 페이지 생성타임을 저장하고 이를 기준시로 사용함.
    drawTimelineVisualization();



    var youtubeID = CLIENTVAR.popcornobj.media.src.split('.be/')[1];
    if(youtubeID === undefined){
        youtubeID = CLIENTVAR.popcornobj.media.src.split('?v=' +
            '')[1];
    }

    if(youtubeID !== undefined){


        // Thumbnail 부분 만들어내기
        var youtubeThumbnailsAddr = [];
//    youtubeThumbnailsAddr.push("http://img.youtube.com/vi/" + youtubeID + "/0.jpg");
        youtubeThumbnailsAddr.push("http://img.youtube.com/vi/" + youtubeID + "/1.jpg");
        youtubeThumbnailsAddr.push("http://img.youtube.com/vi/" + youtubeID + "/2.jpg");
        youtubeThumbnailsAddr.push("http://img.youtube.com/vi/" + youtubeID + "/3.jpg");

//        $("#thumbnailPanorama").append("<img src = '"+ youtubeThumbnailsAddr[0] + "' style='width: 30%;' />" );
//        $("#thumbnailPanorama").append("<img src = '"+ youtubeThumbnailsAddr[1] + "' style='width: 30%;' />" );
//        $("#thumbnailPanorama").append("<img src = '"+ youtubeThumbnailsAddr[2] + "' style='width: 30%;' />" );
//    $("#thumbnailPanorama").append("<img src = '"+ youtubeThumbnailsAddr[3] + "'/>");
    }
    CLIENTVAR.canvaslayer = document.getElementById("canvas1");
//    console.log("canvas layer : " + CLIENTVAR.canvaslayer.width);
//    console.log("canvas layer : " + document.getElementById("canvas1"));
//    CLIENTVAR.canvaslayer.onclick = displayInputPanel; // 캔버스 온클릭의 경우 스테이지에서의 고저차가 무시되어버린다는 문제점이 발생한다. 원래 이를 캔버스 이벤트로 둔것은 인풋 패널을 위치시킬 때 easel 객체가 너무 많이 생성되었기 때문이었다. (그래서 인풋 패널을 놓기 위해 이렇게 생성) 하지만 stage의 위아래가 구분안되는 문제가 있어, stage이벤트로 가야한다(대댓글의 문제에서 특히)


    CLIENTVAR.stage = new createjs.Stage(CLIENTVAR.canvaslayer);
//    CLIENTVAR.stage.onMouseDown = saveCoord; // 스테이지 자체에 대한 클릭을 받으면 객체 위에 올려지는 객체에 대한 클릭을 받지 못하게된다(이벤트가 stage클릭이 우선이므로)
//    CLIENTVAR.stage.addEventListener("click", displayInputPanel);


    CLIENTVAR.canvas_bar = document.getElementById("canvas2");
    CLIENTVAR.stage_bar = new createjs.Stage(CLIENTVAR.canvas_bar); // 하단 차트 표시할 부분

    CLIENTVAR.canvas3 = document.getElementById("canvasMyChat");
    CLIENTVAR.canvas4 = document.getElementById("canvasFriendChat");
    CLIENTVAR.chatLeftStage = new createjs.Stage(CLIENTVAR.canvas3);
    CLIENTVAR.chatRightStage = new createjs.Stage(CLIENTVAR.canvas4);




//    var myGraphics = new createjs.Shape();
//    myGraphics.graphics.beginFill("#28343C").drawRect(0,0,640,480);
//
//    CLIENTVAR.stage.addChild(myGraphics);
//    CLIENTVAR.stage.update();
//
//    myGraphics = new createjs.Shape();
//    myGraphics.compositeOration='destination-out';
//    myGraphics.graphics.beginStroke("#000").beginFill("#28343C").arc(300,240, 220, 0, Math.PI*2);
////    myGraphics.graphics.beginStroke("#F00").beginFill("#28343c").drawCircle(300,240, 20);
//
//    CLIENTVAR.stage.addChild(myGraphics);
//    CLIENTVAR.stage.update();
//
//    myGraphics = new createjs.Shape(); // 외부 써클을 위해
//
//
//    pie = 0;
//    setInterval(function(){
//
//        myGraphics.graphics.beginStroke("#F00").setStrokeStyle(12,'round', 'round').arc(300,240, 240, 0, Math.PI*(2)*pie);
//
//        CLIENTVAR.stage.addChildAt(myGraphics,1);
//        CLIENTVAR.stage.update();
//        pie += CLIENTVAR.popcornobj.currentTime()  * Math.PI/CLIENTVAR.popcornobj.duration();
//    }, pie += CLIENTVAR.popcornobj.currentTime()  * Math.PI/CLIENTVAR.popcornobj.duration());

    CLIENTVAR.stageMousePanelWrapper = new createjs.Shape();

    CLIENTVAR.stageMousePanelWrapper.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("rgba(0,0,0,1)").drawRect(0,0, CLIENTVAR.canvaslayer.width,CLIENTVAR.canvaslayer.height)); // 투명 레이어에 덮어씌우기 위해 히트 아레아 추가

    CLIENTVAR.stageMousePanelWrapper.regX = 0;
    CLIENTVAR.stageMousePanelWrapper.regY = 0;
    CLIENTVAR.stageMousePanelWrapper.addEventListener("click", saveCoord);
    CLIENTVAR.stage.addChild(CLIENTVAR.stageMousePanelWrapper); // 뒷 배경과 무관하게 넣어주기 위해서 백패널을 이용함
    CLIENTVAR.stage.update();

});



/**
 * 화면에 DOM에 비디오를 표시함
 * @param targetDOM  : 페이지에서 표시할 DOM의 위치. jQuery 타입으로 표시함
 * @param videoWidth : 비디오의 가로 크기
 * @param videoHeight : 비디오의 세로 크기
 */

var videoPositioning = function(targetDOM, videoWidth, videoHeight){

    var jqTargetDOM = $(targetDOM);



//    $(targetDOM).append('<div id="videoEmbed" style="position: relative;width:1080px;height:1040px;margin-left:auto;margin-right:auto;"></div>');
    jqTargetDOM.append('<div id="videoEmbed" style="position: relative;width:'+ videoWidth+';height:' + videoHeight +';margin-left:auto;margin-right:auto;"></div>');

//    $("#player").append('<div id="videoEmbed"></div>');



//    console.log("player offset is " + $("#player").offset());
//    $("#videoEmbed").css({"left":0, "top":0});
    var jqVideoEmbed =$("#videoEmbed");
    jqVideoEmbed.css({"width":videoWidth, "height":videoHeight});
//    $("#videoEmbed").offset({left:500, top:300});


    // OK code
//    $(targetDOM).append('<canvas id="canvas1" width = "'+jqVideoEmbed.width()+'px" height = "'+jqVideoEmbed.height()+'px" style="position:relative; z-index:20; margin-left:auto; margin-right:auto;">canvas</canvas>');
//    $(targetDOM).append('<div id="mytimeline" width = "'+jqVideoEmbed.width()+'px" height = "'+jqVideoEmbed.height()+'px" style="position:relative; z-index:20; margin-left:auto; margin-right:auto;">summaryPanel</div>');

    // experiment
//    $(targetDOM).append('<canvas id="canvas1" width = "'+jqVideoEmbed.width()+'px" height = "'+jqVideoEmbed.height()+'px" style="position:relative; z-index:20; margin-left:auto; margin-right:auto;">canvas</canvas>'); // OK code for canvas positioning


    if(data2.video.provider === 'youtube'){
        jqTargetDOM.append('<canvas id="canvas1" width = "'+videoWidth+'px" height = "'+(videoHeight-100)+'px" style="position:relative; width:'+videoWidth+'px;'+'height:'+(videoHeight-100)+'px;'+'z-index:20; margin-left:auto; margin-right:auto;">canvas</canvas>');

    }
    else{
        jqTargetDOM.append('<canvas id="canvas1" width = "'+videoWidth+'px" height = "'+videoHeight+'px" style="position:relative; width:'+videoWidth+'px;'+'height:'+videoHeight+'px;'+'z-index:20; margin-left:auto; margin-right:auto;">canvas</canvas>');
    }

    jqTargetDOM.append('<div id="mytimeline" width = "'+jqVideoEmbed.width()+'px" height = "'+jqVideoEmbed.height()+'px" style="position:relative; z-index:20; margin-left:auto; margin-right:auto;">summaryPanel</div>');

//    $("#player").append("<canvas id='canvas1' align='center' width = '"+$("#videoEmbed").width()+"height = '"+($("#videoEmbed").height()-80)+"px'></canvas>");

//    $("#canvas1").css({});

    $('#canvas1').offset($('#videoEmbed').offset());
    $('#mytimeline').offset($('#videoEmbed').offset());
    $('#mytimeline').hide();



}


var InputPanel = function(){



    $("#textinput1").hide();
    $("#emoticonPanel").hide();
    CLIENTVAR.inputPanelShow = false;


    this.createPanel = function(eventObject){
        var jqBody = $('body');
        jqBody.append('<input id="textinput1" type="text" placeholder="생각을 남겨보세요" onkeydown="this.style.width = ((this.value.length + 3) * 12) + \'px\';" style = "font-size:14px"/>' );
        jqBody.append('' +
            '<div id="emoticonPanel">'+
            '<input id="emoticon0" type="image" src="data:image/png;base64,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" value="emo1" class="emoticon_button"></input>'
            +
            '<input id="emoticon1" type="image" src="data:image/png;base64,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" value="emo2" class="emoticon_button"></input>'
            +
            '<input id="emoticon2" type="image" src="data:image/png;base64,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" value="emo3" class="emoticon_button"></input>'
            +
            '<input id="emoticon3" type="image" src="data:image/png;base64,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" value="emo4" class="emoticon_button"></input>'
            + '</div>'
        );

        var jqCanvas1 = $('#canvas1');

        this.canvasLocation = jqCanvas1.offset(); // 갠버스의 오프셋을 잡아 이를 스테이지값에 더해야 제대로 인풋 패널 표현이 가능하다.


        this.text = $('#textinput1');
        this.emoticon = $('#emoticonPanel');

//    CLIENTVAR.inputPanelShow = true;

        this.text.show();
        this.emoticon.show();


        this.text.css({"top": eventObject.y + this.canvasLocation.top-28 + "px", "left": eventObject.x + this.canvasLocation.left-30 + "px"})

//    $("#permissionSelect").css({"top": eventObject.y + canvasLocation.top + "px", "left": eventObject.x + canvasLocation.left + 200 + "px"});
        this.emoticon.css({"top": eventObject.y + this.canvasLocation.top+7 + "px", "left": eventObject.x + this.canvasLocation.left-30 + "px"});

//    $("#profileImg").css({"top": eventObject.y + canvasLocation.top + "px", "left": eventObject.x + canvasLocation.left - 30 + "px"});

//        console.log(this.text.css("left"));

        CLIENTVAR.inputPanelShow = true;
    }

    this.deletePanel = function(){
//        this.textinput1.remove();
//        this.emoticonPanel.remove();

//        this.text.hide();
//        this.emoticon.hide();

        this.text.remove();
        this.emoticon.remove();
        CLIENTVAR.inputPanelShow = false;
    }
}

//
//var hidePanel = function(){
//
//    CLIENTVAR.inputPanelShow = false;
//    $("#textinput1").hide("fast");
//    $("#permissionSelect").hide("fast");
//    $("#emoticonPanel").hide("fast");
//
//}





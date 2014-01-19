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
    var userID = -1; // anonymous user
}
if(videoID === undefined){
    var videoID = -1;
}

//console.log(emoticonFilePrefix);
var inputPanel;


if(videoID != -1){

    var data1;
    var data2 = anbado.restful.getVideoInfo(videoID);
    var data3 = anbado.restful.getParticipants(videoID);
}
document.addEventListener("DOMContentLoaded", function(){
    if(videoID==-1){
        return;
    }




    /**
     * Append video display DOM
     * @param targetDOM  : 페이지에서 표시할 DOM의 위치. jQuery 타입으로 표시함
     * @param videoWidth : 비디오의 가로 크기
     * @param videoHeight : 비디오의 세로 크기
     */

    var videoDomAppend = function(targetDOM,videoWidth,videoHeight){

        var jqTargetDOM = $(targetDOM);



//    $(targetDOM).append('<div id="videoEmbed" style="position: relative;width:1080px;height:1040px;margin-left:auto;margin-right:auto;"></div>');
        jqTargetDOM.append('<div id="videoEmbed" style="position: relative;width:'+ videoWidth+';height:' + videoHeight +';margin-left:auto;margin-right:auto;"></div>');

//    $("#player").append('<div id="videoEmbed"></div>');

        var jqVideoEmbed =$("#videoEmbed");
        jqVideoEmbed.css({"width":videoWidth, "height":videoHeight});


    }

    var videoLoad = function(){
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
        else if(provider === 'ted'){
//            console.log(data2.video.provider_vid.split('/talks/')[1].split('?api')[0]);
            CLIENTVAR.popcornobj = Popcorn.smart('#videoEmbed', 'http://download.ted.com/talks/'+ data2.video.provider_vid.split('/talks/')[1].split('?api')[0]);

        }

        jqVideoEmbed = $('#videoEmbed'); // size fitting
        CLIENTVAR.popcornobj.media.width = parseInt(jqVideoEmbed.css('width'));
        CLIENTVAR.popcornobj.media.height = parseInt(jqVideoEmbed.css('height'));

    }

    var canvasPositioning = function(targetDOM, videoWidth, videoHeight){


        var jqTargetDOM = $(targetDOM);
        var jqVideoEmbed =$("#videoEmbed");
        jqVideoEmbed.css({"width":videoWidth, "height":videoHeight});

        if(data2.video.provider === 'youtube'){
            jqTargetDOM.append('<canvas id="canvas1" width = "'+videoWidth+'px" height = "'+(videoHeight-130)+'px" style="position:relative; width:'+videoWidth+'px;'+'height:'+(videoHeight-130)+'px;'+'z-index:20; margin-left:auto; margin-right:auto;">canvas</canvas>');

        }
        else if(data2.video.provider === 'vimeo'){
            jqTargetDOM.append('<canvas id="canvas1" width = "'+(videoWidth-50)+'px" height = "'+(videoHeight-100)+'px" style="position:relative; width:'+(videoWidth-50)+'px;'+'height:'+(videoHeight-100)+'px;'+'z-index:20; margin-left:auto; margin-right:auto;">canvas</canvas>');
        }
        else{
            jqTargetDOM.append('<canvas id="canvas1" width = "'+videoWidth+'px" height = "'+videoHeight+'px" style="position:relative; width:'+videoWidth+'px;'+'height:'+videoHeight+'px;'+'z-index:20; margin-left:auto; margin-right:auto;">canvas</canvas>');
        }

        jqTargetDOM.append('<div id="mytimeline" width = "'+jqVideoEmbed.width()+'px" height = "'+jqVideoEmbed.height()+'px" style="position:relative; z-index:20; margin-left:auto; margin-right:auto;">summaryPanel</div>');


        var jqCanvas = $('#canvas1');
        jqCanvas.offset(jqVideoEmbed.offset());
        jqCanvas.hide();
        var jqMysummary = $('#mytimeline');
        jqMysummary.offset(jqVideoEmbed.offset());
        jqMysummary.hide();

    };




    $(window).bind('beforeunload', function(){
        anbado.realtime.exitVideo();
    });

    $(window).unload(function(){
        anbado.realtime.exitVideo();
    });

    CLIENTVAR.pageGenerationTime = new Date(); // 페이지 생성타임을 저장하고 이를 기준시로 사용함.
    if(userID != -1){

        data1 = anbado.restful.getUserInfo(userID);


        /**
         * restful api를 이용하여 현재의 사용자 정보, 비디오 정보, 이 비디오에 참여한 사람들을 받아옴
         *
         * @type {json}
         */


        videoDomAppend('#player',880,540);
        canvasPositioning('#player', 880, 540);


//    CLIENTVAR.popcornobj= Popcorn.smart( "#youtube", "http://download.ted.com/talks/DanDennett_2003-480p-pt-br.mp4" );

        videoLoad();





        CLIENTVAR.popcornobj.controls(true);


        CLIENTVAR.popcornobj.on("loadeddata",function(){

            anbado.realtime.enterVideo(videoID,userID);
            eventArrive();
        });


        drawTimelineVisualization();

        var youtubeID = CLIENTVAR.popcornobj.media.src.split('.be/')[1];
        if(youtubeID === undefined){
            youtubeID = CLIENTVAR.popcornobj.media.src.split('?v=' +
                '')[1];
        }

        if(youtubeID !== undefined){


            // Thumbnail 부분 만들어내기
            var youtubeThumbnailsAddr = [];

            youtubeThumbnailsAddr.push("http://img.youtube.com/vi/" + youtubeID + "/1.jpg");
            youtubeThumbnailsAddr.push("http://img.youtube.com/vi/" + youtubeID + "/2.jpg");
            youtubeThumbnailsAddr.push("http://img.youtube.com/vi/" + youtubeID + "/3.jpg");

        }
        CLIENTVAR.canvaslayer = document.getElementById("canvas1");


        CLIENTVAR.stage = new createjs.Stage(CLIENTVAR.canvaslayer);
        createjs.Touch.enable(CLIENTVAR.stage);
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

        inputPanel = new InputPanel();

    }
    else if(userID == -1){      // anonymous user
        if(videoID == -1){
            return;
        }

        var deferred = $.Deferred();

        deferred.done(videoDomAppend('#player',880,540),videoLoad(),canvasPositioning('#player', 880, 540),drawTimelineVisualization());
        jqVideoEmbed = $('#videoEmbed');

        CLIENTVAR.canvaslayer = document.getElementById("canvas1");

        CLIENTVAR.stage = new createjs.Stage(CLIENTVAR.canvaslayer);

        CLIENTVAR.popcornobj.on("loadeddata",function(){

            anbado.realtime.enterVideo(videoID,userID);
            eventArrive();
        });

    }

});

function eventArrive(){

    for(var tempCounter = 0; tempCounter <= Math.floor(CLIENTVAR.popcornobj.duration()); tempCounter++){
        CLIENTVAR.thinkTriggerList[tempCounter] = []; // 2차원 배열 할당을 위해 할당함. 각 초에서 시작할 이벤트를 모두 기록한다.
    }


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


        var think = {  // 생각객체

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
            content : evt.content, // 이모티콘인 경우에 주소를 넘김
            contentImg : new Image(),
            permission : evt.permission,
            secUnit : {},// 몇번째 유닛인지?
            eaCanvasObject : {}, // easeljs 객체를 추가해주기 위해서 컨테이너를 하위 속성으로 가지고 있음.

            hasParent : false, // 이것이 최상위 이벤트인가? 밑에 댓글이 달려있는가? 부모 이벤트가 없다면 최상위 이벤트(이거나 독립 이벤트)로 간주
            parent : {}, // 이미 달린 반응에 클릭해서 남기는 경우 그에 대한 부모 이벤트 아이디를 저장함 TODO: 저장할 필요가 있나? 이미 아이디를 가지는데 객체를 저장할 필요는 없지 않을까?
            parentID: -1 , // 0 인 경우에 단독이고, 부모 이벤트 아이디가 있는 경우
            childrenIDarray:[] // 자식들이 생기게 되면 이를 표현해줌. 객체 배열을 가지지 말고 eventList에서 참조할 수 있도록 아이디만 가지고 가도록
        }; // 이벤트의 생성시점




        var promise1 = $.Deferred();
        var promise2 = $.Deferred();


        if(evt.category === 'image'){
            think.contentImg.src = evt.content;
            think.contentImg.onload = function(){
                promise1.resolve();
            }
        }
        else{
            promise1.resolve(); // 텍스트인경우 바로 resolve
        }

        think.profileImg.src = thinkOwner.profile_image;
        think.profileImg.onload = function(){
            promise2.resolve();
        };

        $.when(promise1, promise2).then(function(){
            thinkGenerate(think);
        });


      $('.bardiv').append('<img class="profileImg"   src="'+ think.profileImg.src + '"/>');


        var offsetBarWidth=$('.nv-bar.positive.nv-bar-0-1').offset().left-$('.nv-bar.positive.nv-bar-0-0').offset().left;

        var profilePosition=0;


         $('.profileImg:eq(0)').css({'width':0,'height':50,'position':'absolute','top':620,'left':10});

        if(CLIENTVAR.totalEvent!=0)
        {
//            { $('.profileImg:odd').css({'width':0,'height':50,'position':'absolute','top':620,'left':10});}

            if(CLIENTVAR.totalEvent%2==0)
            {
            $('.profileImg:last').css({'width':offsetBarWidth,'height':50,'position':'absolute','top':620,'left':10+think.clickTime*offsetBarWidth});
            $('.profileImg:last').hover(function(){
                this.style.width = '100px';
                this.style.zIndex = 100;
            });
            $('.profileImg:last').mouseleave(function(){
                this.style.width = offsetBarWidth + 'px';
                this.style.zIndex = 1;
            });
            }
            else if(CLIENTVAR.totalEvent%2==1)
            {
                $('.profileImg:last').css({'width':0,'height':50,'position':'absolute','top':620,'left':10+think.clickTime*offsetBarWidth});
            }

            console.log(think.clickTime);
//            if(CLIENTVAR.totalEvent%2==1)
//            { $('.profileImg:odd').css({'width':0,'height':50,'position':'absolute','top':620,'left':10});}
//            else if(CLIENTVAR.totalEvent%2==0)
//            { $('.profileImg:even').css({'width':offsetBarWidth,'height':50,'position':'absolute','top':620,'left':10+think.clickTime*offsetBarWidth});}
        }




        CLIENTVAR.totalEvent++;

        //$('body').append('<img width="50px" height="50px"  name="profileImg"   src="'+ think.profileImg.src + '"/>');

//
//        console.log('testclick time '+think.clickTime);
//        console.log('testclick id '+think.ownerID);



//
//        for(var i=1;i<CLIENTVAR.totalEvent;i++)
//        {
//            if(i%2==1)
//            { $(profileImg[i]).css({'width':0,'height':50,'position':'absolute','top':620,'left':10});}
//            else if(i%2==0)
//            {  $(profileImg[i]).css({'width':offsetBarWidth,'height':50,'position':'absolute','top':620,'left':10});}
//
//        }

//        $(profileImg[0]).css({'width':10,'height':50,'position':'absolute','top':620,'left':10});
//        $(profileImg[1]).css({'width':10,'height':50,'position':'absolute','top':620,'left':20});
//        $(profileImg[2]).css({'width':10,'height':50,'position':'absolute','top':620,'left':30});

        // width 를 타임라인 차트의 left 를 타임라인의 시간을 맞추어서 띄워준다.
        //$(profileImg[0]).css({'position':'relative','top':0});absolute
        // 이건 바차트의 두께
        //var offsetBarWidth=$('.nv-bar.positive.nv-bar-0-1').offset().left-$('.nv-bar.positive.nv-bar-0-0').offset().left;


    });






}


var InputPanel = function(){

    $("#textinput1").hide();
    $("#emoticonPanel").hide();

    CLIENTVAR.inputPanelShow = false;

    var emoticonImgList = [];
    emoticonImgList[0] = new Image(34,34);
    emoticonImgList[1] = new Image(34,34);
    emoticonImgList[2] = new Image(34,34);
    emoticonImgList[3] = new Image(34,34);
    emoticonImgList[4] = new Image(34,34);

    for(var tempCounter = 0; tempCounter < emoticonImgList.length; tempCounter++){

        emoticonImgList[tempCounter].src = emoticonFilePrefix + 'examples/img/emo_'+tempCounter +'.png';
        emoticonImgList[tempCounter].id = 'emoticon'+tempCounter.toString();
    }


    this.createPanel = function(think){
        var jqBody = $('body');
        jqBody.append('<input id="textinput1" type="text" placeholder="생각을 남겨보세요" onkeydown="this.style.width = ((this.value.length + 3) * 12) + \'px\';" style = "font-size:14px"/>' );

        jqBody.append('' +
            '<div id="emoticonPanel"></div>'
        );
        var emoPanel =  $('#emoticonPanel');
        emoPanel.append(emoticonImgList[0]);
        emoPanel.append(emoticonImgList[1]);
        emoPanel.append(emoticonImgList[2]);
        emoPanel.append(emoticonImgList[3]);
        emoPanel.append(emoticonImgList[4]);

        think.category = 'image';

        for(var tempCounter = 0; tempCounter< emoticonImgList.length; tempCounter++){
//            console.log(tempCounter);
            emoticonImgList[tempCounter].onclick = function (){
                think.content = this.src;
                think.contentImg = this;
                thinkGenerate(think);
                inputPanel.deletePanel();
            }
        }

        var jqCanvas1 = $('#canvas1');

        this.canvasLocation = jqCanvas1.offset(); // 갠버스의 오프셋을 잡아 이를 스테이지값에 더해야 제대로 인풋 패널 표현이 가능하다.


        this.text = $('#textinput1');
        this.emoticon = $('#emoticonPanel');



        this.text.show();
        this.emoticon.show();


        this.text.css({"top": think.y + this.canvasLocation.top-28 + "px", "left": think.x + this.canvasLocation.left-30 + "px"})

//    $("#permissionSelect").css({"top": eventObject.y + canvasLocation.top + "px", "left": eventObject.x + canvasLocation.left + 200 + "px"});
        this.emoticon.css({"top": think.y + this.canvasLocation.top+7 + "px", "left": think.x + this.canvasLocation.left-30 + "px"});

//    $("#profileImg").css({"top": eventObject.y + canvasLocation.top + "px", "left": eventObject.x + canvasLocation.left - 30 + "px"});

//        console.log(this.text.css("left"));



        CLIENTVAR.inputPanelShow = true;

        var jqTextinput = $("#textinput1");

        jqTextinput.keydown(function(evt) {


            var evt = evt || window.event;

//            console.log("keyup event" + evt);


            jqTextinput.attr("size", jqTextinput.val().length); // by text length size scailing. key by key


            if (evt.keyCode === 13 || evt.charCode === 13) { // 엔터인 경우

                think.category = evt.target.id;
                think.content = jqTextinput.val();
                inputPanel.deletePanel();

                if(jqTextinput.val().length != 0){   // 입력된 텍스트가 0이 아닌 경우에만 입
                    thinkGenerate(think);
                }
            }

            if (evt.keyCode === 27 || evt.charCode === 27) { // webkit 브라우져에서 keyCode에서의 esc를 못받는 것을 해결하기 위해

                inputPanel.deletePanel();
            }
        });


    }

    this.deletePanel = function(){

        var promise1 = this.text.hide('puff',{percent:50},400).promise();
        var promise2 = this.emoticon.hide('puff',{percent:50},400).promise();


        $.when(promise1,promise2).done(function(){
            inputPanel.text.remove();
            inputPanel.emoticon.remove();
        });


        CLIENTVAR.inputPanelShow = false;
    }
}

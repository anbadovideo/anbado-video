document.addEventListener( "DOMContentLoaded", function() {

    var textInputPanel2 =$("<input id='textinput2' type = 'text' value = 'interactive'/>");
    $('body').append(textInputPanel2);

    $("#textinput2").keydown(textinput2Keydown);
    hidePanel();

    elementCSSSetting(); // 전체 요소들의 값을 설정

//    $("#textinput1").focus(function(){
//        alert("focus inner");
//    }); // 포커스 체크 함수
//    $("#textinput1").hover(function(){getFocus();});


    $(".emoticon_button").css("width", 50);
    $(".emoticon_button").css("height", 50); // 이모티콘 이미지 조정

    var totalCount = 0;

    // CLIENTVAR.popcornobj = Popcorn.smart("ourvideo"); // 팝콘 객체 생성
    $("#youtube").remove();
    $("vid").append("   <div id='youtube' style=width:600px;height:500px;/>");

    CLIENTVAR.popcornobj= Popcorn.youtube( "#youtube", "http://youtu.be/uilcaXYnluU" );
    $("#youtube").css({"top":100,"left":330});

    var inti;


    CLIENTVAR.popcornobj.on("loadeddata", function() {

        durationtime= CLIENTVAR.popcornobj.duration();
        make_array(durationtime);
        //make_array(1600);

        console.log(durationtime);

        stactareachart();
        $('.areadiv').show();
        $('.linediv').hide();
        $('.piediv').hide();
        $('.halfdiv').hide();


    });


    CLIENTVAR.popcornobj.on("playing", function() {
        console.log("Playing!");

        inti = self.setInterval(function(){timeCheck()},100);


        CLIENTVAR.popcornobj.on("timeupdate", function(){




        });
        // socket.emit('sample',{hello: CLIENTVAR.popcornobj.currentTime()});

    });
    CLIENTVAR.popcornobj.on("seeking", function(){
        timeCheck();
    });


    function timeCheck(){ // 시간대에서 각 이벤트의 듀레이션을 체크함
        for(CLIENTVAR.currentEventPosition = 0; CLIENTVAR.currentEventPosition<CLIENTVAR.eventList.length; CLIENTVAR.currentEventPosition++){
            var deltaTime = CLIENTVAR.popcornobj.currentTime()-CLIENTVAR.eventList[CLIENTVAR.currentEventPosition].eventVideoClickTime; // 현재시간과 객체가 표시되기로 한 시간을 비교

            if(deltaTime <= CLIENTVAR.eventList[CLIENTVAR.currentEventPosition].eventVideoClickDuration ){
                CLIENTVAR.stage.addChild(CLIENTVAR.eventList[CLIENTVAR.currentEventPosition].eaCanvasDisplayObject); // 보여주기
                CLIENTVAR.stage.update();
            }
            else if((deltaTime<=0)||(deltaTime>=CLIENTVAR.eventList[CLIENTVAR.currentEventPosition].eventVideoClickDuration)||(CLIENTVAR.popcornobj.currentTime()===CLIENTVAR.popcornobj.duration())){   // seeking bar가 생성시간 뒤에 있을시, 객체가 보여준 후 일정 시간이 지나면 비디오가 끝나면 디스플레이를 없애준다.
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
    CLIENTVAR.canvaslayer = document.getElementById("canvas1");
    CLIENTVAR.canvaslayer.onclick = displayInputPanel;

    CLIENTVAR.stage = new createjs.Stage(CLIENTVAR.canvaslayer);
    CLIENTVAR.canvas_bar = document.getElementById("canvas2");
    CLIENTVAR.stage_bar = new createjs.Stage(CLIENTVAR.canvas_bar); // 하단 차트 표시할 부분

    CLIENTVAR.canvas3 = document.getElementById("canvasMyChat");
    CLIENTVAR.canvas4 = document.getElementById("canvasFriendChat");
    CLIENTVAR.chatLeftStage = new createjs.Stage(CLIENTVAR.canvas3);
    CLIENTVAR.chatRightStage = new createjs.Stage(CLIENTVAR.canvas4);


// console.log($("#textinput1").val());
//socket io 부분 테스팅

//
//    setTimeout(function(){
//        if(CLIENTVAR.popcornobj!="NaN")
//        {
//            durationtime= CLIENTVAR.popcornobj.duration();
//            make_array(durationtime);
//            //make_array(1600);
//
//            console.log(durationtime);
//
//            if(CLIENTVAR.graphshape==1)
//            {stactareachart();}
//            else if(CLIENTVAR.graphshape==2)
//            {line();}
//            else if(CLIENTVAR.graphshape==3)
//            {pichart();}
//            else if(CLIENTVAR.graphshape==4)
//            {halfpichart();}
//        }
//    },5000);

// $("input:text").hide();
// $("input:submit").hide();


// enterKeyInit(); // DOM을 넘겨줘서 실행하는 것으로



//stage.onMouseDown = displayInputPanel; // on mouse click - input event occur. onClick does not work


});


function getFocus(){

    $("#textinput1").focus();
}
//

function elementCSSSetting(){
//offset 값으로 나중에 수정 video의 위치
    $("#textinput1").keyup(keyUPCheck); // 프로퍼게이션을 막기 위해. 그리고 이벤트 리스너의 중복 생성을 막도록 한다.

    $("#textinput2").css("width", "400");
    $("#canvas1").css({"top":100,"left":330});
    $("#canvas2").css({"top":600,"left":330});
    $("#youtube").css({"top":100,"left":330});
    $("#textinput1").css({"top":100,"left":240});
    $("#permissionSelect").css({"top":100,"left":240});
    $("#visualization").css({"top":700,"left":240});
}



function textinput2Keydown(evt){

    console.log("text2");
    CLIENTVAR.tempEvent.x = 20;
    CLIENTVAR.tempEvent.y = 20;
    $("#textinput1").attr("size", $("#textinput1").val().length); // by text length size scailing. key by key


    if(evt.keyCode == 13){ // 엔터인 경우

        eventGenerate(evt.target.id, evt.target.value);
        endup();
    }
//
//    if(evt.keyCode === 27 || evt.charCode === 27){ // webkit 브라우져에서 keyCode에서의 esc를 못받는 것을 해결하기 위해
//        console.log("escape");
//        hidePanel();
//    }

}


function displayInputPanel(evt){ // on first screen, display text input panel, submit button, emoticon panel

    // alert(eventObject);
    // alert(eventObject.eventContent);

    // $("input:text").show();
    // $("input:submit").show();
    /*
     var textinput1 = document.createElement("input"); // 자바스크립트로 동적 생성하도록
     textinput1.setAttribute("id", "textinput1");
     textinput1.setAttribute("type", "text");
     textinput1.setAttribute("value", "input");

     $("#textinput1").css("width", "100px");
     $("#textinput1").css("height", "15px");
     */

    if(inputPanelShow === false){
        inputPanelShow = true; // 클릭이 되었음을 표시
        console.log("on hide");

//        displayInputPanel(eventObject);

        CLIENTVAR.tempEvent.x = evt.pageX;
        CLIENTVAR.tempEvent.y = evt.pageY; // 전역을 이용하여 좌표 전달. 개선해야할 패턴이다.

        $("#textinput1").css({"top": evt.pageY,"left":evt.pageX})
        $("#permissionSelect").css({"top":evt.pageY,"left":evt.pageX + 200});
        $("#emoticonPanel").css({"top":evt.pageY+25,"left":evt.pageX});
        $("#profileImg").css({"top":evt.pageY,"left":evt.pageX-30});

        showPanel();


    }
    else if(inputPanelShow === true){ // 클릭이 되어 있는 경우
        console.log("on show");
        inputPanelShow = false;
        hidePanel();
    }

    setTimeout(function(){getFocus();},300);

    var emo0 = document.getElementById("emoticon0");
    emo0.addEventListener("click", emoticonDOMClick);
    var emo1 = document.getElementById("emoticon1");
    emo1.addEventListener("click", emoticonDOMClick);
    var emo2 = document.getElementById("emoticon2");
    emo2.addEventListener("click", emoticonDOMClick);
    var emo3 = document.getElementById("emoticon3");
    emo3.addEventListener("click", emoticonDOMClick);

    console.log(emo0);

//
//    CLIENTVAR.eaTextInputField = new createjs.DOMElement("textinput1");
//    eaTextInputButton = new createjs.DOMElement("permissionSelect");
//
//    eaEmoticonInputArray = new Array();
//
//    for(var i =0 ; i < CLIENTVAR.emoticonNumber; i++) // 각 이모티콘 DOM 객체를 캔버스 객체로 할당
//    {
//
//        var eaTemp = new createjs.DOMElement("emoticon"+i);
//
//        eaTemp.regX = -100-(50*i); // emoticon positioning
//        eaTemp.regY = -100;
//        eaTemp.x = stage.mouseX + 120;
//        eaTemp.y = stage.mouseY;
////        eaTemp.htmlElement.onclick = emoticonClick; // 이모티콘 클릭 이벤트 핸들
//
//        eaEmoticonInputArray.push(eaTemp);
//
////        stage.addChild(eaEmoticonInputArray[i]);
//
//    }
//    // DOM객체로 직접 입력을 받지 않고 easeljs 객체로 변환하는 이유는 캔버스위에서 조정하기가 더 편하기 때문.
//    // jquery를 이용하더라도 canvas의 마우스 좌표등은 받을 수 있으나 캔버스 위에서 easeljs를 사용을 많이 하므로 변환 사용이 편리하다.
//
//    // console.log(CLIENTVAR.eaTextInputField.htmlElement);
//
//    CLIENTVAR.eaTextInputField.regX = 20;
//    CLIENTVAR.eaTextInputField.regY = 10;
//
//    CLIENTVAR.eaTextInputField.x = stage.mouseX;
//    CLIENTVAR.eaTextInputField.y = stage.mouseY;
//
//
//
//    eaTextInputButton.regX = -180;
//    eaTextInputButton.regY = 0;
//    eaTextInputButton.x = stage.mouseX;
//    eaTextInputButton.y = stage.mouseY;
//
////    stage.addChild(eaTextInputButton); // 스테이지에 easel 객체로 인풋 패널 추가.
////    stage.addChild(CLIENTVAR.eaTextInputField);
//
//    // 인풋 패널을 그려주고 난 후 이벤트에 따라 처리함. eventObject의 eaCanvasDisplayObject 객체에 대한 할당

//    stage.update(); // 패널 보여주고 나서 스테이지 업데이트

    // document.getElementById("textinput1").focus();
    // CLIENTVAR.eaTextInputField.htmlElement.focus(); // DOM 객체 포커스를 통해 바로 텍스트입력하도록

//    CLIENTVAR.eaTextInputField.htmlElement.onkeydown = keyDownCheck; // 텍스트 창에서 키 입력에 대한 이벤트 핸들러
    // console.log("eaemoticon" + eaEmoticonInput.getAttritute());
}

function keyUPCheck(evt) // DOM의 이벤트를 easeljs의 htmlElement를 통해서 사용. onkeypress대신 onkeydown을 사용해야 esc 받을 수 있
{
//    $("#textinput1").val("");
    $("#textinput1").attr("size", $("#textinput1").val().length); // by text length size scailing. key by key

    console.log(evt);
    if(evt.keyCode === 13 || evt.charCode === 13){ // 엔터인 경우
        console.log("VALUE : "+ evt.target.value);
        eventGenerate(evt.target.id, evt.target.value);
//        evt.stopImmediatePropagation();
        endup();
    }

    if(evt.keyCode === 27 || evt.charCode === 27){ // webkit 브라우져에서 keyCode에서의 esc를 못받는 것을 해결하기 위해
        console.log("escape");
        hidePanel();
    }
}

function showPanel(){
    inputPanelShow = true;
    $("#textinput1").show("scale",100);
    $("#permissionSelect").show("scale",100);
    $("#emoticonPanel").show("scale",100);
    $("#profileImg").show("scale",100);
}

function hidePanel(){

    inputPanelShow = false;
    $("#textinput1").hide("fast");
    $("#permissionSelect").hide("fast");
    $("#emoticonPanel").hide("fast");
    $("#profileImg").hide("fast");
}


function emoticonDOMClick(evt){
// 각 이모티콘 객체에 대한 이벤트 핸들러
    console.log("DOMClick");
    eventGenerate(evt.target.id, evt.target.value);

}


function eventGenerate(eventArgType, eventArgContent){ // video interaction event generation

    console.log("CONTENT : " + eventArgContent);
    var eventObject = {
        eventID : CLIENTVAR.totalEvent,
        eventOwnerName : "owner",
        eventOwnerProfilePicture : "profile url",
        eventVideoClickTime : CLIENTVAR.popcornobj.currentTime(), // 플레어에서의 currentTime을 받는 것으로
        eventOccuredAbsoluteTime : (new Date().getTime()), // 이벤트가 생성된 현재 시간.
        eventVideoClickDuration : 2, // 얼마나 지속되는지
        eventPosX : CLIENTVAR.tempEvent.x  - CLIENTVAR.canvaslayer.offsetLeft,  // 화면의 디스플레이를 표시하도록. 실제로 디스플레이 되는 것은 eaCanvasDisplayObject이나 좌표값은 보존한다.
        eventPosY : CLIENTVAR.tempEvent.y  - CLIENTVAR.canvaslayer.offsetTop,
        timelineOffset : {},  // 타임라인에서 얼마나 떨어져 있는가?
        eventType : eventArgType, // event type e.g text, emoticon, image, button action, webcam
        eventContent : eventArgContent,
        eventPermission : $("#permissionSelect").val(),
        secUnit : 100* Math.round(CLIENTVAR.popcornobj.currentTime() / CLIENTVAR.popcornobj.duration()),// 몇번째 유닛인지?
        eaCanvasisplayObject : {}
    };

    $("#textinput1").val("please input");




    switch(eventArgType)
    {
        case "textinput1":
            eaDisplaySetting(eventObject, eventArgType);
            break;

        case "textinput2":
            eaDisplaySetting(eventObject, eventArgType);
            break;


        case "emoticon0":
            eaDisplaySetting(eventObject, eventArgType);
            break;
        case "emoticon1":
            eaDisplaySetting(eventObject, eventArgType);
            break;
        case "emoticon2":
            eaDisplaySetting(eventObject, eventArgType);
            break;
        case "emoticon3":
            eaDisplaySetting(eventObject, eventArgType);
            break;

        default :
            alert("default");

    }

    endup();
}

function eaDisplaySetting(eventObject, eventTypeArg){

    eventObject.eaCanvasDisplayObject = new createjs.Container();
    console.log(eventTypeArg);


    if(eventTypeArg === "textinput1" || eventTypeArg === "textinput2"){

        if(eventTypeArg === "textinput2"){
            eventObject.eventPosX = 100;
            eventObject.eventPosY = 0+ CLIENTVAR.totalChat * 50;
            CLIENTVAR.totalChat++;

        }
        var eaBackPanel = new createjs.Shape();
        eaBackPanel.graphics.beginFill("rgba(0,255,0,1)").drawRect(eventObject.eventPosX,eventObject.eventPosY, eventObject.eventContent.length*21,20+$("#fontSizeSelect").val()/2); // 불투명도가 계속해서 높아지는 버그가 있음. easeljs issue인 듯
        eaBackPanel.regX = -10;
        eaBackPanel.regY = -10;
        eventObject.eaCanvasDisplayObject.addChild(eaBackPanel); // 뒷 배경과 무관하게 넣어주기 위해서 백패널을 이용함


        var eaTextContent = new createjs.Text(eventObject.eventContent, $("#fontSizeSelect").val()+"px helvetica", "#ffffff");
        eaTextContent.regX = -10;
        eaTextContent.regY = -18;
        eaTextContent.x = eventObject.eventPosX;
        eaTextContent.y = eventObject.eventPosY;
        eventObject.eaCanvasDisplayObject.addChild(eaTextContent);
    }
    else if(eventTypeArg === "emoticon0" ||eventTypeArg === "emoticon1"||eventTypeArg === "emoticon2"||eventTypeArg === "emoticon3") {

        var eaTempEmoticon = new createjs.Bitmap("AssetImages/" + eventTypeArg + ".png"); // make emoticon easeljs object

        eaTempEmoticon.regX = 0;
        eaTempEmoticon.regY = 0;
        eaTempEmoticon.x = eventObject.eventPosX;
        eaTempEmoticon.y = eventObject.eventPosY;
        eaTempEmoticon.scaleX = eaTempEmoticon.scaleY = eaTempEmoticon.scale = 0.4;
        eventObject.eaCanvasDisplayObject.addChild(eaTempEmoticon);
    }

    var eaProfileImage = new createjs.Bitmap("AssetImages/profile1.png"); // profile example
    eaProfileImage.regX = 0;
    eaProfileImage.regY = 0;
    eaProfileImage.x = eventObject.eventPosX - 55;
    eaProfileImage.y = eventObject.eventPosY;
    eaProfileImage.scaleX = eaProfileImage.scaleY = eaProfileImage.scale = 0.2;

    eventObject.eaCanvasDisplayObject.addChild(eaProfileImage); // 뒷 배경과 무관하게 넣어주기 위해서 백패널을 이용함

    if(eventTypeArg === "textinput2"){


        CLIENTVAR.chatLeftStage.addChild(eventObject.eaCanvasDisplayObject);
        CLIENTVAR.chatLeftStage.update();


    }
    else  { // 일반 텍스트 입력 및 이모티콘인 경우 경우
        CLIENTVAR.stage.addChild(eventObject.eaCanvasDisplayObject);
        CLIENTVAR.stage.update();
    }


    CLIENTVAR.eventList.push(eventObject); // 전체 이벤트 목록에 저장



    // 타임라인에 넣을 사진을 넣는다.
    var eaProfileImgOnTimeline = new createjs.Bitmap("AssetImages/profile1.png"); // profile example
    eaProfileImgOnTimeline.regX = 0;
    eaProfileImgOnTimeline.regY = 0;
    eaProfileImgOnTimeline.x = eventObject.eventVideoClickTime/CLIENTVAR.popcornobj.duration() * 640;
    eaProfileImgOnTimeline.y = 0;
    eaProfileImgOnTimeline.scaleX = eaProfileImgOnTimeline.scaleY = eaProfileImgOnTimeline.scale = 0.1;

    CLIENTVAR.stage_bar.addChild(eaProfileImgOnTimeline);
    CLIENTVAR.stage_bar.update();


    CLIENTVAR.stage_bar.enableMouseOver(60); // 마우스 오버 설

    var timelineEvent = {}; // 임시 이벤트를 등록하여 마우스 오버/아웃을 해결하


    eaProfileImgOnTimeline.addEventListener("mouseover", function() { // 마우스 오버를 통해 툴팁.
        CLIENTVAR.stage_bar.canvas.title = eventObject.eventContent;
        console.log("in mouseover");

        timelineEvent = eventObject;
        timelineEvent.eventPosX = eventObject.eventVideoClickTime/CLIENTVAR.popcornobj.duration() * 640 + 30;
        timelineEvent.eventPosY = 20;
        eaDisplaySetting(timelineEvent, timelineEvent.eventType);
        CLIENTVAR.stage_bar.addChild(timelineEvent.eaCanvasDisplayObject);

        CLIENTVAR.stage_bar.update();
    });
    eaProfileImgOnTimeline.addEventListener("mouseout", function() {

        CLIENTVAR.stage_bar.removeChild(timelineEvent.eaCanvasDisplayObject);
//        console.log(eventObject.eaCanvasDisplayObject);
        CLIENTVAR.stage_bar.update();
    });

//    CLIENTVAR.chatRightStage.addChild(eventObject.eaCanvasDisplayObject);
//    CLIENTVAR.chatRightStage.update();


    endup();
}


function endup(){ // 이벤트 후 처리 부분

    CLIENTVAR.stage.update();
    hidePanel();

    CLIENTVAR.totalEvent++;


    setTimeout(function(){getFocus();},100);
}

//     if(CLIENTVAR.popcornobj.currentTime()==CLIENTVAR.popcornobj.duration())// check video end
//     {
//       $("input:text").hide();
//       $("input:submit").hide();
//    // 동영상이 끝나고 클릭했을 경우 입력 패널이 뜨는 문제점을 방지하기 위해
//     }


//  //    if(CLIENTVAR.popcornobj.currentTime()==CLIENTVAR.popcornobj.duration())// check video end
//  //     {      $("input:text").hide();
//  //   $("input:submit").hide();
//  //   // 동영상이 끝나고 클릭했을 경우 입력 패널이 뜨는 문제점을 방지하기 위해
//  // }


//   }

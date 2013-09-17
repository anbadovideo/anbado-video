var timeline;

var data = [
    {
        'start': new Date(2013,8,7),
        'content': 'Conversation<br><img src="img/comments-icon.png" style="width:32px; height:32px;">'
    },
    {
        'start': new Date(2013,8,7),
        'end' : new Date(2013,8,8),
        'content': 'Report<br><img src="AssetImages/profile1.png" style="width:48px; height:48px;"/>'
    }
];

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
    $("vid").append("   <div id='youtube' style=width:600px;height:500px;top:1000px;/>");

    CLIENTVAR.popcornobj= Popcorn.youtube( "#youtube", "http://www.youtube.com/embed/87kezJTpyMI?hd=1&iv_load_policy=3" );

    CLIENTVAR.pageGenerationTime = new Date(); // 페이지 생성타임을 저장하고 이를 기준시로 사용함.
    drawTimelineVisualization();

    var youtubeID = CLIENTVAR.popcornobj.media.src.split('.be/')[1];
    if(youtubeID === undefined){
        youtubeID = CLIENTVAR.popcornobj.media.src.split('?v=' +
            '')[1];

    }


    if(youtubeID !== undefined){


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

    $("#youtube").css({"top":100,"left":330});

    var inti;

    CLIENTVAR.popcornobj.on("loadeddata", function() {

        durationtime= CLIENTVAR.popcornobj.duration();
        anbado.timeline.initialize(durationtime);

        $('.areadiv').show();
        $('.linediv').hide();
        $('.piediv').hide();
        $('.halfdiv').hide();
        $('.bardiv').hide();
    });


    CLIENTVAR.popcornobj.on("playing", function() {

        var stackedAreaObject = $('#stackedarea');

        console.log(this.media.src);
        $("#canvas1").show();

        inti = self.setInterval(function(){timeCheck()},10);


        CLIENTVAR.popcornobj.on("timeupdate", function(){
            anbado.timeline.tooltip(stackedAreaObject);
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
    CLIENTVAR.canvaslayer = document.getElementById("canvas1");
//    CLIENTVAR.canvaslayer.onclick = displayInputPanel; // 캔버스 온클릭의 경우 스테이지에서의 고저차가 무시되어버린다는 문제점이 발생한다. 원래 이를 캔버스 이벤트로 둔것은 인풋 패널을 위치시킬 때 easel 객체가 너무 많이 생성되었기 때문이었다. (그래서 인풋 패널을 놓기 위해 이렇게 생성) 하지만 stage의 위아래가 구분안되는 문제가 있어, stage이벤트로 가야한다(대댓글의 문제에서 특히)


    CLIENTVAR.stage = new createjs.Stage(CLIENTVAR.canvaslayer);
//    CLIENTVAR.stage.onMouseDown = saveCoord;
//    CLIENTVAR.stage.addEventListener("click", displayInputPanel);

    CLIENTVAR.stageMousePanelWrapper = new createjs.Shape();

    CLIENTVAR.stageMousePanelWrapper.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("rgba(0,0,0,1)").drawRect(0,0, CLIENTVAR.canvaslayer.width,CLIENTVAR.canvaslayer.height)); // 투명 레이어에 덮어씌우기 위해 히트 아레아 추가
    CLIENTVAR.stageMousePanelWrapper.regX = 0;
    CLIENTVAR.stageMousePanelWrapper.regY = 0;
    CLIENTVAR.stageMousePanelWrapper.addEventListener("click", saveCoord);
    CLIENTVAR.stage.addChild(CLIENTVAR.stageMousePanelWrapper); // 뒷 배경과 무관하게 넣어주기 위해서 백패널을 이용함
    CLIENTVAR.stage.update();

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
    $("#thumbnailPanorama").css({"top":700,"left":330,"z-index":-20});
    $("#textinput1").css({"top":100,"left":240});
    $("#permissionSelect").css({"top":100,"left":240});
    $("#visualization").css({"top":1200,"left":240});
}



function textinput2Keydown(evt){


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

function saveCoord(evt){
    CLIENTVAR.tempEvent.parentEventID = -1;// 새로운 객체의 경우에는 부모 이벤트를 촉하해주어야 한다.
    CLIENTVAR.tempEvent.x = evt.stageX; // 전역변수를 써서 좌표 전달 TODO: 전역 변수 사용을 해소할 수 있어야 함
    CLIENTVAR.tempEvent.y = evt.stageY;

        displayInputPanel(CLIENTVAR.tempEvent);

}

function displayInputPanel(tempEvent){ // on first screen, display text input panel, submit button, emoticon panel




    // alert(eventObject);
    console.log("in displayinputpaenl");


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


//        displayInputPanel(eventObject);

//        CLIENTVAR.tempEvent.x = evt.stageX;
//        CLIENTVAR.tempEvent.y = evt.stageY; // 전역을 이용하여 좌표 전달. 개선해야할 패턴이다.

        $("#textinput1").css({"top": tempEvent.y + CLIENTVAR.canvaslayer.offsetTop,"left":tempEvent.x + CLIENTVAR.canvaslayer.offsetLeft})
        $("#permissionSelect").css({"top":tempEvent.y + CLIENTVAR.canvaslayer.offsetTop,"left":tempEvent.x + CLIENTVAR.canvaslayer.offsetLeft + 200});
        $("#emoticonPanel").css({"top":tempEvent.y + CLIENTVAR.canvaslayer.offsetTop+25,"left":tempEvent.x + CLIENTVAR.canvaslayer.offsetLeft});
        $("#profileImg").css({"top":tempEvent.y + CLIENTVAR.canvaslayer.offsetTop+25,"left":tempEvent.x + CLIENTVAR.canvaslayer.offsetLeft-30});

        showPanel();


    }
    else if(inputPanelShow === true){ // 클릭이 되어 있는 경우

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



//
//    CLIENTVAR.eaTextInputField = new createjs.DOMElement("textinput1"); // 캔버스의 입력 객체를 저장햇던 부분. 지금은 DOM을 통해 인풋 인터페이스가 표시됨
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

function keyUPCheck(evt){ // DOM의 이벤트를 easeljs의 htmlElement를 통해서 사용. onkeypress대신 onkeydown을 사용해야 esc 받을 수 있

//    $("#textinput1").val("");
    $("#textinput1").attr("size", $("#textinput1").val().length); // by text length size scailing. key by key


    if(evt.keyCode === 13 || evt.charCode === 13){ // 엔터인 경우

        eventGenerate(evt.target.id, evt.target.value);
//        evt.stopImmediatePropagation();
        endup();
    }

    if(evt.keyCode === 27 || evt.charCode === 27){ // webkit 브라우져에서 keyCode에서의 esc를 못받는 것을 해결하기 위해

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

    eventGenerate(evt.target.id, evt.target.value);

}

// Called when the Visualization API is loaded.
function drawTimelineVisualization() {

    console.log("in draw");
    // Create a JSON data table

    // specify options
    var options = {

        'width': '100%',
        'height': '400px',
        'editable': false,   // enable dragging and editing events
        'style': 'box',
        'start': new Date(CLIENTVAR.pageGenerationTime.getTime()),
        'end': new Date(CLIENTVAR.pageGenerationTime.getTime() + CLIENTVAR.popcornobj.duration()*1000), // 밀리세컨드 단위이므로 1000을 곱함
//        'scale': links.Timeline.StepDate.SCALE.SECOND,
//        'step' : 1000,
//        'zoomable' : false,
        'showCurrentTime' : false,

//        'stackEvents' : 'true',
        'min' : new Date(CLIENTVAR.pageGenerationTime.getTime()),
        'max' : new Date(CLIENTVAR.pageGenerationTime.getTime() + CLIENTVAR.popcornobj.duration()*1000), // 밀리세컨드 단위이므로 1000을 곱함
        'showMinorLabels' : false,
        'showMajorLabels' : false
    };


    // Instantiate our timeline object.
    timeline = new links.Timeline(document.getElementById('mytimeline'));

    // attach an event listener using the links events handler
//    links.events.addListener(timeline, 'rangechanged', onRangeChanged);

    // Draw our timeline with the created data and options
    timeline.draw(data, options);

}

function eventGenerate(eventArgType, eventArgContent){ // video interaction event generation


    var eventObject = {
        eventID : CLIENTVAR.totalEvent,

        eventOwnerName : "owner",
        eventOwnerProfilePicture : "profile url",
        eventVideoClickTime : CLIENTVAR.popcornobj.currentTime(), // 플레어에서의 currentTime을 받는 것으로. 상대 시간
        eventOccuredAbsoluteTime : (new Date()), // 이벤트가 생성된 현재 시간.(실제 현실 시간, 이를 이용해 사용자가 남긴 반응들을 시점별로 정렬이 가능)
        eventVideoClickDuration : 4, // 얼마나 지속되는지
        eventPosX : CLIENTVAR.tempEvent.x ,  // 화면의 디스플레이를 표시하도록. 실제로 디스플레이 되는 것은 eaCanvasDisplayObject이나 좌표값은 보존한다.
        eventPosY : CLIENTVAR.tempEvent.y ,
        timelineOffset : {},  // 타임라인에서 얼마나 떨어져 있는가?
        eventType : eventArgType, // event type e.g text, emoticon, image, button action, webcam
        eventContent : eventArgContent,
        eventPermission : $("#permissionSelect").val(),
        secUnit : 100* Math.round(CLIENTVAR.popcornobj.currentTime() / CLIENTVAR.popcornobj.duration()),// 몇번째 유닛인지?
        eaCanvasisplayObject : {}, // easeljs 객체를 추가해주기 위해서 컨테이너를 하위 속성으로 가지고 있음.

        itHasParent : false, // 이것이 최상위 이벤트인가? 밑에 댓글이 달려있는가? 부모 이벤트가 없다면 최상위 이벤트(이거나 독립 이벤트)로 간주
        parentEvent : {}, // 이미 달린 반응에 클릭해서 남기는 경우 그에 대한 부모 이벤트 아이디를 저장함 TODO: 저장할 필요가 있나? 이미 아이디를 가지는데 객체를 저장할 필요는 없지 않을까?
        parentEventID: CLIENTVAR.tempEvent.parentEventID === undefined ? -1 : CLIENTVAR.tempEvent.parentEventID , // 0 인 경우에 단독이고, 부모 이벤트 아이디가 있는 경우
        childrenIDarray:[] // 자식들이 생기게 되면 이를 표현해줌. 객체 배열을 가지지 말고 eventList에서 참조할 수 있도록 아이디만 가지고 가도록
    };

//    eventObject.getFullYear(),this.getMonth()+1,this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds()


//
    data.push({
        'start': new Date(CLIENTVAR.pageGenerationTime.getTime() + eventObject.eventVideoClickTime * 1000),
        'content': '<img src="AssetImages/profile1.png" style="width:32px; height:32px;">'+eventObject.eventContent
    });

    drawTimelineVisualization();
    // Called when the Visualization API is loaded.
//
//    if(eventTextSeparation){
//
//    }

//    console.log(eventObject.eventOccuredAbsoluteTime.getFullYear());



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


var commentReply = function(eventObject){ // stage mousedown event 가 발생하므로, 여기서 바로 패널을 옮김

    //TODO: diplayInput 패널 함수에 조건을 통해 이 함수를 합쳐야함. 조건체크를 해야하기 때문
    isItCommentReply = true;
    console.log("this is " + eventObject);

//    var eaCommentReplyPanel = new createjs.Shape(); // 연관관계 시각화를 위한 패널 생성
//    eaCommentReplyPanel.graphics.beginFill("rgba(0,255,100,0.2)").drawRect(eventObject.eventPosX,eventObject.eventPosY, 200 ,600); //
//    eaCommentReplyPanel.regX = 80;
//    eaCommentReplyPanel.regY = 20;
//    CLIENTVAR.stage.addChildAt(eaCommentReplyPanel, 1); // 댓글 연관관계를 표현하기 위해 패널을 확보함. 1번 위치에 추가하는 이유는 0번 위치에 가장 밑에 깔리는 투명 레이어가 존재하고 있기 때문
//    // 패널 방식은 아무래도 좋은 방식이 아닌것 같다. 화면을 가리는 문제가 심각

//    $("#textinput1").css({"top":eventObject.eventPosY + 30 + CLIENTVAR.canvaslayer.offsetTop, "left":eventObject.eventPosX +30 + CLIENTVAR.canvaslayer.offsetLeft });
//    $("#permissionSelect").css({"top":eventObject.eventPosY + 30 + CLIENTVAR.canvaslayer.offsetTop, "left":eventObject.eventPosX +130 + CLIENTVAR.canvaslayer.offsetLeft });
//    $("#emoticonPanel").css({"top":eventObject.eventPosY + 65 + CLIENTVAR.canvaslayer.offsetTop, "left":eventObject.eventPosX +30 + CLIENTVAR.canvaslayer.offsetLeft });
//    $("#profileImg").css({"top":eventObject.eventPosY + 30 + CLIENTVAR.canvaslayer.offsetTop, "left":eventObject.eventPosX +0 + CLIENTVAR.canvaslayer.offsetLeft });
//    showPanel(); // 댓글 패널의 위치를 재조정하고 띄워줌
//    isItCommentReply = false;


// 선 그리기 위한 컴포넌트들
    var shape = new createjs.Shape();
    shape.regX = 20;
    shape.regY = -20;
    var graphics = shape.graphics;
    var color = createjs.Graphics.getHSL(
        Math.cos((32)*0.01) * 180,
        100,
        50,
        1.0);
    graphics.setStrokeStyle(10,"round").beginStroke(color);
    CLIENTVAR.stage.addChildAt(shape,1);


    console.log(eventObject.parentEventID);
    if(eventObject.parentEventID === -1){ // 혼자 있던 이벤트를 클릭한 경우. 이 경우 eventObject는 클릭된 이벤트 정보가 넘어온다.
        console.log("in minus one");
        CLIENTVAR.tempEvent.parentEventID = eventObject.eventID; // 대댓글 연결이 시작되지 않은 상태에서는 클릭된 원본 아이디의 위치를 기억함
        CLIENTVAR.tempEvent.x = eventObject.eventPosX + 40;

        CLIENTVAR.tempEvent.y = eventObject.eventPosY + 66*(eventObject.childrenIDarray.length+1);
//        eventObject.childrenIDarray.push(eventObject.eventID); // 하위 이벤트들의 아이디를 기록함


        shape.graphics.moveTo(eventObject.childrenIDarray.length === 0  ? eventObject.eventPosX: eventObject.eventPosX+40,eventObject.eventPosY + 66*(eventObject.childrenIDarray.length))
            .lineTo(eventObject.eventPosX + 40,eventObject.eventPosY + 66*(eventObject.childrenIDarray.length+1));
    }
    else{
        console.log("else case"); // 최상위 객체 이외의 연관 객체 중 하나를 선택한 경우
        CLIENTVAR.tempEvent.parentEventID = eventObject.parentEventID; // 이미 댓글이 달려있는 경우에는 그것을 고려하여 최상위 이벤트를 기록함
        CLIENTVAR.tempEvent.x = eventObject.eventPosX;

        CLIENTVAR.tempEvent.y = CLIENTVAR.eventList[eventObject.parentEventID].eventPosY + 66*(CLIENTVAR.eventList[eventObject.parentEventID].childrenIDarray.length+1);
        console.log(CLIENTVAR.eventList[eventObject.parentEventID]);
        console.log(CLIENTVAR.eventList[eventObject.parentEventID].childrenIDarray);


        // easeljs 를 통해 선을 그림
        for(var temp = 0; temp < CLIENTVAR.eventList[eventObject.parentEventID].childrenIDarray.length; temp++){
            console.log("in for");

            // set up our drawing properties:

            shape.graphics.moveTo(CLIENTVAR.eventList[eventObject.parentEventID].eventPosX,CLIENTVAR.eventList[eventObject.parentEventID].eventPosY)
                .lineTo(CLIENTVAR.eventList[CLIENTVAR.eventList[eventObject.parentEventID].childrenIDarray[temp]].eventPosX,CLIENTVAR.eventList[CLIENTVAR.eventList[eventObject.parentEventID].childrenIDarray[temp]].eventPosY);
//            // start the line at the last position:
//            graphics.moveTo(CLIENTVAR.eventList[eventObject.parentEventID].eventPosX,CLIENTVAR.eventList[eventObject.parentEventID].eventPosY);
//
//            // calculate the new position in the shape's local coordinate space:
////        lastPt = shape.globalToLocal(_mouseX,_mouseY);
//
//            // draw the line, and close the path:
//            graphics.lineTo(eventList[CLIENTVAR.eventList[eventObject.parentEventID].childrenIDarray[temp]].eventPosX,eventList[CLIENTVAR.eventList[eventObject.parentEventID].childrenIDarray[temp]].eventPosY);


        }


    }



    displayInputPanel(CLIENTVAR.tempEvent);

}

function eaDisplaySetting(eventObject, eventTypeArg){ // 객체를 캔버스에 저장하고 이벤트를 리스트에 넣게 되는 단계 (이것은 그리는 단계에서는 그러하고, 서버에서 받아오는 단계에서는 미리 저장한다

    eventObject.eaCanvasDisplayObject = new createjs.Container();

    eventObject.eaCanvasDisplayObject.addEventListener("click", function(){
        commentReply(eventObject);
//        saveCoord(eventObject);
    });// 현재 이벤트를 클릭했을 경우 이에 대한 대댓글 기능이 제공됨


    console.log(eventTypeArg);

    if(eventTypeArg === "textinput1" || eventTypeArg === "textinput2"){

        if(eventTypeArg === "textinput2"){
            eventObject.eventPosX = 100;
            eventObject.eventPosY = 0+ CLIENTVAR.totalChat * 50;
            CLIENTVAR.totalChat++;

        }
        var eaBackPanel = new createjs.Shape();
        eaBackPanel.graphics.beginFill("rgba(0,255,0,0.3)").drawRect(eventObject.eventPosX,eventObject.eventPosY, eventObject.eventContent.length*21,20+$("#fontSizeSelect").val()/2); // 불투명도가 계속해서 높아지는 버그가 있음. easeljs issue인 듯
        eaBackPanel.regX = -10;
        eaBackPanel.regY = -10;
        eventObject.eaCanvasDisplayObject.addChild(eaBackPanel); // 뒷 배경과 무관하게 넣어주기 위해서 백패널을 이용함

        var textFont = $("#fontSelect").val();
        console.log(textFont);
        var eaTextContent = new createjs.Text(eventObject.eventContent, $("#fontSizeSelect").val()+"px " + textFont.toString(), "#ffffff");
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


    console.log("parent ID mark : " + eventObject.parentEventID);

    if(eventObject.parentEventID !== -1){ // 최상위 객체인지 확인하고 그게 아닌 경우에 이벤트에 관계 목록을 추가한다.

        CLIENTVAR.eventList[eventObject.parentEventID].childrenIDarray.push(eventObject.eventID); // 하위 이벤트들의 아이디를 기록함 최상위 부모 노드에 기록함
    }
    CLIENTVAR.eventList.push(eventObject); // 전체 이벤트 목록에 저장

    // 밑의 타임라인에 저장


    // 타임라인에 넣을 사진을 넣는다.
    var eaProfileImgOnTimeline = new createjs.Bitmap("AssetImages/profile1.png"); // profile example
    eaProfileImgOnTimeline.regX = 0;
    eaProfileImgOnTimeline.regY = 0;
    eaProfileImgOnTimeline.x = eventObject.eventVideoClickTime/CLIENTVAR.popcornobj.duration() * 640;
    eaProfileImgOnTimeline.y = 0;
    eaProfileImgOnTimeline.scaleX = eaProfileImgOnTimeline.scaleY = eaProfileImgOnTimeline.scale = 0.1;

    CLIENTVAR.stage_bar.addChild(eaProfileImgOnTimeline);
    CLIENTVAR.stage_bar.update();


    CLIENTVAR.stage_bar.enableMouseOver(60); // 마우스 오버 설정

    var timelineEvent = {}; // 임시 이벤트를 등록하여 마우스 오버/아웃을 해결하


    eaProfileImgOnTimeline.addEventListener("mouseover", function() { // 마우스 오버를 통해 툴팁.
        CLIENTVAR.stage_bar.canvas.title = eventObject.eventContent;
        console.log("in mouseover");

        timelineEvent = eventObject;
        timelineEvent.eventPosX = eventObject.eventVideoClickTime/CLIENTVAR.popcornobj.duration() * 640 + 30;
        timelineEvent.eventPosY = 20;
        eaDisplaySetting(timelineEvent, timelineEvent.eventType);
        CLIENTVAR.stage_bar.addChild(timelineEvent.eaCanvasDisplayObject); // 툴팁을 올림

        CLIENTVAR.stage_bar.update();
    });

    eaProfileImgOnTimeline.addEventListener("mouseout", function() { // 마우스가 빠져나가는 경우에 삭제

        CLIENTVAR.stage_bar.removeChild(timelineEvent.eaCanvasDisplayObject);
//        console.log(eventObject.eaCanvasDisplayObject);
        CLIENTVAR.stage_bar.update();
    });

//    CLIENTVAR.chatRightStage.addChild(eventObject.eaCanvasDisplayObject);
//    CLIENTVAR.chatRightStage.update();

    CLIENTVAR.totalEvent++; // 이벤트 아이디를 증가시

    endup();
}


function endup(){ // 이벤트 후 처리 부분

    CLIENTVAR.stage.update();
    hidePanel();

    setTimeout(function(){getFocus();},100);// TODO: getFocus 함수 손보기. 타임아웃 방식보다 더 안정적인 방식을 적용할 것.
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

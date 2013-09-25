// TODO : 유저 프로파일 리스트 만들어 놓기




document.addEventListener("DOMContentLoaded", function(){
    var data1 = anbado.restful.getUserInfo(1);
    var data2 = anbado.restful.getVideoInfo(1);
    var data3 = anbado.restful.getParticipants(1);



    console.log(data1);
    console.log(data2.video.provider);
    console.log(data3);

    hidePanel(); // 입력 패널은 DOM객체이므로 이를 보이지 않도록 한다. TODO: 동적 생성으로 하여 이 부분이 필요하지 않도록 하기

    elementCSSSetting(); // 전체 요소들의 값을 설정


    $("#youtube").remove();

    $("#player").append("<div id='videoEmbed' style='top:0px;left:0px;width:640px;height:480px;'/>");
    console.log($("#player").offset());
    $("#videoEmbed").css({left:0, top:0});
    $("#player").append("<canvas id='canvas1' width = '"+$("#videoEmbed").width()+"' height = '"+($("#videoEmbed").height()-80)+"'></canvas>");
    $("#canvas1").css({"position":"absolute","z-index":2});
    $("#canvas1").css({left:0, top:0});




//    $("#canvas1").offset({top: 0,left:0});

//    $("#youtube").offset($("#vid").offset);



//    CLIENTVAR.popcornobj= Popcorn.smart( "#youtube", "http://download.ted.com/talks/DanDennett_2003-480p-pt-br.mp4" );


    if(data2.video.provider === "youtube"){
        CLIENTVAR.popcornobj= Popcorn.smart( "#videoEmbed", "http://www.youtube.com/embed/"+ data2.video.provider_vid +"?hd=1" + "&iv_load_policy=3" );

    }
    else if (data2.video.provider === "anbado"){
        console.log("mp4 type");
        CLIENTVAR.popcornobj= Popcorn.smart( "#videoEmbed", "http://localhost:8000/asset/"+ data2.video.provider_vid + ".mp4" );
    }
    CLIENTVAR.popcornobj.on("loadeddata",function(){
        anbado.realtime.enterVideo(1,1);

        anbado.realtime.onEvent(function(evt){ // 이벤트 도착 처리 핸들러

            var eventObject = {  // 전역 이벤트 없이 통과해가며 완성됨
                eventID : CLIENTVAR.totalEvent,
                eventStep :3, // 0은 생성상태. 1은 생성 중. 2는 생성완료. 3은 외부 이벤트

                eventOwnerID : evt.user_id,

                eventOwnerName : "owner",
                eventOwnerProfilePicture : data3.participants[evt.user_id-1].profile_image,

                eventVideoClickTime : evt.appeared, // 플레어에서의 currentTime을 받는 것으로. 상대 시간
                eventOccuredAbsoluteTime : evt.registered, // 이벤트가 생성된 현재 시간.(실제 현실 시간, 이를 이용해 사용자가 남긴 반응들을 시점별로 정렬이 가능)

                eventVideoClickDuration : evt.disappeared - evt.appeared, // 얼마나 지속되는지
                eventPosX : evt.coord[0] ,  // 화면의 디스플레이를 표시하도록. 실제로 디스플레이 되는 것은 eaCanvasDisplayObject이나 좌표값은 보존한다.
                eventPosY : evt.coord[1] ,
                timelineOffset : {},  // 타임라인에서 얼마나 떨어져 있는가?
                eventType : "textinput1", // event type e.g text, emoticon, image, button action, webcam
                eventContent : evt.content, // 이모티콘인 경우에 주소를
                eventPermission : evt.permission,
                secUnit : {},// 몇번째 유닛인지?
                eaCanvasisplayObject : {}, // easeljs 객체를 추가해주기 위해서 컨테이너를 하위 속성으로 가지고 있음.

                itHasParent : false, // 이것이 최상위 이벤트인가? 밑에 댓글이 달려있는가? 부모 이벤트가 없다면 최상위 이벤트(이거나 독립 이벤트)로 간주
                parentEvent : {}, // 이미 달린 반응에 클릭해서 남기는 경우 그에 대한 부모 이벤트 아이디를 저장함 TODO: 저장할 필요가 있나? 이미 아이디를 가지는데 객체를 저장할 필요는 없지 않을까?
                parentEventID: -1 , // 0 인 경우에 단독이고, 부모 이벤트 아이디가 있는 경우
                childrenIDarray:[] // 자식들이 생기게 되면 이를 표현해줌. 객체 배열을 가지지 말고 eventList에서 참조할 수 있도록 아이디만 가지고 가도록
            }; // 이벤트의 생성시점
            CLIENTVAR.totalEvent++;

            eventGenerate(eventObject);

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
    console.log("canvas layer : " + CLIENTVAR.canvaslayer.width);
    console.log("canvas layer : " + document.getElementById("canvas1"));
//    CLIENTVAR.canvaslayer.onclick = displayInputPanel; // 캔버스 온클릭의 경우 스테이지에서의 고저차가 무시되어버린다는 문제점이 발생한다. 원래 이를 캔버스 이벤트로 둔것은 인풋 패널을 위치시킬 때 easel 객체가 너무 많이 생성되었기 때문이었다. (그래서 인풋 패널을 놓기 위해 이렇게 생성) 하지만 stage의 위아래가 구분안되는 문제가 있어, stage이벤트로 가야한다(대댓글의 문제에서 특히)


    CLIENTVAR.stage = new createjs.Stage(CLIENTVAR.canvaslayer);
//    CLIENTVAR.stage.onMouseDown = saveCoord; // 스테이지 자체에 대한 클릭을 받으면 객체 위에 올려지는 객체에 대한 클릭을 받지 못하게된다(이벤트가 stage클릭이 우선이므로)
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


});
function elementCSSSetting(){
//offset 값으로 나중에 수정 video의 위치




//    $("#textinput2").css("width", "400");
//    $("#canvas1").css({$("#youtube").offset()});
//    $("#canvas2").css({"top":600,"left":330});
//    $("#youtube").css({"top":100,"left":330});
//    $("#thumbnailPanorama").css({"top":700,"left":330,"z-index":-20});
//    $("#textinput1").css({"top":100,"left":240});
//    $("#permissionSelect").css({"top":100,"left":240});
    $("#visualization").css({"top":1200,"left":240});
}


var showPanel = function(){
    inputPanelShow = true;
    $("#textinput1").show();
    $("#permissionSelect").show();
    $("#emoticonPanel").show();
    $("#profileImg").show();
}

var hidePanel = function(){

    inputPanelShow = false;
    $("#textinput1").hide("fast");
    $("#permissionSelect").hide("fast");
    $("#emoticonPanel").hide("fast");
    $("#profileImg").hide("fast");
}





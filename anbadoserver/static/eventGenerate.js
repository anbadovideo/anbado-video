/**
 *
 * Date: 9/22/13
 *
 * @author haksudol
 * @since 0.1
 */


var anbado = window.anbado || {};


function eventGenerate(eventObject) { // video interaction event generation

    console.log(eventObject.eventType);


    if (eventObject.eventStep === 1) { // 생성중인 이벤트
        eventObject.eventOccuredAbsoluteTime = (new Date());
        eventObject.eventVideoClickTime = CLIENTVAR.popcornobj.currentTime();
        eventObject.eventPermission = "friends";
        eventObject.secUnit = 100 * Math.round(CLIENTVAR.popcornobj.currentTime() / CLIENTVAR.popcornobj.duration());
        eventObject.parentEventID = CLIENTVAR.transferEvent.parentEventID === undefined ? -1 : CLIENTVAR.transferEvent.parentEventID;
        eventObject.childrenIDarray = [];

        eventTypeCheck(eventObject);

        console.log("current" + eventObject.eventVideoClickTime);
        endup();
    }
    else if (eventObject.eventStep === 3) {// 생성å완료된 이벤트의 경우

        eventTypeCheck(eventObject);
        console.log("current" + eventObject.eventVideoClickTime);


    }


//
//    var eventObject = {
//        eventID : CLIENTVAR.totalEvent,
//
////        eventOwnerName : "owner",
////        eventOwnerProfilePicture : "asset/assetImages/profile1.png",
////        eventVideoClickTime : CLIENTVAR.popcornobj.currentTime(), // 플레어에서의 currentTime을 받는 것으로. 상대 시간
////        eventOccuredAbsoluteTime : (new Date()), // 이벤트가 생성된 현재 시간.(실제 현실 시간, 이를 이용해 사용자가 남긴 반응들을 시점별로 정렬이 가능)
////        eventVideoClickDuration : 4, // 얼마나 지속되는지
////        eventPosX : CLIENTVAR.tempEvent.x ,  // 화면의 디스플레이를 표시하도록. 실제로 디스플레이 되는 것은 eaCanvasDisplayObject이나 좌표값은 보존한다.
////        eventPosY : CLIENTVAR.tempEvent.y ,
////        timelineOffset : {},  // 타임라인에서 얼마나 떨어져 있는가?
////        eventType : eventArgType, // event type e.g text, emoticon, image, button action, webcam
////        eventContent : eventArgContent,
////        eventPermission : $("#permissionSelect").val(),
////        secUnit : 100* Math.round(CLIENTVAR.popcornobj.currentTime() / CLIENTVAR.popcornobj.duration()),// 몇번째 유닛인지?
////        eaCanvasisplayObject : {}, // easeljs 객체를 추가해주기 위해서 컨테이너를 하위 속성으로 가지고 있음.
//
////        itHasParent : false, // 이것이 최상위 이벤트인가? 밑에 댓글이 달려있는가? 부모 이벤트가 없다면 최상위 이벤트(이거나 독립 이벤트)로 간주
////        parentEvent : {}, // 이미 달린 반응에 클릭해서 남기는 경우 그에 대한 부모 이벤트 아이디를 저장함 TODO: 저장할 필요가 있나? 이미 아이디를 가지는데 객체를 저장할 필요는 없지 않을까?
////        parentEventID: CLIENTVAR.tempEvent.parentEventID === undefined ? -1 : CLIENTVAR.tempEvent.parentEventID , // 0 인 경우에 단독이고, 부모 이벤트 아이디가 있는 경우
////        childrenIDarray:[] // 자식들이 생기게 되면 이를 표현해줌. 객체 배열을 가지지 말고 eventList에서 참조할 수 있도록 아이디만 가지고 가도록
//    };

//    eventObject.getFullYear(),this.getMonth()+1,this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds()


//

    // Called when the Visualization API is loaded.
//
//    if(eventTextSeparation){
//
//    }

//    console.log(eventObject.eventOccuredAbsoluteTime.getFullYear());


}

var eventTypeCheck = function(eventObject) {
    if (eventObject.eventStep === 1) { // 만들어지고 있는 이벤트
        switch (eventObject.eventType) {

            case "textinput1":
                eaDisplaySetting(eventObject);

                data.push({
                    'start': new Date(CLIENTVAR.pageGenerationTime.getTime() + eventObject.eventVideoClickTime * 1000),
                    'content': '<img src="' + eventObject.eventOwnerProfilePicture + '" style="width:32px; height:32px;">' + eventObject.eventContent
                });

                anbado.realtime.postEvent({
                    user_id: 1,
                    video_id: 1,
                    appeared: eventObject.eventVideoClickTime,
                    disappeared: eventObject.eventVideoClickTime + eventObject.eventVideoClickDuration,
                    content: eventObject.eventContent,
                    category: 'text',
                    parent_id: -1,
                    permission: 'public',
                    coord: [eventObject.eventPosX, eventObject.eventPosY],
                    size: [200, 100]
                });


                drawTimelineVisualization();

                break;
            case "textinput2":
                eaDisplaySetting(eventObject);
                break;
            case "emoticon0":
                eaDisplaySetting(eventObject);
                data.push({
                    'start': new Date(CLIENTVAR.pageGenerationTime.getTime() + eventObject.eventVideoClickTime * 1000),
                    'content': '<img src="' + eventObject.eventOwnerProfilePicture + '" style="width:32px; height:32px;">' + '<img src="' + eventObject.eventContent + '"style="width:32px; height:32px;">'
                });

                anbado.realtime.postEvent({
                    user_id: 1,
                    video_id: 1,
                    appeared: eventObject.eventVideoClickTime,
                    disappeared: eventObject.eventVideoClickTime + eventObject.eventVideoClickDuration,
                    content: eventObject.eventContent,
                    category: 'image',
                    parent_id: -1,
                    permission: 'public',
                    coord: [eventObject.eventPosX, eventObject.eventPosY],
                    size: [200, 100]
                });
                drawTimelineVisualization();
                break;
            case "emoticon1":
                eaDisplaySetting(eventObject);
                data.push({
                    'start': new Date(CLIENTVAR.pageGenerationTime.getTime() + eventObject.eventVideoClickTime * 1000),
                    'content': '<img src="' + eventObject.eventOwnerProfilePicture + '" style="width:32px; height:32px;">' + '<img src="' + eventObject.eventContent + '"style="width:32px; height:32px;">'
                });

                anbado.realtime.postEvent({
                    user_id: 1,
                    video_id: 1,
                    appeared: eventObject.eventVideoClickTime,
                    disappeared: eventObject.eventVideoClickTime + eventObject.eventVideoClickDuration,
                    content: eventObject.eventContent,
                    category: 'image',
                    parent_id: -1,
                    permission: 'public',
                    coord: [eventObject.eventPosX, eventObject.eventPosY],
                    size: [200, 100]
                });

                drawTimelineVisualization();
                break;
            case "emoticon2":
                eaDisplaySetting(eventObject);
                data.push({
                    'start': new Date(CLIENTVAR.pageGenerationTime.getTime() + eventObject.eventVideoClickTime * 1000),
                    'content': '<img src="' + eventObject.eventOwnerProfilePicture + '" style="width:32px; height:32px;">' + '<img src="' + eventObject.eventContent + '"style="width:32px; height:32px;">'
                });
                anbado.realtime.postEvent({
                    "user_id": 1,
                    "video_id": 1,
                    "appeared": eventObject.eventVideoClickTime,
                    "disappeared": eventObject.eventVideoClickTime + eventObject.eventVideoClickDuration,
                    "content": eventObject.eventContent,
                    "category": 'image',
                    "parent_id": -1,
                    "permission": 'public',
                    "coord": [eventObject.eventPosX, eventObject.eventPosY],
                    "size": [200, 100]


                });
                drawTimelineVisualization();
                break;
            case "emoticon3":
                eaDisplaySetting(eventObject);
                data.push({
                    'start': new Date(CLIENTVAR.pageGenerationTime.getTime() + eventObject.eventVideoClickTime * 1000),
                    'content': '<img src="' + eventObject.eventOwnerProfilePicture + '" style="width:32px; height:32px;">' + '<img src="' + eventObject.eventContent + '"style="width:32px; height:32px;">'
                });
                anbado.realtime.postEvent({
                    "user_id": 1,
                    "video_id": 1,
                    "appeared": eventObject.eventVideoClickTime,
                    "disappeared": eventObject.eventVideoClickTime + eventObject.eventVideoClickDuration,
                    "content": eventObject.eventContent,
                    "category": 'image',
                    "parent_id": -1,
                    "permission": 'public',
                    "coord": [eventObject.eventPosX, eventObject.eventPosY],
                    "size": [200, 100]
                });
                drawTimelineVisualization();
                break;

            default :
                console.log("not in event type");
                break;


        }
    }
    if (eventObject.eventStep === 3) {          // 외부 이미지 입력하는 경우
        switch (eventObject.eventType) {
            case "textinput1":
                eaDisplaySetting(eventObject);

                data.push({
                    'start': new Date(CLIENTVAR.pageGenerationTime.getTime() + eventObject.eventVideoClickTime * 1000),
                    'content': '<img src="' + eventObject.eventOwnerProfilePicture + '" style="width:32px; height:32px;">' + eventObject.eventContent
                });


                drawTimelineVisualization();

                break;
            case "textinput2":
                eaDisplaySetting(eventObject);
                break;
            case "emoticon0":
                eaDisplaySetting(eventObject);
                data.push({
                    'start': new Date(CLIENTVAR.pageGenerationTime.getTime() + eventObject.eventVideoClickTime * 1000),
                    'content': '<img src="' + eventObject.eventOwnerProfilePicture + '" style="width:32px; height:32px;">' + '<img src="' + eventObject.eventContent + '"style="width:32px; height:32px;">'
                });


                drawTimelineVisualization();
                break;
            case "emoticon1":
                eaDisplaySetting(eventObject);
                data.push({
                    'start': new Date(CLIENTVAR.pageGenerationTime.getTime() + eventObject.eventVideoClickTime * 1000),
                    'content': '<img src="' + eventObject.eventOwnerProfilePicture + '" style="width:32px; height:32px;">' + '<img src="' + eventObject.eventContent + '"style="width:32px; height:32px;">'
                });


                drawTimelineVisualization();
                break;
            case "emoticon2":
                eaDisplaySetting(eventObject);
                data.push({
                    'start': new Date(CLIENTVAR.pageGenerationTime.getTime() + eventObject.eventVideoClickTime * 1000),
                    'content': '<img src="' + eventObject.eventOwnerProfilePicture + '" style="width:32px; height:32px;">' + '<img src="' + eventObject.eventContent + '"style="width:32px; height:32px;">'
                });

                drawTimelineVisualization();
                break;
            case "emoticon3":
                eaDisplaySetting(eventObject);
                data.push({
                    'start': new Date(CLIENTVAR.pageGenerationTime.getTime() + eventObject.eventVideoClickTime * 1000),
                    'content': '<img src="' + eventObject.eventOwnerProfilePicture + '" style="width:32px; height:32px;">' + '<img src="' + eventObject.eventContent + '"style="width:32px; height:32px;">'
                });

                drawTimelineVisualization();
                break;

            default :
//                alert(eventObject.eventType);
                break;

        }
    }
}


var commentReply = function(eventObject) { // stage mousedown event 가 발생하므로, 여기서 바로 패널을 옮김

    //TODO: diplayInput 패널 함수에 조건을 통해 이 함수를 합쳐야함. 조건체크를 해야하기 때문
    isItCommentReply = true;
    console.log("this is " + eventObject);


// 선 그리기 위한 컴포넌트들
    var shape = new createjs.Shape();
    shape.regX = 20;
    shape.regY = -20;
    var graphics = shape.graphics;
    var color = createjs.Graphics.getHSL(
        Math.cos((32) * 0.01) * 180,
        100,
        50,
        1.0);
    graphics.setStrokeStyle(10, "round").beginStroke(color);
    eventObject.eaCanvasDisplayObject.addChildAt(shape, 1);


    console.log(eventObject.parentEventID);
    if (eventObject.parentEventID === -1) { // 혼자 있던 이벤트를 클릭한 경우. 이 경우 eventObject는 클릭된 이벤트 정보가 넘어온다.
        console.log("in minus one");
        eventObject.parentEventID = eventObject.eventID; // 대댓글 연결이 시작되지 않은 상태에서는 클릭된 원본 아이디의 위치를 기억함
        CLIENTVAR.tempEvent.x = eventObject.eventPosX + 40;

        CLIENTVAR.tempEvent.y = eventObject.eventPosY + 66 * (eventObject.childrenIDarray.length + 1);
//        eventObject.childrenIDarray.push(eventObject.eventID); // 하위 이벤트들의 아이디를 기록함


        shape.graphics.moveTo(eventObject.childrenIDarray.length === 0 ? eventObject.eventPosX : eventObject.eventPosX + 40, eventObject.eventPosY + 66 * (eventObject.childrenIDarray.length))
            .lineTo(eventObject.eventPosX + 40, eventObject.eventPosY + 66 * (eventObject.childrenIDarray.length + 1));
    }
    else {
        console.log("else case"); // 최상위 객체 이외의 연관 객체 중 하나를 선택한 경우
        CLIENTVAR.tempEvent.parentEventID = eventObject.parentEventID; // 이미 댓글이 달려있는 경우에는 그것을 고려하여 최상위 이벤트를 기록함
        CLIENTVAR.tempEvent.x = eventObject.eventPosX;

        CLIENTVAR.tempEvent.y = CLIENTVAR.eventList[eventObject.parentEventID].eventPosY + 66 * (CLIENTVAR.eventList[eventObject.parentEventID].childrenIDarray.length + 1);
        console.log(CLIENTVAR.eventList[eventObject.parentEventID]);
        console.log(CLIENTVAR.eventList[eventObject.parentEventID].childrenIDarray);


        // easeljs 를 통해 선을 그림
        for (var temp = 0; temp < CLIENTVAR.eventList[eventObject.parentEventID].childrenIDarray.length; temp++) {
            console.log("in for");

            // set up our drawing properties:

            shape.graphics.moveTo(CLIENTVAR.eventList[eventObject.parentEventID].eventPosX, CLIENTVAR.eventList[eventObject.parentEventID].eventPosY)
                .lineTo(CLIENTVAR.eventList[CLIENTVAR.eventList[eventObject.parentEventID].childrenIDarray[temp]].eventPosX, CLIENTVAR.eventList[CLIENTVAR.eventList[eventObject.parentEventID].childrenIDarray[temp]].eventPosY);
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

function eaDisplaySetting(eventObject) { // 객체를 캔버스에 저장하고 이벤트를 리스트에 넣게 되는 단계 (이것은 그리는 단계에서는 그러하고, 서버에서 받아오는 단계에서는 미리 저장한다


    var textFont = 'Nanum Gothic';
    eventObject.eaCanvasDisplayObject = new createjs.Container();

//    eventObject.eaCanvasDisplayObject.addEventListener("click", function() {
//        commentReply(eventObject);
////        saveCoord(eventObject);
//    });// 현재 이벤트를 클릭했을 경우 이에 대한 대댓글 기능이 제공됨


//
//
//
//    var eaBackNamePanel = new createjs.Shape();
//    eaBackNamePanel.graphics.beginFill('rgba(100,25,33,0.5)').drawRoundRect(eventObject.eventPosX, eventObject.eventPosY, eaTextName.getMeasuredWidth() + 30, eaTextName.getMeasuredHeight() + 3, 43); // 불투명도가 계속해서 높아지는 버그가 있음. easeljs issue인 듯
//    eaBackNamePanel.regX = -2;
//    eaBackNamePanel.regY = 27;
//
//    eventObject.eaCanvasDisplayObject.addChild(eaBackNamePanel);


    var eaTextName = new createjs.Text('날아올라라황금독수리', "bold 13px " + textFont.toString(), "#0099ff");
    eaTextName.regX = -10;
    eaTextName.regY = 23;
    eaTextName.x = eventObject.eventPosX;
    eaTextName.y = eventObject.eventPosY;




    if (eventObject.eventType === 'textinput1' || eventObject.eventType === 'textinput2') {

        if (eventObject.eventTypeArg === "textinput2") {
            eventObject.eventPosX = 100;
            eventObject.eventPosY = 0 + CLIENTVAR.totalChat * 50;
            CLIENTVAR.totalChat++;

        }



        var eaTextContent = new createjs.Text(eventObject.eventContent, $("#fontSizeSelect").val() + "px " + textFont.toString(), "#ffffff");
        eaTextContent.regX = -10;
        eaTextContent.regY = 5;
        eaTextContent.x = eventObject.eventPosX;
        eaTextContent.y = eventObject.eventPosY;

        var eaBackPanel = new createjs.Shape();
        eaBackPanel.graphics.beginFill("rgba(0,25,0,0.5)").drawRoundRect(eventObject.eventPosX, eventObject.eventPosY, (eaTextContent.getMeasuredWidth()>eaTextName.getMeasuredWidth() ? eaTextContent.getMeasuredWidth() : eaTextName.getMeasuredWidth()) + 80, eaTextContent.getMeasuredHeight() + 30, 43); // 불투명도가 계속해서 높아지는 버그가 있음. easeljs issue인 듯
        eaBackPanel.regX = 27;
        eaBackPanel.regY = 27;



        // 백패널 추가후 텍스트 올림
        eventObject.eaCanvasDisplayObject.addChild(eaBackPanel); // 뒷 배경과 무관하게 넣어주기 위해서 백패널을 이용함
        eventObject.eaCanvasDisplayObject.addChild(eaTextName);

        eventObject.eaCanvasDisplayObject.addChild(eaTextContent);
    }
    else if (eventObject.eventType === "emoticon0" || eventObject.eventType === "emoticon1" || eventObject.eventType === "emoticon2" || eventObject.eventType === "emoticon3") {
        // TODO: edit if statement using indexOf method.
        var eaTempEmoticon = new createjs.Bitmap(eventObject.eventContent); // make emoticon easeljs object

        eaTempEmoticon.regX = 0;
        eaTempEmoticon.regY = 0;
        eaTempEmoticon.x = eventObject.eventPosX;
        eaTempEmoticon.y = eventObject.eventPosY;
        eaTempEmoticon.scaleX = eaTempEmoticon.scaleY = eaTempEmoticon.scale = 0.4;

        var eaBackPanel = new createjs.Shape();
        eaBackPanel.graphics.beginFill("rgba(0,25,0,0.5)").drawRoundRect(eventObject.eventPosX, eventObject.eventPosY, eaTextName.getMeasuredWidth() + 70, 80, 43); // 불투명도가 계속해서 높아지는 버그가 있음. easeljs issue인 듯
        eaBackPanel.regX = 27;
        eaBackPanel.regY = 27;

        eventObject.eaCanvasDisplayObject.addChild(eaBackPanel); // 뒷 배경과 무관하게 넣어주기 위해서 백패널을 이용함
        eventObject.eaCanvasDisplayObject.addChild(eaTextName);
        eventObject.eaCanvasDisplayObject.addChild(eaTempEmoticon);
    }

    var eaProfileImage = new createjs.Bitmap(eventObject.eventOwnerProfilePicture); // profile example
    eaProfileImage.regX = 0;
    eaProfileImage.regY = 0;
    eaProfileImage.x = eventObject.eventPosX - 20;
    eaProfileImage.y = eventObject.eventPosY - 20;
    eaProfileImage.scaleX = eaProfileImage.scaleY = eaProfileImage.scale = 0.1;


    eventObject.eaCanvasDisplayObject.addChild(eaProfileImage); // 뒷 배경과 무관하게 넣어주기 위해서 백패널을 이용함

    if (eventObject.eventTypeArg === "textinput2") {


        CLIENTVAR.chatLeftStage.addChild(eventObject.eaCanvasDisplayObject);
        CLIENTVAR.chatLeftStage.update();


    }
    else { // 일반 텍스트 입력 및 이모티콘인 경우 경우
        CLIENTVAR.stage.addChild(eventObject.eaCanvasDisplayObject);
        CLIENTVAR.stage.update();
    }


//    console.log("parent ID mark : " + eventObject.parentEventID);

    if (eventObject.parentEventID !== -1) { // 최상위 객체인지 확인하고 그게 아닌 경우에 이벤트에 관계 목록을 추가한다.

        CLIENTVAR.eventList[eventObject.parentEventID].childrenIDarray.push(eventObject.eventID); // 하위 이벤트들의 아이디를 기록함 최상위 부모 노드에 기록함
    }
    CLIENTVAR.eventList.push(eventObject); // 전체 이벤트 목록에 저장

    // 밑의 타임라인에 저장


//    CLIENTVAR.chatRightStage.addChild(eventObject.eaCanvasDisplayObject);
//    CLIENTVAR.chatRightStage.update();

    eventObject.eventStep = 2;
    CLIENTVAR.totalEvent++; // 이벤트 아이디를 증가시


    endup();
}


function endup() { // 이벤트 후 처리 부분

    CLIENTVAR.stage.update();

//    inputPanel.deletePanel();

    setTimeout(function() {
        getFocus();
    }, 100);// TODO: getFocus 함수 손보기. 타임아웃 방식보다 더 안정적인 방식을 적용할 것.
}


function getFocus() {

    $("#textinput1").focus();
}


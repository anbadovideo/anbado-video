/**
 *
 * Date: 9/22/13
 *
 * @author anbado video, haksudol
 * @since 0.1
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
 *
 */


var anbado = window.anbado || {};


function thinkGenerate(think) { // video interaction event generation




    if (think.step === 1) { // 생성중인 이벤트
        think.occuredAbsoluteTime = (new Date());
        think.clickTime = CLIENTVAR.popcornobj.currentTime();
        think.permission = "friends";
        think.secUnit = 100 * Math.round(CLIENTVAR.popcornobj.currentTime() / CLIENTVAR.popcornobj.duration());
        think.parentID = CLIENTVAR.transferEvent.parentID === undefined ? -1 : CLIENTVAR.transferEvent.parentID;
        think.childrenIDarray = [];

        thinkTypeCheck(think);


//        console.log("current" + think.clickTime);
        endup();
    }
    else if (think.step === 3) {// 생성å완료된 이벤트의 경우

        thinkTypeCheck(think);
//        console.log("current" + think.clickTime);


    }


//
//    var eventObject = {
//        ID : CLIENTVAR.totalEvent,
//
////        ownerName : "owner",
////        profileImg : "asset/assetImages/profile1.png",
////        clickTime : CLIENTVAR.popcornobj.currentTime(), // 플레어에서의 currentTime을 받는 것으로. 상대 시간
////        occuredAbsoluteTime : (new Date()), // 이벤트가 생성된 현재 시간.(실제 현실 시간, 이를 이용해 사용자가 남긴 반응들을 시점별로 정렬이 가능)
////        displayDuration : 4, // 얼마나 지속되는지
////        x : CLIENTVAR.tempEvent.x ,  // 화면의 디스플레이를 표시하도록. 실제로 디스플레이 되는 것은 eaCanvasDisplayObject이나 좌표값은 보존한다.
////        y : CLIENTVAR.tempEvent.y ,
////        timelineOffset : {},  // 타임라인에서 얼마나 떨어져 있는가?
////        category : eventArgType, // event type e.g text, emoticon, image, button action, webcam
////        content : eventArgContent,
////        permission : $("#permissionSelect").val(),
////        secUnit : 100* Math.round(CLIENTVAR.popcornobj.currentTime() / CLIENTVAR.popcornobj.duration()),// 몇번째 유닛인지?
////        eaCanvasObject : {}, // easeljs 객체를 추가해주기 위해서 컨테이너를 하위 속성으로 가지고 있음.
//
////        hasParent : false, // 이것이 최상위 이벤트인가? 밑에 댓글이 달려있는가? 부모 이벤트가 없다면 최상위 이벤트(이거나 독립 이벤트)로 간주
////        parent : {}, // 이미 달린 반응에 클릭해서 남기는 경우 그에 대한 부모 이벤트 아이디를 저장함 TODO: 저장할 필요가 있나? 이미 아이디를 가지는데 객체를 저장할 필요는 없지 않을까?
////        parentID: CLIENTVAR.tempEvent.parentID === undefined ? -1 : CLIENTVAR.tempEvent.parentID , // 0 인 경우에 단독이고, 부모 이벤트 아이디가 있는 경우
////        childrenIDarray:[] // 자식들이 생기게 되면 이를 표현해줌. 객체 배열을 가지지 말고 eventList에서 참조할 수 있도록 아이디만 가지고 가도록
//    };

//    eventObject.getFullYear(),this.getMonth()+1,this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds()


//

    // Called when the Visualization API is loaded.
//
//    if(eventTextSeparation){
//
//    }

//    console.log(eventObject.occuredAbsoluteTime.getFullYear());


}

var thinkTypeCheck = function(think) {
    if (think.step === 1) { // 만들어지고 있는 이벤트


        switch (think.category) {

            case "textinput1":

                eaDisplaySetting(think);

                data.push({
                    'start': new Date(CLIENTVAR.pageGenerationTime.getTime() + think.clickTime * 1000),
                    'content': '<img src="' + think.profileImg.src + '" style="width:32px; height:32px;">' + think.content
                });


                anbado.realtime.postEvent({
                    user_id: userID,
                    video_id: videoID,
                    appeared: think.clickTime,
                    disappeared: think.clickTime + 5,
                    content: think.content,
                    category: 'text',
                    parent_id: -1,
                    permission: 'public',
                    coord: [think.x, think.y],
                    size: [200, 100]
                });

                drawTimelineVisualization();

                break;
            case "textinput2":
                eaDisplaySetting(think);
                break;
            case "image":
                eaDisplaySetting(think);
                data.push({
                    'start': new Date(CLIENTVAR.pageGenerationTime.getTime() + think.clickTime * 1000),
                    'content': '<img src="' + think.profileImg.src + '" style="width:32px; height:32px;">' + '<img src="' + think.content + '"style="width:32px; height:32px;">'
                });

                anbado.realtime.postEvent({
                    user_id: userID,
                    video_id: videoID,
                    appeared: think.clickTime,
                    disappeared: think.clickTime + 5,
                    content: think.content,
                    category: 'image',
                    parent_id: -1,
                    permission: 'public',
                    coord: [think.x, think.y],
                    size: [200, 100]
                });
                drawTimelineVisualization();
                break;

            default :
                console.log("not in event type");
                break;
        }



        happybutton(think); // 외부 이벤트의 경우에는 차트를 증가시키지 않음
    }
    if (think.step === 3) {          // 서버로부터 생각 입력하는 경우

        switch (think.category) {
            case "textinput1":
                eaDisplaySetting(think);

                data.push({
                    'start': new Date(CLIENTVAR.pageGenerationTime.getTime() + think.clickTime * 1000),
                    'content': '<img src="' + think.profileImg.src + '" style="width:32px; height:32px;">' + think.content
                });

                drawTimelineVisualization();

                break;
            case "textinput2":
//                eaDisplaySetting(eventObject);
                break;
            case 'image':
                eaDisplaySetting(think);
                data.push({
                    'start': new Date(CLIENTVAR.pageGenerationTime.getTime() + think.clickTime * 1000),
                    'content': '<img src="' + think.profileImg.src + '" style="width:32px; height:32px;">' + '<img src="' + think.content + '"style="width:32px; height:32px;">'
                });

                drawTimelineVisualization();
                break;

            default :
//                alert(eventObject.category);
                break;

        }
    }
}


var commentReply = function(think) { // stage mousedown event 가 발생하므로, 여기서 바로 패널을 옮김

    //TODO: diplayInput 패널 함수에 조건을 통해 이 함수를 합쳐야함. 조건체크를 해야하기 때문
    isItCommentReply = true;
//    console.log("this is " + think);


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
    think.eaCanvasDisplayObject.addChildAt(shape, 1);


//    console.log(think.parentID);
    if (think.parentID === -1) { // 혼자 있던 이벤트를 클릭한 경우. 이 경우 eventObject는 클릭된 이벤트 정보가 넘어온다.
//        console.log("in minus one");
        think.parentID = think.ID; // 대댓글 연결이 시작되지 않은 상태에서는 클릭된 원본 아이디의 위치를 기억함
        CLIENTVAR.tempEvent.x = think.x + 40;

        CLIENTVAR.tempEvent.y = think.y + 66 * (think.childrenIDarray.length + 1);
//        eventObject.childrenIDarray.push(eventObject.ID); // 하위 이벤트들의 아이디를 기록함


        shape.graphics.moveTo(think.childrenIDarray.length === 0 ? think.x : think.x + 40, think.y + 66 * (think.childrenIDarray.length))
            .lineTo(think.x + 40, think.y + 66 * (think.childrenIDarray.length + 1));
    }
    else {
        console.log("else case"); // 최상위 객체 이외의 연관 객체 중 하나를 선택한 경우
        CLIENTVAR.tempEvent.parentID = think.parentID; // 이미 댓글이 달려있는 경우에는 그것을 고려하여 최상위 이벤트를 기록함
        CLIENTVAR.tempEvent.x = think.x;

        CLIENTVAR.tempEvent.y = CLIENTVAR.eventList[think.parentID].y + 66 * (CLIENTVAR.eventList[think.parentID].childrenIDarray.length + 1);
//        console.log(CLIENTVAR.eventList[think.parentID]);
//        console.log(CLIENTVAR.eventList[think.parentID].childrenIDarray);


        // easeljs 를 통해 선을 그림
        for (var temp = 0; temp < CLIENTVAR.eventList[think.parentID].childrenIDarray.length; temp++) {
//            console.log("in for");

            // set up our drawing properties:

            shape.graphics.moveTo(CLIENTVAR.eventList[think.parentID].x, CLIENTVAR.eventList[think.parentID].y)
                .lineTo(CLIENTVAR.eventList[CLIENTVAR.eventList[think.parentID].childrenIDarray[temp]].x, CLIENTVAR.eventList[CLIENTVAR.eventList[think.parentID].childrenIDarray[temp]].y);
//            // start the line at the last position:
//            graphics.moveTo(CLIENTVAR.eventList[eventObject.parentID].x,CLIENTVAR.eventList[eventObject.parentID].y);
//
//            // calculate the new position in the shape's local coordinate space:
////        lastPt = shape.globalToLocal(_mouseX,_mouseY);
//
//            // draw the line, and close the path:
//            graphics.lineTo(eventList[CLIENTVAR.eventList[eventObject.parentID].childrenIDarray[temp]].x,eventList[CLIENTVAR.eventList[eventObject.parentID].childrenIDarray[temp]].y);
        }
    }
    displayInputPanel(CLIENTVAR.tempEvent);
}



function eaDisplaySetting(think) { // 객체를 캔버스에 저장하고 이벤트를 리스트에 넣게 되는 단계 (이것은 그리는 단계에서는 그러하고, 서버에서 받아오는 단계에서는 미리 저장한다



    var textFont = 'Nanum Gothic';
    think.eaCanvasDisplayObject = new createjs.Container();

//    think.eaCanvasDisplayObject.addEventListener("click", function() {
//        commentReply(think);
////        saveCoord(think);
//    });// 현재 이벤트를 클릭했을 경우 이에 대한 대댓글 기능이 제공됨


//
//
//
//    var eaBackNamePanel = new createjs.Shape();
//    eaBackNamePanel.graphics.beginFill('rgba(100,25,33,0.5)').drawRoundRect(think.x, think.y, eaTextName.getMeasuredWidth() + 30, eaTextName.getMeasuredHeight() + 3, 43); // 불투명도가 계속해서 높아지는 버그가 있음. easeljs issue인 듯
//    eaBackNamePanel.regX = -2;
//    eaBackNamePanel.regY = 27;
//
//    think.eaCanvasDisplayObject.addChild(eaBackNamePanel);


    var eaTextName = new createjs.Text(think.ownerName, 'bold 11px ' + textFont.toString(), '#0099ff');
    eaTextName.regX = -2;
    eaTextName.regY = 23;
    eaTextName.x = think.x;
    eaTextName.y = think.y;

    if (think.category === 'textinput1' || think.category === 'textinput2') {

        if (think.eventTypeArg === "textinput2") {
            think.x = 100;
            think.y = 0 + CLIENTVAR.totalChat * 50;
            CLIENTVAR.totalChat++;

        }

        var eaTextContent = new createjs.Text(think.content, 15 + "px " + textFont.toString(), "#ffffff");
        eaTextContent.regX = -2;
        eaTextContent.regY = 10;
        eaTextContent.x = think.x;
        eaTextContent.y = think.y;
        eaTextContent.shadowColor = "red";

        var eaBackPanel = new createjs.Shape();
        eaBackPanel.graphics.beginFill("rgba(0,0,0,0.3)").drawRoundRect(think.x, think.y, (eaTextContent.getTransformedBounds().width>eaTextName.getTransformedBounds().width ? eaTextContent.getTransformedBounds().width : eaTextName.getTransformedBounds().width) + 60, eaTextContent.getTransformedBounds().height+ 23, 100); // 불투명도가 계속해서 높아지는 버그가 있음. easeljs issue인 듯
        eaBackPanel.regX = 40;
        eaBackPanel.regY = 27;

        // 백패널 추가후 텍스트 올림
        think.eaCanvasDisplayObject.addChild(eaBackPanel); // 뒷 배경과 무관하게 넣어주기 위해서 백패널을 이용함
        think.eaCanvasDisplayObject.addChild(eaTextName);

        think.eaCanvasDisplayObject.addChild(eaTextContent);
    }
    else if (think.category === 'image') {
//    else if (think.category === "emoticon0"  || think.category === "emoticon1" || think.category === "emoticon2" || think.category === "emoticon3") {
        // TODO: edit if statement using indexOf method.
        var eaTempEmoticon = new createjs.Bitmap(think.content); // make emoticon easeljs object

        eaTempEmoticon.regX = 0;
        eaTempEmoticon.regY = 0;
        eaTempEmoticon.x = think.x + 7;
        eaTempEmoticon.y = think.y - 5;
        eaTempEmoticon.scaleX = eaTempEmoticon.scaleY = eaTempEmoticon.scale = 0.4;

        var eaBackPanel = new createjs.Shape();
        eaBackPanel.graphics.beginFill("rgba(0,25,0,0.5)").drawRoundRect(think.x, think.y, (eaTempEmoticon.getTransformedBounds().width>eaTextName.getTransformedBounds().width ? eaTempEmoticon.getTransformedBounds().width : eaTextName.getTransformedBounds().width) + 64, eaTempEmoticon.getTransformedBounds().height + eaTextName.getTransformedBounds().height + 10, 100); // 불투명도가 계속해서 높아지는 버그가 있음. easeljs issue인 듯
        eaBackPanel.regX = 40;
        eaBackPanel.regY = 23;

        think.eaCanvasDisplayObject.addChild(eaBackPanel); // 뒷 배경과 무관하게 넣어주기 위해서 백패널을 이용함
        think.eaCanvasDisplayObject.addChild(eaTextName);
        think.eaCanvasDisplayObject.addChild(eaTempEmoticon);
    }

//    think.profileImg.id = 'profileImg';
//    $('body').append(think.profileImg);
//    think.profileImg.width = 250;
//    think.profileImg.height = 250;
//    think.profileImg.setAttribute('background-repeat','no-repeat');
//    think.profileImg.setAttribute('overflow','hidden');
//    document.getElementById('profileImg').height = 400;
//    document.getElementById('profileImg').width = 400;


    var eaProfileImage = new createjs.Shape();
    var profileRadius;
    profileRadius = (think.profileImg.width > think.profileImg.height ? think.profileImg.height/2 : think.profileImg.width/2); // 프로파일 반지름을 설정해줌. 짦은 변을 기준으로
    eaProfileImage.graphics.beginBitmapFill(think.profileImg).drawCircle(think.profileImg.width/2, think.profileImg.height/2, profileRadius); //

    eaProfileImage.scaleX = 17 / profileRadius; // 스케일을 조정하여 사이즈 조절
    eaProfileImage.scaleY = 17 / profileRadius;

//    eaProfileImage.graphics.beginBitmapFill(think.profileImg).drawCircle(think.profileImg.width/2, think.profileImg.height/2, (think.profileImg.width > think.profileImg.height ? 50 : 50)); // profile example. 가로 세로중 짦은 변의 1/2를 반지름으로 하게 된다.

//    eaProfileImage.scaleX = eaProfileImage.scaleY = eaProfileImage.scale = 0.5;
    eaProfileImage.regX = 0;
    eaProfileImage.regY = 0;

    eaProfileImage.x = think.x - 41;
    eaProfileImage.y = think.y - 20;




//    setTimeout(function(){
//        var eaProfileImage = new createjs.Bitmap(think.profileImg); // profile example
//        eaProfileImage.regX = 0;
//        eaProfileImage.regY = 0;
//        eaProfileImage.x = think.x - 50;
//        eaProfileImage.y = think.y - 20;
//        eaProfileImage.scaleX = eaProfileImage.scaleY = eaProfileImage.scale = 0.3;

//        console.log("GETBOUNDSSSSSSSSSSSSSSSSSSSSSS" + eaProfileImage.getTransformedBounds());
//        console.log("GETBOUNDSSSSSSSSSSSSSSSSSSSSSS" + eaProfileImage);
//    console.log('eaprofile' + eaProfileImage.width);
//    var positionBounds = eaProfileImage.getTransformedBounds();
//
//    console.log('positionbounds' + positionBounds);
//        var eaProfileOutside = new createjs.Shape();
//        eaProfileOutside.graphics.beginFill("#000").beginStroke("rgba(255,255,255,1)").drawCircle(positionBounds.x + positionBounds.width/2,positionBounds.y + positionBounds.height/2,positionBounds.width/2 - 1).endStroke();
//        eaProfileImage.mask = eaProfileOutside;
    think.eaCanvasDisplayObject.addChild(eaProfileImage); // 뒷 배경과 무관하게 넣어주기 위해서 백패널을 이용함
//    },150);


    if (think.eventTypeArg === "textinput2") {

        CLIENTVAR.chatLeftStage.addChild(think.eaCanvasDisplayObject);
        CLIENTVAR.chatLeftStage.update();
    }
    else { // 일반 텍스트 입력 및 이모티콘인 경우 경우
        CLIENTVAR.stage.addChild(think.eaCanvasDisplayObject);
//        CLIENTVAR.stage.update();
    }


//    console.log("parent ID mark : " + think.parentID);

    if (think.parentID !== -1) { // 최상위 객체인지 확인하고 그게 아닌 경우에 이벤트에 관계 목록을 추가한다.

        CLIENTVAR.eventList[think.parentID].childrenIDarray.push(think.ID); // 하위 이벤트들의 아이디를 기록함 최상위 부모 노드에 기록함
    }
    CLIENTVAR.eventList.push(think); // 전체 이벤트 목록에 저장
//    CLIENTVAR.thinkTriggerList[Math.floor(think.clickTime)].push(think);

    // 밑의 타임라인에 저장


//    CLIENTVAR.chatRightStage.addChild(think.eaCanvasDisplayObject);
//    CLIENTVAR.chatRightStage.update();

    think.step = 2;
    CLIENTVAR.totalEvent++; // 이벤트 아이디를 증가시


    endup();
}


function endup() { // 이벤트 후 처리 부분

//    CLIENTVAR.stage.update();

//    inputPanel.deletePanel();

//    setTimeout(function() {
//        getFocus();
//    }, 100);// TODO: getFocus 함수 손보기. 타임아웃 방식보다 더 안정적인 방식을 적용할 것.
}

function getFocus() {

    $("#textinput1").focus();
}


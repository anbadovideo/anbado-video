/**
 * User: haksudol
 * Date: 9/22/13
 * Time: 2:23 PM
 * To change this template use File | Settings | File Templates.
 */



var anbado = window.anbado || {};


document.addEventListener("DOMContentLoaded", function() {


});

function saveCoord(evt) {

    console.log("evt " + evt);

    var eventObject = {  // 전역 이벤트 없이 통과해가며 완성됨
        eventID: {},
        eventStep: 0, // 0은 생성상태. 1은 생성 중. 2는 생성완료

        eventOwnerID: {},
        eventOwnerName: "owner",
        eventOwnerProfilePicture: "examples/img/profile0.png",
        eventVideoClickTime: {}, // 플레어에서의 currentTime을 받는 것으로. 상대 시간
        eventOccuredAbsoluteTime: {}, // 이벤트가 생성된 현재 시간.(실제 현실 시간, 이를 이용해 사용자가 남긴 반응들을 시점별로 정렬이 가능)
        eventVideoClickDuration: 4, // 얼마나 지속되는지
        eventPosX: {},  // 화면의 디스플레이를 표시하도록. 실제로 디스플레이 되는 것은 eaCanvasDisplayObject이나 좌표값은 보존한다.
        eventPosY: {},
        timelineOffset: {},  // 타임라인에서 얼마나 떨어져 있는가?
        eventType: {}, // event type e.g text, emoticon, image, button action, webcam
        eventContent: {}, // 이모티콘인 경우에 주소를
        eventPermission: {},
        secUnit: {},// 몇번째 유닛인지?
        eaCanvasisplayObject: {}, // easeljs 객체를 추가해주기 위해서 컨테이너를 하위 속성으로 가지고 있음.

        itHasParent: false, // 이것이 최상위 이벤트인가? 밑에 댓글이 달려있는가? 부모 이벤트가 없다면 최상위 이벤트(이거나 독립 이벤트)로 간주
        parentEvent: {}, // 이미 달린 반응에 클릭해서 남기는 경우 그에 대한 부모 이벤트 아이디를 저장함 TODO: 저장할 필요가 있나? 이미 아이디를 가지는데 객체를 저장할 필요는 없지 않을까?
        parentEventID: -1, // 0 인 경우에 단독이고, 부모 이벤트 아이디가 있는 경우
        childrenIDarray: [] // 자식들이 생기게 되면 이를 표현해줌. 객체 배열을 가지지 말고 eventList에서 참조할 수 있도록 아이디만 가지고 가도록
    }; // 이벤트의 생성시점


    eventObject.eventPosX = evt.stageX;
    eventObject.eventPosY = evt.stageY;

    displayInputPanel(eventObject);


}


function displayInputPanel(eventObject) { // on first screen, display text input panel, submit button, emoticon panel


    eventObject.eventStep = 1;


    // alert(eventObject);
    console.log("in displayinputpaenl");

    if (CLIENTVAR.inputPanelShow === false) {


        var tempLocation = $("#canvas1").offset(); // 갠버스의 오프셋을 잡아 이를 스테이지값에 더해야 제대로 인풋 패널 표현이 가능하다.
        console.log(eventObject);


        $("#textinput1").css({"top": eventObject.eventPosY + tempLocation.top + "px", "left": eventObject.eventPosX + tempLocation.left + "px"})
        $("#permissionSelect").css({"top": eventObject.eventPosY + tempLocation.top + "px", "left": eventObject.eventPosX + tempLocation.left + 200 + "px"});
        $("#emoticonPanel").css({"top": eventObject.eventPosY + tempLocation.top + 25 + "px", "left": eventObject.eventPosX + tempLocation.left + "px"});
        $("#profileImg").css({"top": eventObject.eventPosY + tempLocation.top + "px", "left": eventObject.eventPosX + tempLocation.left - 30 + "px"});
        showPanel();
        console.log($("#textinput1").css("left"));


    }
    else if (CLIENTVAR.inputPanelShow === true) { // 클릭이 되어 있는 경우


        hidePanel();
    }

    setTimeout(function() {
        getFocus();
    }, 300);


    $("#textinput1").keyup(function(evt) {

//    $("#textinput1").val("");
        $("#textinput1").attr("size", $("#textinput1").val().length); // by text length size scailing. key by key


        if (evt.keyCode === 13 || evt.charCode === 13) { // 엔터인 경우

            eventObject.eventType = evt.target.id;
            eventObject.eventContent = $("#textinput1").val();

            eventGenerate(eventObject);
//        evt.stopImmediatePropagation();
            endup();
        }

        if (evt.keyCode === 27 || evt.charCode === 27) { // webkit 브라우져에서 keyCode에서의 esc를 못받는 것을 해결하기 위해

            hidePanel();
        }


    }); // 프로퍼게이션을 막기 위해. 그리고 이벤트 리스너의 중복 생성을 막도록 한다.


    var emo0 = document.getElementById("emoticon0");
    emo0.addEventListener("click", function() {
        eventObject.eventType = emo0.id;
        eventObject.eventContent = "examples/img/emoticon0.png";
        eventGenerate(eventObject);
    });
    var emo1 = document.getElementById("emoticon1");
    emo1.addEventListener("click", function() {
        eventObject.eventType = emo1.id;
        eventObject.eventContent = "examples/img/emoticon1.png";
        eventGenerate(eventObject);

    });
    var emo2 = document.getElementById("emoticon2");
    emo2.addEventListener("click", function() {
        eventObject.eventType = emo2.id;
        eventObject.eventContent = "examples/img/emoticon2.png";
        eventGenerate(eventObject);
    });
    var emo3 = document.getElementById("emoticon3");
    emo3.addEventListener("click", function() {
        eventObject.eventContent = "examples/img/emoticon3.png";
        eventObject.eventType = emo3.id;
        eventGenerate(eventObject);
    });


}


function textinput2Keydown(evt) {


    CLIENTVAR.tempEvent.x = 20;
    CLIENTVAR.tempEvent.y = 20;
    $("#textinput1").attr("size", $("#textinput1").val().length); // by text length size scailing. key by key


    if (evt.keyCode == 13) { // 엔터인 경우

        eventGenerate(evt.target.id, evt.target.value);
        endup();
    }
//
//    if(evt.keyCode === 27 || evt.charCode === 27){ // webkit 브라우져에서 keyCode에서의 esc를 못받는 것을 해결하기 위해
//        console.log("escape");
//        hidePanel();
//    }
}


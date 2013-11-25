/**
 * User: anbado video
 * Date: 9/22/13
 * Time: 2:23 PM
 Copyright 2013 anbado video

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



var anbado = window.anbado || {};


document.addEventListener("DOMContentLoaded", function() {


});

/**
 * 캔버스 위를 클릭했을 시에 좌표를 저장하며, think 객체를 생성하고 입력창을 호출하는 역할을 합니다.
 *
 * @param evt easeljs의 스테이지에서 발생한 마우스 이벤트
 */

function saveCoord(evt) {

//    console.log("evt " + evt);

    /**
     * 생각에 대한 정보들을 저장함. TODO : model.js에 따라 사용자 객체와 분리하도록
     *
     * @type {{ID: {}, step: number, ownerID: {}, ownerName: string, profileImg: string, clickTime: {}, occuredAbsoluteTime: {}, displayDuration: number, x: {}, y: {}, timelineOffset: {}, category: {}, content: {}, permission: {}, secUnit: {}, eaCanvasObject: {}, hasParent: boolean, parent: {}, parentID: number, childrenIDarray: Array}}
     */

    var think = {  // 전역 이벤트 없이 통과해가며 완성됨

        ID: {},
        step: 0, // 0은 생성상태. 1은 생성 중. 2는 생성완료

        ownerID: {},
        ownerName: data1.user.name,
        profileImg: new Image(),
        clickTime: {}, // 플레어에서의 currentTime을 받는 것으로. 상대 시간
        occuredAbsoluteTime: {}, // 이벤트가 생성된 현재 시간.(실제 현실 시간, 이를 이용해 사용자가 남긴 반응들을 시점별로 정렬이 가능)
        displayDuration: 4, // 얼마나 지속되는지
        x: {},  // 화면의 디스플레이를 표시하도록. 실제로 디스플레이 되는 것은 eaCanvasDisplayObject이나 좌표값은 보존한다.
        y: {},
        timelineOffset: {},  // 타임라인에서 얼마나 떨어져 있는가?
        category: {}, // event type e.g text, emoticon, image, button action, webcam
        content: {}, // 이모티콘인 경우에 주소를
        permission: {},
        secUnit: {},// 몇번째 유닛인지?
        eaCanvasObject: {}, // easeljs 객체를 추가해주기 위해서 컨테이너를 하위 속성으로 가지고 있음.

        hasParent: false, // 이것이 최상위 이벤트인가? 밑에 댓글이 달려있는가? 부모 이벤트가 없다면 최상위 이벤트(이거나 독립 이벤트)로 간주
        parent: {}, // 이미 달린 반응에 클릭해서 남기는 경우 그에 대한 부모 이벤트 아이디를 저장함 TODO: 저장할 필요가 있나? 이미 아이디를 가지는데 객체를 저장할 필요는 없지 않을까?
        parentID: -1, // 0 인 경우에 단독이고, 부모 이벤트 아이디가 있는 경우
        childrenIDarray: [] // 자식들이 생기게 되면 이를 표현해줌. 객체 배열을 가지지 말고 eventList에서 참조할 수 있도록 아이디만 가지고 가도록
    }; // 이벤트의 생성시점
    think.profileImg.src = data1.user.profile_image;

    think.x = evt.stageX;
    think.y = evt.stageY;
    think.clickTime = CLIENTVAR.popcornobj.currentTime();

    think.profileImg.onload = function(){
        displayInputPanel(think);
    };

}


/**
 * 인풋 패널을 표시하고, 입력 이벤트가 발생하면 이벤트를 생성하도록 한다.
 *
 * @param think : 생각 객체가 전달된다. 클릭해서 입력하는 경우에 호출됨
 */
function displayInputPanel(think) { // on first screen, display text input panel, submit button, emoticon panel
    think.step = 1;

    // alert(think);
//    console.log("in displayinputpaenl");


    if (CLIENTVAR.inputPanelShow === false) {

//        console.log("inputPanelShow");

        var tempLocation = $('#canvas1').offset(); // 갠버스의 오프셋을 잡아 이를 스테이지값에 더해야 제대로 인풋 패널 표현이 가능하다.
//        console.log("inputpanel === false" + think);

//        alert(alert1);

        inputPanel.createPanel(think);
    }
    else if (CLIENTVAR.inputPanelShow === true) { // 클릭이 되어 있는 경우

//        console.log("inputPanelShow True");
        inputPanel.deletePanel();
//        hidePanel();

    }

    setTimeout(function() {
        getFocus();
    }, 300);
}


function textinput2Keydown(evt) {


    CLIENTVAR.tempEvent.x = 20;
    CLIENTVAR.tempEvent.y = 20;
    var jqTextinput = $("#textinput1");
    jqTextinput.attr("size", jqTextinput.val().length); // by text length size scailing. key by key


    if (evt.keyCode == 13) { // 엔터인 경우

        thinkGenerate(evt.target.id, evt.target.value);
        endup();
    }

}


var CLIENTVAR = {
    popcornobj: {}, // global access video object.
    totalEvent: 0,  // total event number
    totalChat: 0,
    currentEventPosition: 0,
    canvaslayer: {}, // canvas overlay
    canvas_bar: {},
    canvas3: {},
    canvas4: {},
    chatStage: {
        rightPanel: {},
        leftPanel: {}
    },
    stage: {},

    stageMousePanelWrapper :{}, // stage이벤트가 발생하여 z-index를 높혀도 클릭이 안되는 문제점을 해결하기 위해 다시 랩핑을 함. TODO: 레이어를 다시 씌우지 않고 해결할 수 있는 방법을 확인할 것

    stage_bar: {},
    time_position: 0,
    eventList: [],
    emoticonNumber: 4,
    eaTextInputField: {}, // 이 네가지 변수는 DOM으로, LOCAL로 전환할 것
    eaTextInputButton: {},
    eaEmotionInputArray: {},
    durationTime: 0,
    tempEvent: {}, // 전역 이벤트를 만들어 좌표를 전달. 패턴 수정 필요
    inputPanelShow : false, // 한번 클릭된 상태라면 다른 쪽을 클릭하면 패널이 사라져야 함
    // timeline.js 변수 들
    good: 0, // good 의 수
    bad: 0,  //bad 의수
    arrayg: [], // good array
    arrayb: [], //bad array
    graphshape: 1, //graphshape sel
    inttime: 0,   // get time
    url:{}, // 현재 플레이어 페이지에서 보이는 URL

    parentEventID: 0,

    eventTextSeparation : true,  // 이벤트에서 텍스트 숫자가 얼마 이상이면 잘라서 다음 이벤트를 만들어 넘겨줌
    eventTextLimitation : 20, // 이벤트의 텍스트 입력의 최대값.

    timeset : 2, //버튼 쿨타임 타임 set
    pageGenerationTime : {} // 페이지가 생성된 시간을 저장하고 이를 통해 타임라인을 형성할 수 있도록 함

    isItCommentReply : false
};
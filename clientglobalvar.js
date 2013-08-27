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
    graphshape: 0, //graphshape sel
    inttime: 0,   // get time
    url:{}
};
var CLIENTVAR = {
    popcornobj: {}, // global access video object. global variable is not recommended
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
    tempEvent: {} // 전역 이벤트를 만들어 좌표를 전달. 패턴 수정 필요
};
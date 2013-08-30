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
    graphshape: 1, //graphshape sel
    inttime: 0,   // get time
    url:{}, // 현재 플레이어 페이지에서 보이는 URL

    eventTextSeparation : true,  // 이벤트에서 텍스트 숫자가 얼마 이상이면 잘라서 다음 이벤트를 만들어 넘겨줌
    eventTextLimitation : 20 // 이벤트의 텍스트 입력의 최대값.

};
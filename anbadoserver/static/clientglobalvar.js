var anbado = window.anbado || {};

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

    stageMousePanelWrapper: {}, // stage이벤트가 발생하여 z-index를 높혀도 클릭이 안되는 문제점을 해결하기 위해 다시 랩핑을 함. TODO: 레이어를 다시 씌우지 않고 해결할 수 있는 방법을 확인할 것

    stage_bar: {},
    time_position: 0,
    eventList: [],
    thinkTriggerList:[],
    emoticonNumber: 4,
    eaTextInputField: {}, // 이 네가지 변수는 DOM으로, LOCAL로 전환할 것
    eaTextInputButton: {},
    eaEmotionInputArray: {},
    durationTime: 0,
//    tempEvent: {}, // 전역 이벤트를 만들어 좌표를 전달. 패턴 수정 필요
    transferEvent: // tempEvent를 대체함.
    {
        eventID: {},
        eventStep: 0, // 0은 생성상태. 1은 생성 중. 2는 생성완료

        eventOwnerID: {},
        eventOwnerName: "owner",
        eventOwnerProfilePicture: "/static/examples/img/profile0.png",
        eventVideoClickTime: {}, // 플레어에서의 currentTime을 받는 것으로. 상대 시간
        eventOccuredAbsoluteTime: {}, // 이벤트가 생성된 현재 시간.(실제 현실 시간, 이를 이용해 사용자가 남긴 반응들을 시점별로 정렬이 가능)
        eventVideoClickDuration: 4, // 얼마나 지속되는지
        eventPosX: {},  // 화면의 디스플레이를 표시하도록. 실제로 디스플레이 되는 것은 eaCanvasDisplayObject이나 좌표값은 보존한다.
        eventPosY: {},
        timelineOffset: {},  // 타임라인에서 얼마나 떨어져 있는가?
        eventType: {}, // event type e.g text, emoticon, image, button action, webcam
        eventContent: {},
        eventPermission: {},
        secUnit: {},// 몇번째 유닛인지?
        eaCanvasisplayObject: {}, // easeljs 객체를 추가해주기 위해서 컨테이너를 하위 속성으로 가지고 있음.

        itHasParent: false, // 이것이 최상위 이벤트인가? 밑에 댓글이 달려있는가? 부모 이벤트가 없다면 최상위 이벤트(이거나 독립 이벤트)로 간주
        parentEvent: {}, // 이미 달린 반응에 클릭해서 남기는 경우 그에 대한 부모 이벤트 아이디를 저장함 TODO: 저장할 필요가 있나? 이미 아이디를 가지는데 객체를 저장할 필요는 없지 않을까?
        parentEventID: -1, // 0 인 경우에 단독이고, 부모 이벤트 아이디가 있는 경우
        childrenIDarray: [] // 자식들이 생기게 되면 이를 표현해줌. 객체 배열을 가지지 말고 eventList에서 참조할 수 있도록 아이디만 가지고 가도록
    },
    inputPanelShow: false, // 한번 클릭된 상태라면 다른 쪽을 클릭하면 패널이 사라져야 함
    // summaryTimeline.js 변수 들
    good: 0, // good 의 수
    bad: 0,  //bad 의수
    arrayg: [], // good array
    arrayb: [], //bad array
    graphshape: 1, //graphshape sel
    inttime: 0,   // get time
    url: {}, // 현재 플레이어 페이지에서 보이는 URL


    eventTextSeparation: true,  // 이벤트에서 텍스트 숫자가 얼마 이상이면 잘라서 다음 이벤트를 만들어 넘겨줌
    eventTextLimitation: 20, // 이벤트의 텍스트 입력의 최대값.

    timeset: 2, //버튼 쿨타임 타임 set
    pageGenerationTime: {}// 페이지가 생성된 시간을 저장하고 이를 통해 타임라인을 형성할 수 있도록 함


};








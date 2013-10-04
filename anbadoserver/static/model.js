"use strict";
/**
 *  model.js
 *  Anbado의 모델 오브젝트
 *
 *  @author Han Jin-Soo
 *  @since 0.1
 */
(function (Anbado) {
    /**
     * 비디오의 정보를 저장하고 있는 오브젝트
     *
     * @param ID 솔루션에 저장되어 있는 비디오 아이디
     * @param provider 동영상을 제공하는 제공자의 구분 (youtube / vimeo 등)
     * @param providerVID 각 동영상 제공자의 사이트에서 부여된 아이디
     * @param chartWeight 각 시점별로 부여되어 있는 차트에 대한 데이터
     * @constructor
     */
    Anbado.Video = function (ID, provider, providerVID, chartWeight) {
        this.ID = ID;
        this.provider = provider;
        this.providerVID = providerVID;
        this.chartWeight = chartWeight;
    };

    /**
     * 비디오 플레이어를 사용하는 유저의 정보를 저장하고 있는 오브젝트
     *
     * @param ID 솔루션에서 가지고 있는 사용자 아이디
     * @param profileImg 사용자를 표현할 프로파일 이미지의 경로
     * @constructor
     */
    Anbado.User = function (ID, profileImg) {
        this.ID = ID;
        this.profileImg = profileImg;
    };

    /**
     * 표시할 이벤트에 대한 정보를 저장하는 오브젝트
     *
     * @param ID 이벤트의 아이디
     * @param videoID 이벤트가 기록된 비디오 아이디
     * @param userID 이벤트를 만들어낸 사람의 아이디
     * @param birthDate 이벤트가 실제로 발생한 현재 시각
     * @param startTime 이벤트가 생성된 비디오의 현재 시간
     * @param endTime 이벤트가 종료될 시점을 저장
     * @param permission 이벤트가 보여질 권한 설정
     * @param parentID 기존 이벤트와의 연결관계가 있을 경우, 이에 대한 부모이벤트 아이디
     * @param x 이벤트의 좌표 기준계에서의 x 값
     * @param y 이벤트의 좌표 기준계에서의 y 값
     * @param width 이벤트의 좌표계산을 위해 기록하는 가로 사이즈
     * @param height 이벤트의 좌표계산을 위해 기록하는 세로 사이즈
     * @constructor
     */
    Anbado.Think = function (ID, videoID, userID, birthDate, startTime, endTime, permission, parentID, x, y, width, height) {
        this.ID = ID;
        this.videoID = videoID;
        this.userID = userID;
        this.birthDate = birthDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.permission = permission;
        this.parentID = parentID;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };
})(window.Anbado || {});
/*
 var EventsRenderer = function(eventList) {

 };

 var Receiver = function(model) {


 };

 var EventReceiver = function() {

 };
 EventReceiver.prototype = new Receiver();

 var VideoReceiver = function() {

 };
 VideoReceiver.prototype = new Receiver();

 var UserReceiver = function() {

 };
 UserReceiver.prototype = new Receiver();


 var VideoRenderer = function(DOM, video) {

 this.popcorn = Popcorn(DOM);
 this.popcorn.smart(DOM, video.id);

 switch (videoInfo.provider) {
 case "youtube" :
 popcorn.youtube(DOM, "http://youtu.be/" + video.providerVID);
 break;
 case "vimeo" :
 popcorn.vimeo(DOM, "http://vimeo.com/" + video.providerVID);
 break;
 default :
 break;
 }


 };

 var EventsRenderer = function() {

 };
 */
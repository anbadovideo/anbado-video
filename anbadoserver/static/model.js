/**
 * Created by haksudol on 10/2/13.
 *
 */

"use strict";
/**
 *
 * @param DOM
 * @param videoObject
 */



var VideoObject = function(videoID, provider, providerVID, chartWeight, option) { // DOM은 target DOM을 이야기하고, 옵션의 경우 사이즈, 화질, 이벤트 개수 등


    if (option === undefined) {

    }

    this.id = videoID;
    this.provider = provider;
    this.providerVID = providerVID;
    this.videoInfo = videoID;
    this.chartWeight = chartWeight;

};

var User = function(userID, profileImg) {
    this.ID = userID;
    this.profileImg = profileImg;

    this.prototype.getID = function() {
        return this.ID;
    }
    this.prototype.profileImg = function() {
        return this.profileImg;
    }

};

var Event = function(videoObject) {
    this.eventOccuredAbsoluteTime = (new Date());
    this.eventVideoClickTime = videoObject.currentTime();
    this.eventPermission = "friend";
    this.secUnit = 100 * Math.round(CLIENTVAR.popcornobj.currentTime() / CLIENTVAR.popcornobj.duration());
    this.parentEventID = CLIENTVAR.transferEvent.parentEventID === undefined ? -1 : CLIENTVAR.transferEvent.parentEventID;
    this.childrenIDarray = [];

    this.prototype.setPermission = function() {

    };
};

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
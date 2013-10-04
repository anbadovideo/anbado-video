/**
 * Created by haksudol on 10/2/13.
 *
 */

"use strict";


var User = function(userID, profileImg) {
    this.ID = userID;
    this.profileImg = profileImg;

};
var VideoObject = function(videoID, provider, providerVID, chartWeight, videoURL,  option) { // DOM은 target DOM을 이야기하고, 옵션의 경우 사이즈, 화질, 이벤트 개수 등


    if (option === undefined) {

    }
    this.id = videoID;
    this.provider = provider;
    this.providerVID = providerVID;
    this.videoInfo = videoID;
    this.chartWeight = chartWeight;
    this.videoURL = videoURL;
};

VideoObject.prototype.getChartWeight = function(){
    return this.chartWeight;
}

var VideoRenderer = function(targetDom, video, option){
    this.popcorn = Popcorn.smart(targetDom, videoURL);

}


var Event = function(user,videoRenderer) {
    this.eventID =
    this.occuredDate = (new Date());
    this.startTime = videoRenderer.currentTime();
    this.permission = "friend";
    this.parentID = undefined;
    this.childrenArray = [];



};

Event.prototype.setPermission = function() {
};




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

var EventsRenderer = function(event) {

};








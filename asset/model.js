/**
 * Created by haksudol on 10/2/13.
 *
 */

var videoObject = function(DOM, videoObject){





}

videoObject.prototype.setURL = function(URL){
    this.URL = URL;
}

videoObject.prototype.getURL = function(){
    return this.URL;
}



var eventModel = function(eventObject, typeCheck){
    eventObject.eventOccuredAbsoluteTime = (new Date());
    eventObject.eventVideoClickTime = CLIENTVAR.popcornobj.currentTime();
    eventObject.eventPermission = "friends";
    eventObject.secUnit = 100* Math.round(CLIENTVAR.popcornobj.currentTime() / CLIENTVAR.popcornobj.duration());
    eventObject.parentEventID =  CLIENTVAR.transferEvent.parentEventID === undefined ? -1 : CLIENTVAR.transferEvent.parentEventID;
    eventObject.childrenIDarray = [];

    typeCheck(eventObject.eventType);

}

var loadEvent = function(eventObject){

}

var typeCheck = function(eventType){
    if(eventType === "text"){

    }
    else if(eventType === "emoticon"){

    }


}

eventModel.prototype.text = function(){

};
eventModel.prototype.emoticon = function(){

};

eventModel.prototype.postEvent = function(){
    anbado.realtime.postEvent({
        user_id: 1,
        video_id: 1,
        appeared: eventObject.eventVideoClickTime,
        disappeared: eventObject.eventVideoClickTime + eventObject.eventVideoClickDuration,
        content: eventObject.eventContent,
        category: 'text',
        parent_id: -1,
        permission: 'public',
        coord: [eventObject.eventPosX, eventObject.eventPosY],
        size: [200, 100]
    });

}

eventModel.text();
eventModel.emoticon();
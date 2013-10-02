/**
 * Created by haksudol on 10/2/13.
 *
 */

var videoObject = function("#videoEmbed", videoObject){ // DOM은


    DOM..append("<video class='videoEmbed' controls style='top:0px;left:0px;width:640px;height:480px;'></video>");
    console.log($("#player").offset());
    $(".videoEmbed").css({left:0, top:0});
    DOM.append("<canvas class='canvas1' width = '"+$("#videoEmbed").width()+"' height = '"+($(".videoEmbed").height()-80)+"'></canvas>");
    $(".canvas1").css({"position":"absolute","z-index":2});
//    $("#canvas1").css({left:0, top:0});
    $(".canvas1").offset($(".videoEmbed").offset());

    this.prototype.setURL = function(URL){
        this.URL = URL;
    }

    this.prototype.getURL = function(){
        return this.URL;
    }
    this.prototype.setSize = function(){
    }
    this.prototype.eventLoad = function(){

    }

}

var userModel = function(userID, profileImg){

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
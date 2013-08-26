(function() {
    var start = document.getElementById('record-video');
    var stop = document.getElementById('stop-video');
    var video = document.getElementById('test');
    var cameraOn = document.getElementById('camera-on');
    var canvas = document.getElementById('canvas');
    var img = document.querySelector('img');
    var context = canvas.getContext('2d');
    var localStream = null;

// animation id 
var requestId = 0;
// whammy is webm encoder.
var whammy = new Whammy.Video(15);

start.onclick = function() {   
    if(localStream) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        function animation (timestamp) {
            context.drawImage(video, 0, 0);
            whammy.add(canvas);
            handle = window.requestAnimationFrame(animation);
        };
        animation(Date.now());

    }
};
cameraOn.onclick = function() {
    /*
     getUserMedia -> 
     chrome -> webkitGetUserMedia
     firefox -> mozGetUserMedia
     opera -> getUserMedia
     ie -> msGetUserMedia     
     */
     navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );

     if (!navigator.getUserMedia){
        alert('지원이 되지 않는 브라우저 입니다.');
        return ;
    }

    navigator.getUserMedia({
        video : true,
        audio : true
    },
    function(stream) {//onSuccess        
        video.src = window.URL.createObjectURL(stream);
        localStream = stream;
        video.onloadedmetadata = function(e) {
            console.log(e);
        };
        video.autoplay = true;
    },
    function(err) { //onError
        console.log(err);
    });
};

snapshot.onclick = function() {
    if (!localStream) console.log('test');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0);
    img.src = canvas.toDataURL('image/png');
};

stop.onclick = function() {
    if (requestId) {
        window.cancelAnimationFrame(requestId);
    }
    var compile = whammy.compile();
    var result = document.getElementById('result');
    result.src = window.URL.createObjectURL(compile);
    result.autoplay = true;
};
})();
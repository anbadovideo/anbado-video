var start = document.getElementById('record-video');
var stop = document.getElementById('stop-recording-video');
var video = document.getElementById('test');
var img = document.querySelector('img');


var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
var localStream = null;

var device = document.getElementById('device');
var gif = new GIF({
    worker : 4
});

video.addEventListener('click',
    function() {   
        if(localStream) {
            var imgs = document.getElementById('imgs');
            var numberOfCanvas = imgs.children;        
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            var i = 0;
            var interval = setInterval(function() {              
                var paper = numberOfCanvas[i];
                paper.width = video.videoWidth;
                paper.height = video.videoHeight;

                var context = paper.getContext('2d');
                context.drawImage(video, 0, 0);  
                gif.addFrame(paper);
//                console.log(window.URL.createObjectURL(context));
                if ( i > 28 ) {
                    clearInterval(interval);
                    gif.render();
                }
                i += 1;
            }, 10);
            gif.on('finished', function(blob) {
                img.src = URL.createObjectURL(blob);
            });
        }
    }, true);
start.onclick = function() {
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
        video : true
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

stop.onclick = function() {
    localStream.stop();
};

device.onchange = function(stream) {
    document.querySelector('video').src = stream.url;
};
/*
start.onclick = function() {
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );
    var videoConstraints = {
        audio: true,
        video: true
    };    
    navigator.getUserMedia(videoConstraints, function(stream){
        window.URL = window.webkitURL || window.URL;
        video.src = window.URL.createObjectURL(stream);
        videoStream = stream;
        recorder = RecordRTC({
            video : video
        });
        console.log(recorder);
        recorder.startRecording();
    }, function(err) {
        console.log(err);
    });

//    navigator.webkitGetUserMedia

}

stop.onclick = function() {
	recorder.stopRecording(function(url){
		console.log(url);
	});
}
*/
/*

            function getByID(id) {
                return document.getElementById(id);
            }

            var video = getByID('test');            
            var recordVideo = getByID('record-video'),
                stopRecordingVideo = getByID('stop-recording-video');

            var recorder;
            var videoStream;

            recordVideo.onclick = function() {
                recordVideoOrGIF(true);
            };

            function recordVideoOrGIF(isRecordVideo) {
            	var videoConstraints = {
            		audio : true,
            		video : {
            			mandatory : {},
            			optional : []
            		}
            	};
                if (!videoStream)
                    navigator.webkitGetUserMedia(videoConstraints, function(stream) {
                        video.src = window.webkitURL.createObjectURL(stream);
                        videoStream = stream;
                        recorder = RecordRTC({
                            video: video
                        });

                        if (isRecordVideo) recorder.recordVideo();
                    }, function(err) {
                    	console.log(err);
					});
                else {
                    video.src = window.webkitURL.createObjectURL(videoStream);

                    if (isRecordVideo) recorder.recordVideo();
                    else recorder.recordGIF();
                }

                window.isAudio = false;

                if (isRecordVideo) {
                    recordVideo.disabled = true;
                    stopRecordingVideo.disabled = false;
                } else {
                    recordGIF.disabled = true;
                    stopRecordingGIF.disabled = false;
                }
            }

            stopRecordingVideo.onclick = function() {
                this.disabled = true;
                recordVideo.disabled = false;

                recorder.stopVideo(function(url) {
                    document.getElementById('video-url-preview').innerHTML = '<a href="' + url + '" target="_blank">open video.webm</a>';
                });
            };

*/
삽질목록
=====

Libs
-----
1. WebRTC-Experiments >> RecordRTC [https://www.webrtc-experiment.com/RecordRTC/]
 - __이유__
     - Firefox를 전혀 지원하지 못하고, 크롬에서도 잘 동작하지 않는 문제. 예제의 부실함.
2. gif.js [http://jnordberg.github.io/gif.js/]
 - __이유__
     - web worker를 데스크탑에서만 지원하고, 워커를 늘리면 조금 빨라지나 컴퓨터가 부담이 될 확률이 높다. 또한 Firefox에서 원활한 지원이 안된다.
3. whammy.js [https://github.com/antimatter15/whammy]
 - __이유__
     - Firefox에서는 현재 Unsupported 상태. 무리없이 잘 된다.
4. ccapture.js [https://github.com/spite/ccapture.js]
 - __이유__
     - 의존성으로 whammy.js를 갖고 있다. 고로 chrome only.

라이브러리 없이 처리할 수 없는 이유
-------------------------------------------------------------------
 - 1부터 4까지 조사하던 중에, [http://ericbidelman.tumblr.com/post/31486670538/creating-webm-video-from-getusermedia] 를 봤는데 __unimplements__ 라고 써있길래 작년 것이니깐 지금은 됐겠지. 해서 보니깐 안 되었다.
[https://code.google.com/p/chromium/issues/detail?id=113676]
파이어폭스에서는 어떤 현상인지 알아봐야겠다.
 - 파이어폭스도 구현이 안되어있다. 외부라이브러리 중에 파이어폭스를 지원하는 것을 찾아야겠다. http://www.webrtc.org/firefox#TOC-Recording-API

Reference
----------
1. 제일 기본적인 곳 http://www.webrtc.org/
2. 앞부분만 보면 된다. 2013 Google I/O 동영상 http://www.youtube.com/watch?v=p2HzZkd2A40
3. 기본 차근차근 설명서1 http://www.html5rocks.com/en/tutorials/webrtc/basics/
4. 기본 차근차근 설명서2 http://www.netmagazine.com/tutorials/get-started-webrtc
5. animation frame에 대해서 http://msdn.microsoft.com/ko-kr/library/ie/hh920765(v=vs.85).aspx
6. 스냅샷 캡처하기 http://www.html5rocks.com/en/tutorials/getusermedia/intro/
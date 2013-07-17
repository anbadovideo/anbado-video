anbado-server
=============

## Introduction
Anbado Video Solution의 Server 소스 코드입니다.

## Requirements
* gevent==0.13.8
	* libevent를 미리 설치해야합니다.
* gevent-socketio==0.3.5-rc2
* SQLAlchemy==0.8.2

필요한 패키지는 아래의 명령으로 설치할 수 있습니다. 단, libevent는 작동하는 머신의 운영체제에 맞게 미리 설치되어있어야 합니다.

		pip -r requirements.txt		

## Run

샘플 코드는 아래의 방법으로 작동 시킬 수 있습니다.

		run.py sample
		
이후 `http://server-ip:8888/`로 접속하면 sample로 작동하는 것을 볼 수 있습니다. (곧, 다양한 샘플을 업데이트 할 예정입니다.)
현재 기본 샘플에서는 연결 이후 샘플 이벤트를 보내보고, 그 응답을 console.log를 통해 콘솔에 찍는 부분까지 구현되어 있습니다.

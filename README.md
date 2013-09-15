anbado-server
=============

## Introduction
Anbado Video Solution의 Server 소스 코드입니다.

## Requirements
* gevent==0.13.8
	* libevent를 미리 설치해야합니다.
* gevent-socketio==0.3.5-rc2
* SQLAlchemy==0.8.2

gevent 설치에 필요한 libevent는 OS 별 패키지 매니저를 통해 설치하면 됩니다.

* Debian, Ubuntu

        apt-get install libevent-dev

* CentOS, Redhat

        yum install libevent-dev

* OS X (Homebrew)

        brew install libevent

이외의 나머지 패키지는 아래의 명령으로 설치할 수 있습니다.

        pip install -r requirements.txt

## How to Setting Test Environment

테스트를 위해 샘플 데이터를 데이터베이스에 등록할 수 있습니다. 먼저 `config.py` 파일에서 데이터베이스 정보 및 접속 정보를 적절하게 입력합니다.

그리고 아래의 명령을 통해 해당 데이터베이스를 초기화 할 수 있습니다.

        sample_db.py

## Run

샘플 코드는 아래의 방법으로 작동 시킬 수 있습니다.

        run.py

이후 `http://server-ip:8888/`로 접속하면 sample로 작동하는 것을 볼 수 있습니다.

var anbado = {} || anbado;

/**
 * TODO: add description about this namespace.
 *
 * @namespace anbado.realtime
 */
jQuery.extend(true, anbado, (function() {
    /**
     * 실제 socket.io 연결 객체
     *
     * @type {io.socket}
     */
    var socket = null;

    /**
     * transaction_id
     *
     * @type {number}
     */
    var transaction_id = 0;

    /**
     * tryCount : 접속 실패시에 카운트 한다.
     *
     * @type {number}
     */
    var tryCount = 0;

    /**
     * maxTryCount : 접속 시도의 최대 카운트.
     *
     * @type {number}
     */
    var maxTryCount = 3;

    /**
     * socket.io 서버에 연결한다.
     *
     * @returns {jQuery.Deferred.promise}
     */
    var connect = function() {
        var deferred = jQuery.Deferred();

        socket = io.connect('/', {
            'force new connection': true,
            reconnect: false
        });

        socket.on('connect', function() {
            deferred.resolve();
        });

        return deferred.promise();
    };

    /**
     * socket.io 서버와 연결을 종료하고, transaction_id를 초기화한다.
     */
    var disconnect = function() {
        socket.disconnect();
        socket = null;
        transaction_id = 0;
    };

    /**
     * 해당 클라이언트에서 겹치지 않는 transaction id를 생성한다.
     *
     * @returns {number} 생성된 transaction id
     */
    var getTransactionID = function() {
        ++transaction_id;

        return transaction_id;
    };

    /**
     * 현재 socket.io 서버와 연결된 상태를 돌려준다.
     *
     * @returns {boolean} 현재 연결된 상태면 true, 연결이 되어 있지 않다면 false를 돌려준다.
     */
    var isConnected = function() {
        if (socket === null)
            return false;

        return socket.socket.connected;
    };

    var sendExitPacket = function() {
        var deferred = jQuery.Deferred();

        socket.removeListener('exit_complete');
        socket.on('exit_complete', function() {
            socket.removeListener('event');
            socket.removeListener('event_complete');
            socket.removeListener('enter');
            socket.removeListener('connect');

            deferred.resolve();
        });
        socket.emit('exit', {});

        return deferred.promise();
    };


    /**
     * socket.io 서버에 현재 클라이언트에서 videoID를 갖는 비디오를 시청함을 통지한다.
     *
     * @param videoID 시청할 비디오의 ID
     * @param userID 시청하는 사용자의 ID (익명 사용자의 경우 -1)
     */
    var enterVideo = function(videoID, userID) {
        jQuery.when(connect())
            .fail(function() {
                if (tryCount > maxTryCount) {
                    tryCount = 0;
                    return;
                }
                tryCount++;
                enterVideo();
            }).done(function() {
                socket.emit('enter', { video_id: videoID, user_id: userID });
            });
    };

    /**
     * socket.io 서버에 현재 클라이언트에서 시청 중인 비디오의 시청이 종료되었음을 통지한다.
     */
    var exitVideo = function() {
        jQuery.when(sendExitPacket())
            .fail(function() {
                if (tryCount > maxTryCount) {
                    tryCount = 0;
                    return;
                }
                tryCount++;
                exitVideo();
            }).done(function() {
                disconnect();
            });
    };

    /**
     * socket.io 서버에 새로운 이벤트를 등록한다.
     *
     * @param {json} event 등록할 새 이벤트 객체
     */
    var postEvent = function(event) {
        event.transaction_id = getTransactionID();
        socket.emit('event', event);
    };

    /**
     * socket.io 서버로 부터 이벤트가 도착했을 때 호출될 핸들러 등록을 수행한다.
     *
     * @param {function} eventHandler
     */
    var onEvent = function(eventHandler) {
        socket.removeListener('event');
        socket.on('event', eventHandler);
    };

    /**
     * socket.io 서버로 보낸 postEvent가 성공적으로 수행된 경우 호출될 핸들러 등록을 수행한다.
     *
     * @param {function} eventHandler
     */
    var onPostComplete = function(eventHandler) {
        socket.removeListener('event_complete');
        socket.on('event_complete', eventHandler);
    };

    return {
        realtime: {
            postEvent: postEvent,
            enterVideo: enterVideo,
            exitVideo: exitVideo,
            onEvent: onEvent,
            onPostComplete: onPostComplete,
            isConnected: isConnected
        }
    };
})());
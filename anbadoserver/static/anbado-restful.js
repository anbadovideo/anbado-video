var anbado = anbado || {};

jQuery.extend(true, anbado, (function() {

    var prefixURL = '';

    /**
     * 솔루션 서버의 주소를 설정합니다.
     * @param url 솔루션 서버의 주소
     */
    var setPrefixURL = function(url) {
        prefixURL = url;
    };

    /**
     * 주어진 사용자 ID에 대한 정보를 돌려줍니다.
     * @param userID 조회할 사용자 ID
     * @returns {json} 솔루션 서버에 저장된 사용자 정보
     */
    var getUserInfo = function(userID) {
        var url = prefixURL + '/user/' + userID;
        var data = null;

        jQuery.ajax(url, {
            dataType: 'jsonp',
            async: false,
            type: 'GET'
        })
            .done(function(json) {
                data = json
            });

        return data;
    };

    /**
     * 주어진 비디오 ID에 대한 정보를 돌려줍니다.
     * @param videoID 조회할 비디오 ID
     * @returns {json} 솔루션 서버에 저장된 비디오 정보
     */
    var getVideoInfo = function(videoID) {
        var url = prefixURL + '/video/' + videoID;
        var data = null;

        jQuery.ajax(url, {
            dataType: 'jsonp',
            async: false,
            type: 'GET'
        })
            .done(function(json) {
                data = json;
            });

        return data;
    };

    /**
     * 주어진 비디오 ID에 대해, 해당 비디오에 이벤트를 남긴 이력이 있는 사람(=참여자)의 목록을 돌려줍니다.
     * @param videoID 참여자 목록을 조회할 비디오 ID
     * @returns {json} 해당 비디오에 대한 참여자 목록
     */
    var getParticipants = function(videoID) {
        var url = prefixURL + '/video/' + videoID + '/participants';
        var data = null;

        jQuery.ajax(url, {
            dataType: 'jsonp',
            async: false,
            type: 'GET'
        })
            .done(function(json) {
                data = json;
            });

        return data;
    };

    return {
        restful: {
            setPrefixURL: setPrefixURL,
            getUserInfo: getUserInfo,
            getVideoInfo: getVideoInfo,
            getParticipants: getParticipants
        }
    }
})());
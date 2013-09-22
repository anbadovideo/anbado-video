var anbado = {} || anbado;

jQuery.extend(true, anbado, (function(){

    /**
     * getUserInfo : 사용자 정보 조회하기
     * @param userID
     * @returns {json}
     */
    var getUserInfo= function(userID) {
        var url = '/user/' + userID;
        var data = null;
        jQuery.ajax(url, {
            async : false,
            type : 'GET'
        })
            .done(function(json) {
                data = json
            });
        return data;
    };

    /**
     * getVideoInfo : 비디오 정보 조회하기
     * @param videoID
     * @returns {null}
     */
    var getVideoInfo = function(videoID) {
        var url = '/video/' + videoID;
        var data = null;

        jQuery.ajax(url, {
            async : false,
            type : 'GET'
        })
            .done(function(json) {
                data = json;
            });
        return data;
    };

    /**
     * getParticipants : 비디오에 참여한 사용자 목록 조회하기.
     * @param videoID
     * @returns {json}
     */
    var getParticipants = function(videoID) {
        var url = '/video/' + videoID + '/participants';
        var data = null;

        jQuery.ajax(url, {
            async : false,
            type : 'GET'
        })
            .done(function(json) {
                data = json;
            });
        return data;
    };

    return {
        restful : {
            getUserInfo : getUserInfo,
            getVideoInfo : getVideoInfo,
            getParticipants : getParticipants
        }
    }
})());
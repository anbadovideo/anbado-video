var anbado = window.anbado || {};
var temp;


function geturl() {

    $("#youtube").remove();
    $("#vid").append("<div id='youtube' style='position: absolute;top:640px;left:0px;width:640px;height:480px;'/>");
    $("#youtube").css({left: 0, top: 0});
// TODO: 캔버스를 다시 오버레이 시킬 것.

    CLIENTVAR.url = $("#start_fire_text").val();
    console.log("url:" + CLIENTVAR.url);

    CLIENTVAR.popcornobj = Popcorn.smart("#youtube", CLIENTVAR.url);


    setTimeout(function() {
        if (CLIENTVAR.popcornobj != "NaN") {
            durationtime = CLIENTVAR.popcornobj.duration();
            make_array(durationtime);
            console.log(durationtime);

            if (CLIENTVAR.graphshape == 1) {
                stactareachart();
            }
            else if (CLIENTVAR.graphshape == 2) {
                line();
            }
            else if (CLIENTVAR.graphshape == 3) {
                pichart();
            }
            else if (CLIENTVAR.graphshape == 4) {
                halfpichart();
            }
        }
    }, 5000);

}
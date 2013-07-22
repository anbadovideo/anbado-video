
  // var socket = io.connect('http://localhost:8888');
  var socket;
  jQuery(function() {
    socket = io.connect("http://localhost:8888/");

    socket.on('connect', function() {
      socket.on('return', function(data) {
        console.log(data);
      });

      socket.emit('sample', {hello: 'worldworld'});
    });
  });
  // socket.on('connect', function (data) {
  //   console.log(data);
  //   socket.emit('my other event', { my: 'data' });
  //   socket.on('return', function(data) {console.log(data)})
  // });


    var popcornobject; // global access video object 

    var canvaslayer; // canvas overlay

    var container;
    var stage;

    document.addEventListener( "DOMContentLoaded", function() {
      popcornobject = Popcorn("#ourvideo"); // 팝콘 객체 생성
      popcornobject.on("play", function() {

        console.log("Playing!");
        popcornobject.on("timeupdate", function(){
          console.log(popcornobject.currentTime());
          socket.emit('sample',{hello: popcornobject.currentTime()});
        })
      });

      $canvaslayer = document.getElementById("canvas1");
      stage = new createjs.Stage($canvaslayer);


      var content = new createjs.DOMElement("testdiv");
      content.regX = 154;
      content.regY = 100;
      // content.style.color = red;

      container = new createjs.Container();
      // $container.addChild("content");
      

      
      console.log($("#textinput1").val());
      //socket io 부분 테스팅 

      
      stage.onMouseDown = displayInputPanel; // on mouse click - input event occur. onClick won't work
      // alert(stage.mouseY);
      // stage.update();
      // alert(stage.mouseY);
      // stage.update();
    });


function displayInputPanel(evt){

  alert("in display");
  

  var textInputField = new createjs.DOMElement("textinput1");
  var textInputButton = new createjs.DOMElement("textbutton1");
  console.log(textInputField);

  textInputField.regX = -100;
  textInputField.regY = 0;

  textInputField.x = stage.mouseX;
  alert(textInputField.x + " " + stage.mouseX);
  textInputField.y = stage.mouseY;
  textInputButton.regX = -300; 
  textInputButton.regY = 0; 
  textInputButton.x = stage.mouseX;
  textInputButton.y = stage.mouseY;

  var frame = new createjs.Shape();
  frame.graphics.beginFill("#00F").drawRect(stage.mouseX,stage.mouseY,28,28);
  

  
      // container.addChild(textInputField, submitbutton1, frame);
      stage.addChild(textInputField);
      stage.addChild(textInputButton);
      stage.addChild(frame);
      // stage.addChild($container);
      stage.update();
    }

    function savetext()
    {
      alert("savetext");
    }

    
/* 
 *  scuttlebutt v0.1.2
 *
 *  javascript visual novel engine 
 *  https://github.com/daiyiwhale/scuttlebutt
 *
 *  by daiyi [_.]^
 *  daiyiwhale.com
 *
 *  released under GPL license FOR JUSTICE
 *
 */


// this is the global scuttlebutt
scuttlebutt = new Scuttlebutt();

// class instantiation: http://ejohn.org/blog/simple-class-instantiation
function Scuttlebutt() {
  if (this instanceof Scuttlebutt) {
/*    var STORY_PATH = "stories/boston";
    var STORY_NAME = "/boston.json";
    var IMAGE_FOLDER = "/img/";  // also retures a trailing /
    var FIRST_SCENE = "intro";
    var PROTAGONIST = "sir";  */
    //   console.log(scuttlebutt.story.scenes);
    this.story = {};
    this.currentScene = "";
    this.Q = $({});
    this.begin = function(trigger) {
      $(trigger).hide();
      setScene = this.currentScene;
    }
    this.resetView = function() {
      $('#cargo').hide();
      $('#characters').hide();
      $('button').show();
    }

    this.setStory = function(storyObj, firstScene, callback) {
      this.story = storyObj;
      this.currentScene = firstScene;
      if (callback) {
	callback();
      }
      console.log(this);
    };
    
    this.startStory = function(storyName, firstScene) {
      // reset view before json reading is finished for speedy visual feedback
      // TODO disable start button until json is parsed
      this.resetView();
      (function(sb) {
	$.getJSON("stories/" + storyName + "/" + storyName + ".json").done( function(data) {
	  sb.setStory(data, firstScene);
	}).fail(function() { 
	  alert("story loading failed; check your story json, it has to be perfect."); 
	});
      })(this);  // pass in the whole scuttlebutt 
    };

    this.animToQueue = function(queue, selector, animationprops) {
      queue.queue(function(next) {
	$(selector).animate(animationprops, next);
      });
    }


  } else {
    return new Scuttlebutt();
  }
}


//var STORY_PATH = "stories/boston";
//var STORY_NAME = "/boston.json";
//var IMAGE_FOLDER = "/img/";  // also retures a trailing /
//var FIRST_SCENE = "intro";
var PROTAGONIST = "sir";

//var Q = $({});

var story;
var current_scene;

/*
jQuery(document).ready(function() {

  prep();
  
  $('#storytitle').click(function() {
    hardjump("t0");
  });
  
});
*/
/*
//*** prepares the page
function prep() {

  // get json
  loadstory();
  
  // reset hide/unhide
  resetView();
  
}

function loadstory() {
  // Assign handlers immediately after making the request,
  // and remember the object for this request
  var getstory = $.getJSON( STORY_PATH + STORY_NAME, function() {
    console.log( "loadstory success :D" );
  }).done( function(data) {
    story = data;
  }).fail(function() { 
    console.log( "loadstory error D:" ); 
  }).always(function() { 
    console.log( "loadstory complete" ); 
  });
  
  // Set another completion function for the request above
  //getstory.complete(function() { });
}
*/
//*** explicitly hiding/unhiding everything
/*function resetView() {
  $('#cargo').hide();
  $('#characters').hide();
  $('button').show();
}*/

function hardjump(scene) {
  resetView();
  $('button').hide();
  setScene(scene);
}
/*
function begin(trigger) {
  $(trigger).hide();
  setScene(FIRST_SCENE);
}

function animToQueue(queue, selector, animationprops) {
  queue.queue(function(next) {
    $(selector).animate(animationprops, next);
  });
}
*/

function setScene(scene) {

  Q.clearQueue();

  current_scene = story.scenes[scene];
  
  // hide cargo if it's around
  if ($('#cargo').is(":visible")) {
    console.log("CARGO EXISTS; HIDING NOW");
    
    Q.queue('x', function () {
      
      console.log("QUEUED HIDING CARGO");
      
      $('#cargo').slideUp( {
        direction:'down', 
        duration: 800, 
        complete: function() {
          console.log("cargo slid hidden");
          Q.dequeue('x');
        }
      });
    });
  }
  
  
  
  // fade out characters
  Q.queue('x', function () {
    
    console.log("QUEUED FADE OUT CHARACTERS");
    
    $('#characters').fadeOut(300, function(){
      
      // clear away characters!
      $('#characters').html('');
      Q.dequeue('x');
    });
    
  });
  
  // switch background 
  Q.queue('x', function () {
    
    // if background is visible and there's a new background, switch
    if ($('#background').is(":visible") && current_scene.background) {
      
      console.log("BACKGROUND IS VISIBLE AND THIS SCENE WANTS ME TO SET A NEW ONE");
      
      $('#background').fadeOut(300, function(){
        // set bg 
        $('#background').css('background-image', 'url(' + STORY_PATH + IMAGE_FOLDER + current_scene.background + ')');
        Q.dequeue('x');
      });
    }
    
    // background is not visible, but there's a new background
    else if (current_scene.background) {
      
      console.log("BACKGROUND IS NOT VISIBLE, BUT SET NEW BACKGROUND");
      
      $('#background').css('background-image', 'url(' + STORY_PATH + IMAGE_FOLDER + current_scene.background + ')');
      Q.dequeue('x');
    }
    
    // otherwise, nothing \o/
    else {
      console.log("BACKGROUND IS NOT VISIBLE SO DO NOTHING");
      Q.dequeue('x');
    }
  });
  
  Q.queue('x', function () {
    
    if (current_scene.background) {
      
      $('#background').fadeIn(600, function(){
        console.log("~fading in background~");
        Q.dequeue('x');
      });
    }
    else {
      Q.dequeue('x');
    }
  });
  
  
  // set characters
  Q.queue('x', function () {
    
    console.log("QUEUED SET CHARACTERS");
    
    
    for (var i = 0; i < current_scene.characters.length; i++) {
      
      $( "<img/>" ).attr( "src", STORY_PATH + IMAGE_FOLDER + current_scene.characters[i][0] + '.png' ).addClass(current_scene.characters[i][1]).appendTo( "#characters" );
    }
    
    Q.dequeue('x');
  });
  
  
  // fade in characters if they exist
  
  Q.queue('x', function () {
    
    if ($('#characters').html() != "") {
      
      console.log("QUEUE4");
      
      $('#characters').fadeIn(600, function(){
        
        Q.dequeue('x');
      });
    }
    else {
      Q.dequeue('x');
    }
  });
  
  
  Q.queue('x', function () {
    
    console.log("QUEUED SETTING TITLE/TEXT AND BACKGROUND");
    
    
    
    // set title
    $('#cargo h2').html(current_scene.name.replace('HOTA$$', PROTAGONIST));
    
    // stick first block of text in
    feedText(0);
    
    Q.dequeue('x');
  });

  // slide in cargo
  Q.queue('x', function () {
    console.log("QUEUE2");
    $('#cargo').slideDown( {
      direction:'up', 
      duration: 800, 
      complete: function() {
        displayText(0);
        console.log("cargo slid in");
        Q.dequeue('x');
      }
    });
  });
  
  Q.dequeue('x');
}


// ### READING SCENES ###

function feedText(index) {

  // clear cargo text and nav
  $( "#cargo-nav" ).html("");
  
  // sticks the <index> block of text in a new div with id "#text<index>".
  
  // make text
  $("#cargo-text").html(
    $('<div/>', {
      'html': "<p>" + current_scene.text[index].replace('HOTA$$', PROTAGONIST),
      'id': "text" + index,
      'class': "textblock",
      'opacity': 0.3,
    }).fadeIn(800)
  );
  
  // if last block of text, also print [next] links
  if (index == current_scene.text.length - 1) {
    for(i = 0; i < current_scene.next.length; i++) {
      $('<button/>', {
        text: '> ' + current_scene.next[i][1].replace('HOTA$$', PROTAGONIST),
        id: 'button'+i,
        class: 'choice',
        name: i,
        click: function (event) {
          setScene(current_scene.next[$(event.target).attr('name')][0]);
        }
      }).appendTo("#cargo-text");
      $( '<br/>' ).appendTo("#cargo-text");
    }
  }
  // otherwise make a next button for the next text block
  else {
    
    
    $("#cargo-nav").html(
      $('<button/>', {
        text: '[ CONTINUE ]',
        id: 'button_continue',
        class: 'choice',
        name: index,
        click: function (event) {
          var index = parseInt($(event.target).attr('name'));
          var old_text = "#text" + index;
          
          // slides in and out, replacing with the next chunk of text
          
          $('#cargo').slideUp( {
            direction:'down', 
            duration: 600, 
            complete: function() {
              
              feedText(index+1);
              
              $('#cargo').slideDown( {
                direction:'up', 
                duration: 500, 
                complete: function() {
                  displayText(0);
                  console.log("cargo slid in");
                  Q.dequeue('x');
                }
              });
            }
          });
        }
      }).fadeIn(800)
    );
    
    pulse("#cargo-nav .choice");
  }
}

/* function makeTexts(index) {
   
   var minheight = 10;
   
   // clear cargo text and nav
   $( "#cargo-text" ).html("");
   $( "#cargo-nav" ).html("");
   
   // make all the divs within cargo-text
   for (var i = 0; i < current_scene.text.length - 1; i++) {
   
   // make text
   $('<div/>', {
   'html': "<p>" + current_scene.text[i].replace('HOTA$$', PROTAGONIST),
   'id': "text" + i,
   'class': "textblock",
   'opacity': 0.5,
   }).appendTo("#cargo-text");
   
   $( "#cargo-text" ).append();
   
   // make continue button
   $('<button/>', {
   'text': '[ CONTINUE ]',
   'id': 'button_continue',
   'class': 'choice',
   'name': i,
   'click': function (event) {
   displayText(parseInt($(event.target).attr('name'))+1);
   }
   }).appendTo("#text" + i);
   }
   
   } */

/* function equalizeHeights() {
   var maxHeight = 0;
   var height;
   var textblock = "";
   
   for (var i = 0; i < current_scene.text.length; i++) {
   textblock = "#text" + i;
   height = $(textblock).attr("height");
   console.log(height);
   if (height > maxHeight) {
   maxHeight = height;
   }
   }
   
   for (var i = 0; i < current_scene.text.length; i++) {
   textblock = "#text" + i;
   $(textblock).attr("height", maxHeight);
   }
   
   $(textblock).attr("height", maxHeight);
   
   } */

// takes the index of the next textblock
function displayText(index) {
  current = "#text" + (index-1);
  next = "#text" + index;
  
  console.log("displayText function");
  
  if (index > 0) {
    $(current).fadeTo(800, 0.0, function () {
      console.log("faded out current: " + next);
      $(next).fadeTo(800, 1, function() {
        console.log("faded in next: " + next);
      });
    });
  }
  else {
    $(next).fadeTo(800, 1, function() {
      console.log("faded in " + next);
    });
  }
}

// #### PRETTY EFFECTS ###

function pulse(selector){
  $(function(){
    // Self-executing recursive animation
    (function pulse(){
      $(selector).delay(200).fadeTo(800, 0.5).delay(50).fadeTo(700, 1 , pulse);
    })();
  });
}

// typewriter!
// use: .typewriter(speed)
(function($) {
  $.fn.typewriter = function(speed) {
    this.each(function() {
      var $ele = $(this),
      str = $ele.text(),
      progress = 0;
      $ele.text('');
      var timer = setInterval(function() {
        $ele.text(str.substring(0, progress++) + (progress & 1 ? '_' : ''));
        if (progress >= str.length) clearInterval(timer);
      }, speed);
    });
    return this;
  };
})(jQuery);

/* 
 *  scuttlebutt v0.1.0
 *
 *  jQuery visual novel engine 
 *  https://github.com/daiyiwhale/scuttlebutt
 *
 *  copyright 2013 Christine Sun [_.]^
 *  http://daiyi.tumblr.com
 *
 *  released under GPL license :D FOR JUSTICE
 *
 */


var STORY_PATH = "stories/boston";
var STORY_NAME = "/boston.json";
var IMAGE_FOLDER = "/img/";  // also retures a trailing /
var FIRST_SCENE = "intro";

var story;
var current_scene;

jQuery(document).ready(function() {

    prep();
    
    $('#storytitle').click(function() {
        hardjump("t0");
    });
    
});

//*** prepares the page
function prep() {

    // get json
    loadstory(function() {
        $('#storytitle').effect( "pulsate", {times:5}, 900 );
    });
    
    // reset hide/unhide
    resetView();
    
}


//*** explicitly hiding/unhiding everything
function resetView() {
    $('#cargo').hide();
    $('#characters').hide();
    $('button').show();
    $('#scene').css('background', 'none');
}

function hardjump(scene) {
    resetView();
    $('button').hide();
    setScene(scene);
    
    pulse('#storytitle');
}

function loadstory(callback) {
    // Assign handlers immediately after making the request,
    // and remember the jqxhr object for this request
    var getstory = $.getJSON( STORY_PATH + STORY_NAME, function() {
        console.log( "loadstory success :D" );
    })
    .done(function( data ) {
        story = data;
    })
    .fail(function() { console.log( "loadstory error D:" ); })
    .always(function() { console.log( "loadstory complete" ); });
     
    // Set another completion function for the request above
    getstory.complete(function() {
        callback;
    });
}

function begin(trigger) {
    $(trigger).hide();
    setScene(FIRST_SCENE);
}


function setScene(scene) {

    current_scene = story.scenes[scene];
    
    
    $('.refresh-target').fadeOut(300, function() {
        refresh_sceneframe( function () {
            
            /* set bg */
            if (current_scene.background) {
                $('#scene').css('background-image', 'url(' + STORY_PATH + IMAGE_FOLDER + current_scene.background + ')');
            }
            
            /* clear characters then set */
            $('#characters').html('');
            
            for (var i = 0; i < current_scene.characters.length; i++) {
            
                $( "<img/>" ).attr( "src", STORY_PATH + IMAGE_FOLDER + current_scene.characters[i][0] + '.png' ).addClass(current_scene.characters[i][1]).appendTo( "#characters" );
            
                /* $('#scene img').attr('src', STORY_PATH + IMAGE_FOLDER + current_scene.characters[i][0] + '.png').attr('class', 'refresh-target').addClass(current_scene.characters[i][1]); */
            }
            
            /* fade in chars and text */
            $('#characters').fadeIn(1400, function() {
                $('#cargo').slideDown({direction:'up'}, 2000)
            });
        });
    });
 
}


function refresh_sceneframe(callback) {
    // clear cargo
    $( "#cargo" ).html("<h2></h2><p>");
    
    $( "#cargo h2" ).html(current_scene.name.replace('HOTA$$',story.protagonist));
    $( "#cargo" ).append("<p>" + current_scene.text.replace('HOTA$$',story.protagonist));
/*     $( "#cargo" ).append("<button onClick=\"setScene(\"" + current_scene.next[0] + ")\">" + current_scene.next[0] + "</button>");
    $( "#cargo" ).append("<button onClick=\"setScene(\"" + current_scene.next[1] + ")\">" + current_scene.next[1] + "</button>"); */
    
    for (var i = 0; i < current_scene.next.length; i++) {
        
    }
    var x;
    for(i = 0; i < current_scene.next.length; i++) {
        $('<button/>', {
            text: '> ' + current_scene.next[i][1].replace('HOTA$$',story.protagonist),
            id: 'button'+i,
            class: 'choice',
            name: i,
            click: function (event) {
                setScene(current_scene.next[$(event.target).attr('name')][0]);
            }
        }).appendTo("#cargo");
        $( '<br/>' ).appendTo("#cargo");
    }
    
/*     $(document).ready(function() {
    $("a").click(function(event) {
       alert(event.target.id+" and "+$(event.target).attr('class'));
    });
}); */
    if (callback) {
        callback();
    }
        
}

/*     .done(function( data ) {
        $.each( data.items, function( i, item ) {
            $( "<img/>" ).attr( "src", item.media.m ).appendTo( "#images" );
            if ( i === 3 ) {
            return false;
            }
        });
    }) */
    
    
// ### READING SCENES ###

function next() {
    
}
    
// #### PRETTY EFFECTS ###

function pulse(selector){
    $(function(){
        // Self-executing recursive animation
        (function pulse(){
            $(selector).delay(200).fadeTo(800, 0.1).delay(50).fadeTo(700, 1 , pulse);
        })();
    });
}

var clear = $('.terminal-output').html();
var array = [];
var counter = -1;
var username = 'shubham';
var temp_command = ''; // to store the next command

function reset(){
  $('textarea').val('');
  $('#live').html('');
  $('#live2').html('');
  $('.cursor').html('&nbsp');
};

$('textarea').keyup(function(e) {
  var command = $('textarea').val();
  var i;
  command = command.replace(/(\r\n|\n|\r)/gm,"");
  var ctrl = e.ctrlKey||e.metaKey; 

  if(command.search('<')!=-1 || command.search('>')!=-1){
    alert('> or < not allowed.');
    $('textarea').val($('textarea').val().substring(0,$('textarea').prop("selectionStart")-1));
    return;
  }

  // same command is used earlier during the session
  if(command.length!=0 && ($('textarea').prop("selectionStart") == command.length)){
    for(i=array.length-1; i>=0; --i){
	    if(array[i].startsWith(command)){
	        break;
      }
    }
  }
  else 
  	i = -1;

  // up arrow key for the last command
  if(e.keyCode==38){

    if(counter>=0){
      if(counter==array.length -1){
        temp_command = command;
      }
      
      $('textarea').val(array[counter]);
      command = array[counter];
      counter-=1;
    }
    else{
      var temp = $('textarea').focus().val();
      $('textarea').val('').val(temp);
    }

    $('#live').html(command);        
    $('#live2').html('');
    $('.cursor').html('&nbsp');
    return;
  }

  // down arrow key pressed for to go to the next command
  else if(e.keyCode==40){

    if(counter<array.length-2){
      $('textarea').val(array[counter+2]);
      command = array[counter+2];
      counter+=1;
    }

    else if(counter==array.length-2){
      $('textarea').val(temp_command);
      command = temp_command;
      counter+=1;
      $('#live2').html('');
    }

    else{
      var temp = $('textarea').focus().val();
      $('textarea').val('').val(temp);
    }

    $('#live').html(command);
    $('#live2').html('');
    $('.cursor').html('&nbsp');
    return;
  }

  // for right arrow command or tab to complete the last command
  else if(e.keyCode==37 || e.keyCode==39 || e.keyCode == 9){

    // making the tab and right arrow to autocomplete the command
    if(e.keyCode == 9) e.keyCode = 39; 

    var index = $('textarea').prop("selectionStart");
    var prev = command.substring(0, index);
    $('#live').html(prev);

    if((prev==command) && (i == -1 || array.length == 0)){
      $('.cursor').html('&nbsp');
      $('#live2').html('');
    }
    else if((prev!=command) && (i == -1 || array.length == 0)){
      $('.cursor').html(command[index]);
      $('#live2').html(command.substring(index+1, command.length));
    }
    else if((i!=1 || array.length != 0) && (command!=array[i].substring(0, array[i].length)) && (e.keyCode==39))
    {
      $('textarea').val(array[i]);
      command = array[i];
      $('#live').html(command);
      $('#live2').html('');
      $('.cursor').html('&nbsp');
    }
    else if(prev == command) {
      $('.cursor').html('&nbsp');
    }
    return;
  }

  // enter key
  else if(e.keyCode==13){

    if(command=="clear"){
      $('.terminal-output').empty();
      $('.terminal-output').append(clear);
      reset();
    }

    else if(command=="help"){
      $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">world@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
      $('.terminal-output').append(
        '<div class="result">\
          <div style="width: 100%;">\
            <span>List of commands<br>\
              clear - to clear screen<br>\
              cd - to open the reference<br>\
              ls - to list details<br>\
              help - for list of commands (obviously)\
            </span>\
          </div>\
        </div><br>');
      reset();
    }
    else if(command.split(" ")[0].trim()=="mkdir"){
      console.log(command);
    }
    else{
        $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">world@' + username + ': ~' + '$ </span><span>' + command + '</span></div></div>');

        if(command.length > 0) {
          $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>No command \''+command+'\' found.</span></div></div><br>');
        }
        $('textarea').val('');
        $('#live').html('');
        $('#live2').html('');
        $('.cursor').html('&nbsp');
    }

    if(command.length>0){
      array.push(command);
      temp_command = '';
    }                                                                                    
    counter=array.length-1;
    return;
  }

  $('#live').html('');
  if(i == -1 || array.length == 0){
      $('#live').append($('textarea').val().substring(0,$('textarea').prop("selectionStart")));
      if($('textarea').prop("selectionStart") == command.length) {
        $('#live2').html('');
        $('.cursor').html('&nbsp');
      }
  }
  else {
      $('#live').html(command);
      var index = $('textarea').prop("selectionStart");
      $('.cursor').html("<font color='yellow'>" + array[i].substring(index, index+1)  + "</font>" );
      $('#live2').html("<font color='yellow'>" + array[i].substring(index+1, array[i].length)  + "</font>" );
      if(command==array[i].substring(0, array[i].length))
      {
        $('.cursor').html('&nbsp');
      }
  }

});

const clear = $('.terminal-output').html();
let array = [];
let counter = -1;
let temp_command = ''; // to store the next command
let command = '';

function reset(){
  $('textarea').val('');
  $('#live').html('');
  $('#live2').html('');
  $('.cursor').html('&nbsp');
};

function validateCommand(currCommand)
{
  // removing the front spaces;
  let validCommandArr = currCommand.split(' ');

  let validCommand = Array();

  for(let i = 0; i < validCommandArr.length; i ++)
    if(validCommandArr[i] != ' ' && validCommandArr[i] != '')
      validCommand.push(validCommandArr[i]);

  return validCommand;
}

function jsonLoadingError()
{
  $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>Getting Error while loading json file :|</span></div></div><br>');
}

function printError(errMessage)
{
  $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>' + errMessage + '</span></div></div><br>'); 
}

function addACommand(cdText)
{
  $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">world@' + window.username + ': ~' + '$ </span><span>' + cdText + '</span></div></div>');
}

function addAText(stringText)
{
  $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>' + stringText + '</span></div></div>');  
}

function noCommandFound()
{
  $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">world@' + window.username + ': ~' + '$ </span><span>' + command + '</span></div></div>');

  if(command.length > 0) {
    $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>No command \''+command+'\' found.</span></div></div>');
  }

  reset();
}

$('textarea').keyup(function(e) {
  let currCommand = $('textarea').val();
  command = currCommand.replace(/(\r\n|\n|\r)/gm,"");
  
  let i;
  let ctrl = e.ctrlKey||e.metaKey; 

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
      let temp = $('textarea').focus().val();
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
      let temp = $('textarea').focus().val();
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

    let index = $('textarea').prop("selectionStart");
    let prev = command.substring(0, index);
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
      $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">world@' + window.username + ': ~$ </span><span>' + command + '</span></div></div>');
      addAText("List of commands");
      addAText("clear - to clear screen");
      addAText("cd - to open the reference");
      addAText("ls - to list details");
      addAText("help - for list of commands");
      reset();
    }
    else if(command.split(" ")[0].trim()=="ls"){
      const cmdAr = validateCommand(command);
      const aboutMe = window.aboutMe;

      if(cmdAr.length == 2 && cmdAr[1] == 'about')
      {
        addACommand(command);
        addAText("Hi I'm " + aboutMe.fullName + ".");
        for(let i = 0; i < aboutMe.generalIntro.length; i ++) {
          addAText(aboutMe.generalIntro[i]);
        }

        addAText("<br> Relevant Profiles ")
        addAText("GitHub : <a href=" + window.links.github.link + " target = \"_blank\">" + window.links.github.username + "</a>")
        addAText("Codeforces : <a href=" + window.links.codeforces.link + " target = \"_blank\">" + window.links.codeforces.username + "</a>")
        addAText("GFG : <a href=" + window.links.gfg.link + " target = \"_blank\">" + window.links.github.username + "</a>")

        addAText("<br> Want to Connect ")
        addAText("LinkedIn : <a href=" + window.links.linkedIn.link + " target = \"_blank\">" + window.links.github.username + "</a>")

        addAText("<br> Mail me at ")
        addAText("You can send me mail at <a href=mailto:" + window.links.email.link + " target = \"_blank\">" + window.links.email.username + "</a> for more information.")

        reset();
      }
      else {
        noCommandFound();
      }
    }
    else{
        noCommandFound();
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
      let index = $('textarea').prop("selectionStart");
      $('.cursor').html("<font color='yellow'>" + array[i].substring(index, index+1)  + "</font>" );
      $('#live2').html("<font color='yellow'>" + array[i].substring(index+1, array[i].length)  + "</font>" );
      if(command==array[i].substring(0, array[i].length))
      {
        $('.cursor').html('&nbsp');
      }
  }

});

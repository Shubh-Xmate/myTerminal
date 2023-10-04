$('textarea').blur(function(e){
    setTimeout(function(){
      $('textarea').focus();    
    }, 50);
  });
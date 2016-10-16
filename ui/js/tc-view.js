$(function(){

  var ui = {
    'tc_prop_view_trigger' : $('#tc_prop_view_trigger'),
    'tc_prop_view_content' : $('#tc_prop_view_content')
  };

  var tcPropViewTrigger = function(ev){
    ui.tc_prop_view_content.toggle();
  };


  ui.tc_prop_view_trigger.on('click',tcPropViewTrigger);

});

//jQuery.noConflict();
if (jQuery.cookie('opt-out-cookie') == undefined || jQuery.cookie('opt-out-cookie') == null) {
  jQuery(function() {
    jQuery("#opt-out-cookie").dialog({
      autoOpen: true,
      resizable: false,
      draggable: false,
      modal: true,
      width: 530,
      buttons: {
        Yes: {
          text: "Schließen",
          class: "yes",
          click: function() {
            jQuery(this).dialog("close");
            jQuery.cookie("opt-out-cookie", "Popup-Image", {
              path: '/'
            });
          }
/*
        },
        No: {
          text: "No",
          class: "no",
          click: function() {
            window.location.href = "http://tutorialab.com";
          }
*/
        }
      },
      hide: "scale"
    });
    jQuery(".ui-dialog").css({
      top: '20%'
    });
    jQuery(".ui-dialog-titlebar").css({
      display: 'none'
    });
    jQuery(".ui-widget-overlay").css({
      background: '#fff',
      opacity: '.3'
    });
  });
}
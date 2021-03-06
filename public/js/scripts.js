jQuery(document).ready(function() {
/*==============================================
                      MODALS
==============================================*/
//Login Modals   
  $('#launch-modal-login').on('click', function(e){
    e.preventDefault();
      $( '#' + $(this).data('modals-id') ).modal();
  });

//Register Modals
	$('#launch-modal-register').on('click', function(e){
		e.preventDefault();
		  $( '#' + $(this).data('modal-id') ).modal();
	});

// Airline Modals
  $( ".searchbtn" ).one("click", function() {
    $( ".thead" ).fadeToggle( "slow", "linear" )
  });
/*==============================================
      VALIDATION FORMS (PINK OUTLINE)
==============================================*/
  $('.registration-form input[type="text"], .registration-form textarea').on('focus', function() {
    $(this).removeClass('input-error');
  });
    
  $('.registration-form').on('submit', function(e) {
    $(this).find('input[type="text"], textarea').each(function(){
      if ($(this).val() == "" ) {
        e.preventDefault();
          $(this).addClass('input-error');
      } else {
          $(this).removeClass('input-error');
      }
    });      
  });
});

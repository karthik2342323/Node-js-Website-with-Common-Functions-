
// Jquery Form
$(document).ready(function(){

	var lv = new LoginValidator();
	var lc = new LoginController();

// main login form //

	// This is an id which is present in login.pug we had taken It as an form Id for Holding Its use
	$('#login').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			// Either Username and password is Empty
			if (lv.validateForm() === false){
				return false;
			} 	else{
			// append 'remember-me' option to formData to write local cookie //
				formData.push({name:'remember-me', value:$('#btn_remember').find('span').hasClass('fa-check-square')});





				// for debugging
				var x="";
				for(var i=0;i<formData.length;i++)
				{
					x+=" "+i+") "+JSON.stringify(formData[i])+" \n ";
				}

				  // for extra stuff
				    x+="See This if possible : \n";
				      for(var i=0;i<formData.length-1;i++)
					  {
					  	var j=JSON.stringify(formData[i]);
					  	j=JSON.parse(j);
					  	x+=" "+j.name+"\n";
					  }

				  // for extra stuff

				//alert(" See This Form data \n"+x);
				// for debugging





				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){

			// for debugging
			//alert(" See this fetched Data from DB "+JSON.stringify(responseText));
			// for debugging

			if (status == 'success') window.location.href = '/home';
		},
		error : function(e){
			// for debugging
			//alert("  Error : "+JSON.stringify(e));
			// for debugging
			lv.showLoginError('Login Failure', 'Please check your username and/or password');
		}
	}); 

	$("input:text:visible:first").focus();
	$('#btn_remember').click(function(){
		var span = $(this).find('span');

		// Now Take the reverse
		if (span.hasClass('fa-minus-square')){
			span.removeClass('fa-minus-square');
			span.addClass('fa-check-square');
		}	else{
			span.addClass('fa-minus-square');
			span.removeClass('fa-check-square');
		}
	});

// login retrieval form via email //
	
	var ev = new EmailValidator();
	
	$('#get-credentials-form').ajaxForm({
		url: '/lost-password',
		beforeSubmit : function(formData, jqForm, options){
			if (ev.validateEmail($('#email-tf').val())){
				ev.hideEmailAlert();
				return true;
			}	else{
				ev.showEmailAlert("Please enter a valid email address");
				return false;
			}
		},
		success	: function(responseText, status, xhr, $form){
			$('#cancel').html('OK');
			$('#retrieve-password-submit').hide();
			ev.showEmailSuccess("A link to reset your password was emailed to you.");
		},
		error : function(e){
			if (e.responseText == 'email-not-found'){
				ev.showEmailAlert("Email not found. Are you sure you entered it correctly?");
			}	else{
				$('#cancel').html('OK');
				$('#retrieve-password-submit').hide();
				ev.showEmailAlert("Sorry. There was a problem, please try again later.");
			}
		}
	});
	
});


$(document).ready(function(){
	
	var av = new AccountValidator();
	var sc = new SignupController();
	
	$('#account-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){

			// for debugging
			var str="";
			for(var i=0;i<formData.length;i++)
			{
				str+=" "+i+" )"+JSON.stringify(formData[i])+"\n";
			}
			alert(" See this data : "+str);

			// for debugging

			return av.validateForm();
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') $('.modal-alert').modal('show');
		},
		error : function(e){
			if (e.responseText == 'email-taken'){
				av.showInvalidEmail();
			}	else if (e.responseText == 'username-taken'){
				av.showInvalidUserName();
			}
		}
	});
	$('#name-tf').focus();
	
// customize the account signup form //
	
	$('#account-form h2').text('Signup');
	$('#account-form #sub').text('Please tell us a little about yourself');
	$('#account-form-btn1').html('Cancel');
	$('#account-form-btn2').html('Submit');
	$('#account-form-btn2').addClass('btn-primary');
	
// setup the alert that displays when an account is successfully created //

	// set properties
	$('.modal-alert').modal({ show:false, keyboard : false, backdrop : 'static' });
	// set Header
	$('.modal-alert .modal-header h4').text('Account Created!');
	// set Message
	$('.modal-alert .modal-body p').html('Your account has been created.</br>Click OK to return to the login page.');

});
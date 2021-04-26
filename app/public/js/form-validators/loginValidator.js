
// simple alert Box
function LoginValidator()
{
// bind a simple alert window to this controller to display any errors //
	this.loginErrors = $('.modal-alert');

	/*
	    @Params
	    t -> text (Header) (String)
	    m -> message (Body) (String)
	 */
	this.showLoginError = function(t, m){

	    // This all is present in views/modals/alert.pug
		// embedded the text(Header)
		$('.modal-alert .modal-header h4').text(t);
		// embedded the message(Body)
		$('.modal-alert .modal-body').html(m);
		// show the text with alert box
		this.loginErrors.modal('show');
	}



}

// depends on data Its get  display the output

LoginValidator.prototype.validateForm = function()
{
	// If User field is empty ( 'user-tf' is an ID which is present in login.pug)
	if ($('#user-tf').val() == ''){
		this.showLoginError('Whoops!', 'Please enter a valid username');
		return false;
	}
	// If Password field is empty
	else if ($('#pass-tf').val() == ''){
		this.showLoginError('Whoops!', 'Please enter a valid password');
		return false;
	}
	// None of above cases then Its valid
	else{
		return true;
	}
}





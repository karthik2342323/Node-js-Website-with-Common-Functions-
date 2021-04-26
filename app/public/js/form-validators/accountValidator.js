
function AccountValidator()
{
// build array maps of the form inputs & control groups //

	// This are from Ids to which we fetch the data
	this.formFields = [$('#name-tf'), $('#email-tf'), $('#user-tf'), $('#pass-tf')];

	// this are taken If any error occur so add that message  on This IDS and show
	this.controlGroups = [$('#name-cg'), $('#email-cg'), $('#user-cg'), $('#pass-cg')];
	
// bind the form-error modal window to this controller to display any errors //

	this.alert = $('.modal-form-errors');

	/* show -> false because we need to show where We needed
       keyboard -> true for enter to finish the alert
       backdrop -> Like animation drop back on user click or
       by exe pointing to cross button
 	 */

	this.alert.modal({ show : false, keyboard : true, backdrop : true});

	// username constrain >3
	this.validateName = function(s)
	{
		return s.length >= 3;
	}
	
	this.validatePassword = function(s)
	{
	// if user is logged in and hasn't changed their password, return ok


		/*
		and another case to think is On signup time where passw
		 */

		//Or _id is given on Launching of Account But passwd is null By default on Launching Account on favour of changing
		if ($('#userId').val() && s===''){
			return true;
		}
		// Else condition On signup Time when passwd is given so check It length
		else{
			return s.length >= 6;
		}
	}
	
	this.validateEmail = function(e)
	{
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(e);
	}
	
	this.showErrors = function(a)
	{
		$('.modal-form-errors .modal-body p').text('Please correct the following problems :');
		var ul = $('.modal-form-errors .modal-body ul');
		  // make empty because previously used May Not be Empty.
			ul.empty();
		for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
		this.alert.modal('show');
	}

}

AccountValidator.prototype.showInvalidEmail = function()
{
	this.controlGroups[1].addClass('error');
	this.showErrors(['That email address is already in use.']);
}

AccountValidator.prototype.showInvalidUserName = function()
{
	this.controlGroups[2].addClass('error');
	this.showErrors(['That username is already in use.']);
}

AccountValidator.prototype.validateForm = function()
{
	var e = [];
	/* Likewise If User has has left field so It will popup an alert
	   and after that again It will fill that field and then It gonna submit
	   so previous class error will be remain so remove that error

	 */
	for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('error');

	// call Individual Functions for checking of each field If It has error Then add class and show that error
	if (this.validateName(this.formFields[0].val()) == false) {
		this.controlGroups[0].addClass('error');
		e.push('Please Enter Your Name');
	}
	if (this.validateEmail(this.formFields[1].val()) == false) {
		this.controlGroups[1].addClass('error');
		e.push('Please Enter A Valid Email');
	}
	if (this.validateName(this.formFields[2].val()) == false) {
		this.controlGroups[2].addClass('error');
		e.push('Please Choose A Username');
	}
	if (this.validatePassword(this.formFields[3].val()) == false) {
		this.controlGroups[3].addClass('error');
		e.push('Password Should Be At Least 6 Characters');
	}

	if (e.length) this.showErrors(e);

	return e.length === 0;
}


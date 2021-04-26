$(document).ready(function(){
    //var ev = new EmailValidator();
    var x=new setBox();

    $('#get-credentials-form').ajaxForm({
        url: '/authentication',
        beforeSubmit : function(formData, jqForm, options){

           // alert("See This ");
            alert(" See This : "+JSON.stringify(formData));
            return true;
        },
        success	: function(responseText, status, xhr, $form){
            /*
            $('#cancel').html('OK');
            $('#authentication-submit').hide();
            ev.showEmailSuccess("A link to reset your password was emailed to you.");

             */
            alert(" See This : success");

        },
        error : function(e){
            /*
            if (e.responseText == 'email-not-found'){
                ev.showEmailAlert("Error ");
            }	else{
                $('#cancel').html('OK');
                $('#authentication-submit').hide();
                ev.showEmailAlert("Sorry. There was a problem, please try again later.");
            }

             */

            alert(" See this : fail");



        }
    });

});
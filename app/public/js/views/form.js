
// Ajax for client side
$(document).ready(function(){
    var check = new FormValidator();
    var exp_1=new HomeController();




    // for debugging
    // This one is needed for click especially if we dont wanna to do separate
    // coding
   // var random=new HomeController();
    // for debugging


    // check whether Its correct or not
    $('#form').ajaxForm({

        beforeSubmit : function(formData, jqForm, options){

            var text="";
            for (var i=0;i<formData.length;i++)
            {
                var y=JSON.stringify(formData[i]);
                text=text+y+"\n";
            }

            // for debugging

            if(check.check(formData)==false)
            {
                return false;
            }


            // for debugging


            //alert("See This Before "+formData[0].value+" \n See this y : "+text);

            /*
            if(!x.check(formData))
            {
                return false;
            }

             */

            //alert(" See This after");




            // add time
            var getTime=new Date().getMilliseconds();
           // alert(" See This Time : "+getTime);
            formData.push({name:'time', value:""+getTime ,type:"text"});

            //formData.push({name:'remember-me', value:$('#btn_remember').find('span').hasClass('fa-check-square')});




            return true;
        },
        success	: function(responseText, status, xhr, $form){
           // if (status == 'success') window.location.href = '/home';
            check.showMessage(" Success "," "+responseText);
        },
        error : function(e){
            //lv.showLoginError('Login Failure', 'Please check your username and/or password');
            check.showMessage(" Error ",JSON.stringify(e));
        }

    });

});
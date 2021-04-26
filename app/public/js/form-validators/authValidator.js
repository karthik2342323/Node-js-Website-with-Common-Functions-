function setBox()
{
    $('#cancel').html('Cancel');
    $('#authentication-submit').show();
    $('#get-credentials').modal('show');



    $('#authentication-submit').click(function(){ $('#get-credentials-form').submit();});
}

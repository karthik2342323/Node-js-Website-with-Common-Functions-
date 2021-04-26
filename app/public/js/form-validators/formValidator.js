
// Message display Box
function FormValidator() {
    this.loginErrors = $('.modal-alert');

    /*
        @Params
        t -> text (Header) (String)
        m -> message (Body) (String)
     */
    this.showMessage = function(header, message){

        // This all is present in views/modals/alert.pug
        // embedded the text(Header)
        $('.modal-alert .modal-header h4').text(header);
        // embedded the message(Body)
        $('.modal-alert .modal-body').html(message);
        // show the text with alert box
        this.loginErrors.modal('show');
    }
}



FormValidator.prototype.check=function (data)  {
    /*
    if ($('#').val() == ''){
    }

     */
    if ($('#Name').val() === '')
    {
        //alert(" Name should not be empty")
        this.showMessage("Field  Name "," Enter that Field Make sure that None of the field should remain Empty");
        return false;
    }

    else if ($('#Gene').val() === ''){
        //alert(" Gene Should be not Empty");
        this.showMessage("Field Gene "," Enter that Field Make sure that None of the field should remain Empty");
        return false;
    }

    else if ($('#Protein_change').val() === ''){
        //alert(" Gene Should be not Empty");
        this.showMessage("Field Protein_change "," Enter that Field Make sure that None of the field should remain Empty");
        return false;
    }

    else if ($('#Clinical_significance').val() === ''){
        //alert(" Gene Should be not Empty");
        this.showMessage("Field Clinical_significance "," Enter that Field Make sure that None of the field should remain Empty");
        return false;
    }

    else if ($('#PSA').val() === ''){
        //alert(" Gene Should be not Empty");
        this.showMessage("Field PSA "," Enter that Field Make sure that None of the field should remain Empty");
        return false;
    }


    else if ($('#DRE').val() === ''){
        //alert(" Gene Should be not Empty");
        this.showMessage("Field DRE "," Enter that Field Make sure that None of the field should remain Empty");
        return false;
    }

    else if ($('#Review_status').val() === ''){
        //alert(" Gene Should be not Empty");
        this.showMessage("Field Review_status "," Enter that Field Make sure that None of the field should remain Empty");
        return false;
    }

    else if ($('#Accession').val() === ''){
        //alert(" Gene Should be not Empty");
        this.showMessage("Field Accession "," Enter that Field Make sure that None of the field should remain Empty");
        return false;
    }


    else if ($('#GRCh37Chromosome').val() === ''){
        //alert(" Gene Should be not Empty");
        this.showMessage("Field GRCh37Chromosome "," Enter that Field Make sure that None of the field should remain Empty");
        return false;
    }


    else if ($('#GRCh37Location').val() === ''){
        //alert(" Gene Should be not Empty");
        this.showMessage("Field GRCh37Location "," Enter that Field Make sure that None of the field should remain Empty");
        return false;
    }


    else if ($('#GRCh38Chromosome').val() === ''){
        //alert(" Gene Should be not Empty");
        this.showMessage("Field GRCh38Chromosome "," Enter that Field Make sure that None of the field should remain Empty");
        return false;
    }


    else if ($('#GRCh38Location').val() === ''){
        //alert(" Gene Should be not Empty");
        this.showMessage("Field GRCh38Location "," Enter that Field Make sure that None of the field should remain Empty");
        return false;
    }


    else if ($('#VariationID').val() === ''){
        //alert(" Gene Should be not Empty");
        this.showMessage("Field VariationID "," Enter that Field Make sure that None of the field should remain Empty");
        return false;
    }


    else if ($('#AlleleID').val() === ''){
        //alert(" Gene Should be not Empty");
        this.showMessage("Field AlleleID "," Enter  that Field Make sure that None of the field should remain Empty");
        return false;
    }


    else if ($('#dbSNP_ID').val() === ''){
        //alert(" Gene Should be not Empty");
        this.showMessage("Field dbSNP_ID "," Enter that Field Make sure that None of the field should remain Empty");
        return false;
    }


    else if ($('#Canonical_SPDI').val() === ''){
        //alert(" Gene Should be not Empty");
        this.showMessage("Field Canonical_SPDI "," Enter that Field Make sure that None of the field should remain Empty");
        return false;
    }





    /*
    let str = "";
    for(let x=0; x<data.length; x++)
    {
        str=str+JSON.parse(JSON.stringify(data[i]))+"\n";
    }
    this.showMessage(" See This Data : ",str);

     */




};

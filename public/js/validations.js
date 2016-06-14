function validateRegisterForm() {
    var errorString = "";
    errorString += generateErrorMessage('form-register-username', 'Bitte geben Sie einen Benutzernamen ein.');
    errorString += generateErrorMessage('form-first-name', 'Bitte geben Sie einen Vornamen ein.');
    errorString += generateErrorMessage('form-last-name', 'Bitte geben Sie einen Nachnamen ein.');
    errorString += generateErrorMessage('form-living-place', 'Bitte geben Sie einen Wohnort ein.');
    errorString += generateMultiConditionalErrorMesages('Bitte geben Sie ein E-Mail Adresse ein.', 'Bitte geben Sie eine korrekte Emailadresse ein.', !$.trim($('#form-email').val()), !validateEmail($('#form-email').val()));
    errorString += generateMultiConditionalErrorMesages('Bitte geben Sie ein Passwort ein.', 'Die eingegebenen Passwörter stimmen nicht überein.', !$.trim($('#form-register-password').val()), $('#form-register-password').val() !== $('#form-confirm-pwd').val());

    if (errorString !== "") {
        $('#register-alert').html(errorString);
        $('#register-alert').show();
    } else {
        $('#register-alert').hide();
    }

    return errorString === "";
}

function generateErrorMessage(fieldname, errormessage){
    condition = !$.trim($('#'+fieldname).val());
    return generateMultiConditionalErrorMesages(errormessage, "",condition, false);
}

function generateMultiConditionalErrorMesages(message1, message2, condition1, condition2){
    if(condition1){
        return "<p->"+message1+"</p->";
    }
    else if(condition2){
        return "<p->"+message2+"</p->";
    }
    else {
        return "";
    }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
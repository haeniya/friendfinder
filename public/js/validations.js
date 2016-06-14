/**
 * This function validates the user inputs of the registration form.
 * @returns {boolean} true if valid, otherwise false
 */
function validateRegisterForm() {
    var errorString = "";
    errorString += generateErrorMessage('form-register-username', 'Bitte geben Sie einen Benutzernamen ein.');
    errorString += generateErrorMessage('form-first-name', 'Bitte geben Sie einen Vornamen ein.');
    errorString += generateErrorMessage('form-last-name', 'Bitte geben Sie einen Nachnamen ein.');
    errorString += generateErrorMessage('form-living-place', 'Bitte geben Sie einen Wohnort ein.');
    errorString += generateMultiConditionalErrorMessages('Bitte geben Sie ein E-Mail Adresse ein.', 'Bitte geben Sie eine korrekte Emailadresse ein.', !$.trim($('#form-email').val()), !validateEmail($('#form-email').val()));
    errorString += generateMultiConditionalErrorMessages('Bitte geben Sie ein Passwort ein.', 'Die eingegebenen Passwörter stimmen nicht überein.', !$.trim($('#form-register-password').val()), $('#form-register-password').val() !== $('#form-confirm-pwd').val());

    if (errorString !== "") {
        $('#register-alert').html(errorString);
        $('#register-alert').show();
    } else {
        $('#register-alert').hide();
    }

    return errorString === "";
}

/**
 * Generate error message after validation.
 * @param fieldname
 * @param errormessage
 */
function generateErrorMessage(fieldname, errormessage){
    var condition = !$.trim($('#'+fieldname).val());
    return generateMultiConditionalErrorMessages(errormessage, "", condition, false);
}

/**
 * This method generates a multiconditional error message.
 * @param message1
 * @param message2
 * @param condition1
 * @param condition2
 * @returns string error message tag
 */
function generateMultiConditionalErrorMessages(message1, message2, condition1, condition2){
    if(condition1){
        return "<p>-"+message1+"</p>";
    } else if(condition2){
        return "<p>-"+message2+"</p>";
    } else {
        return "";
    }
}

/**
 * This function validates the email address given by the user.
 * @param email passed email address of the user.
 * @returns {boolean} true if email is valid
 */
function validateEmail(email) {
    var re = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
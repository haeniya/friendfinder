function checkLogin(formData){
    $.ajax({
        url : "restAPI/login",
        type: "POST",
        data : formData,
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            if(data.loginstatus){
                if ($('#form-remember').is(':checked')) {
                    localStorage.setItem('username',$("#form-username").val());
                    localStorage.setItem('password',$('#form-password').val());
                }
                switchView('map');
                getLocation();
                setInterval(saveCurrentPosition, 20000);
            } else {
                $("#login").find(".alert").text("Benutzername oder Passwort falsch");
                $("#login").find(".alert").fadeIn().delay(3000).fadeOut();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function logout(){
    // clear localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('password');

    $.ajax({
        url : "restAPI/logout",
        type: "get",
        success: function(data, textStatus, jqXHR)
        {
            switchView('login');
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    location.reload();

}

function registerUser(formData){
    $.ajax({
        url : "restAPI/register",
        type: "POST",
        data : formData,
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
            if(data.registerstatus){
                $('#login').find('.alert').text("Registrierung war erfolgreich");
                $('#login').find('.alert').fadeIn().delay(3000).fadeOut();
                switchView('login');
            }else {
                $("#register").find(".alert").text("Etwas ist schiefgelaufen");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#register").find(".alert").text("Etwas ist schiefgelaufen");
        }
    });
}
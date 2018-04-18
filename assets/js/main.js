$(document).ready(function () {
    login_request = function() {
        $.ajax ({
            url: '/users/login',
            method: 'POST',
            data: {email: $("#login_email").val(), password: $("#login_pass").val()},
        }).done(function(data) {
            // console.log(data)
            if (data != "no_cookie") {
            //     console.log(data);
                window.location.assign('http://localhost:3000/');
             }
        })
        .fail(function(xqXHR, textStatus) {
            alert(xqXHR.responseText)
        })
    }
    
    login_request();

    $("#register_button").click (function(event) {
        event.preventDefault()
         $.ajax ({
            url: '/users/register',
            method: 'POST',
            data: {email: $("#register_email").val(), password: $("#register_pass").val()}
        }).done(function(data) {
            console.log(data);
        }).fail(function(xqXHR, textStatus) {
            alert(xqXHR.responseText);
        })
    });

    $("#login_button").click (function(event) {
        event.preventDefault()
        login_request();
    })
})
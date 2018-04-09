$(document).ready(function () {
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
        $.ajax ({
            url: '/users/login',
            method: 'POST',
            data: {email: $("#login_email").val(), password: $("#login_pass").val()},
        }).done(function(data) {
            console.log(data);
            window.location.assign('http://www.youtube.com');
        }).fail(function(xqXHR, textStatus) {
            alert(xqXHR.responseText)
        })
    })
})
$(document).ready(function () {
    $.ajax({
        url: '/users/profile',
        method: 'GET',
    }).done(function(data){
        $('#firstName').val(data.firstName);
        $('#lastName').val(data.lastName);
    }).fail(function(xqXHR, textStatus) {
        window.location.assign("http://localhost:3000/fndr");
    })

    $('#update_button').click(function(event){
        event.preventDefault();
        $.ajax ({
            url: '/users/',
            method: 'PATCH',
            data: {firstName: $("#firstName").val(), lastName: $("#lastName").val()}
        }).done(function(data) {
            alert('Profile Updated');
        }).fail(function(xqXHR, textStatus) {
            alert(xqXHR.responseText);
        })
    })

    $("#logout_button").click(function(event) {
        event.preventDefault();
        $.ajax ({
            url: '/users/logout',
            method: 'POST',
        }).done(function(data) {
            window.location.assign("http://localhost:3000/fndr");
        })
    })
});
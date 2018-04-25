$(document).ready(function () {
    let imgs = {};
    let img_len = 0;

    $.ajax({
        url: '/users/profile',
        method: 'GET',
    }).done(function(data){
        $('#firstName').val(data.firstName);
        $('#lastName').val(data.lastName);
    }).fail(function(xqXHR, textStatus) {
        window.location.assign("http://localhost:3000/fndr");
    })

    $.ajax({
        url: '/restaurant/suggestions',
        method: 'GET',
    }).done(function(data) {
        imgs = data;
        img_len = data.length - 1;
        $('#main-img').attr('src', imgs[img_len--].image);
    });

    function next_img(like) {
        if (like) {
            //add to fave collection
            $.ajax({
                url: '/restaurant/likes',
                method: 'POST',
                data: { image_url: imgs[img_len + 1].image, restaurant_id: imgs[img_len + 1].restaurant_id}
            });
        }
        if (img_len < 0) {
            $('#main-img').attr('src', '');
            alert("Out of images");
        }
        else $('#main-img').attr('src', imgs[img_len--].image);
    }

    function display_fave_tab() {
        $("#faves").empty();
        $.ajax({
            url: '/restaurant/likes',
            method: 'GET',
        }).done(function(data) {
            data.forEach(function(like, index) {
                display_fave(like, index);
            });
        });

    }

    function display_fave(like, index) {
        let name = $("<h2></h2>").text(like.restaurant_id.name);
        let foodimg = name.append($("<img>").attr('src', like.image_url)
            .css({'align': 'left', 'display': 'inline-block', 'width': '5%', 'height': '5%'}));
        let url = $("<p></p>").text(like.restaurant_id.url);
        let unlike = $("<img>").attr('src', '/images/dislike.svg').attr('id', index)
            .css({'align': 'right', 'display': 'inline-block', 'width': '5%', 'height': '5%'});

        $('#faves').append(name, foodimg, url, unlike);

        $('#' + index).click(function(event) {
            event.preventDefault();
            $.ajax({
                url: '/restaurant/likes',
                method: 'DELETE',
                data: {id: like._id}
            }).done(function(data) {
                display_fave_tab();
            });
        })
    } 

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

    $("#dislike").click(function(event) {
        event.preventDefault();
        next_img(false);
    })

    $("#like").click(function(event) {
        event.preventDefault();
        next_img(true);
    })

    $("#fave-icon").click(function(event){
        event.preventDefault();
        display_fave_tab();
        $("#app").hide();
        $("#profile").hide();
        $("#faves").show();
    })
});
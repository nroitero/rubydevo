$(document).ready(function() {
    $("#methods").submit(function (data) {
            data.preventDefault();
        var url = $(this).find("#url").val()
        $.ajax({
            type: 'POST',
            async: false,

            url: "/check/url",
            data: {"url": url},
            dataType: 'json',
            success: function (data) {

                result = data
            }
        });

        var speed = 1000
        console.log(result)
        console.log(result.response)

        if (result.response) {

            $("#forms").slideUp(speed)
            $("#url-display").html(url)
            $("#url-title").html(result.title)
            $("#check-url").slideDown(speed);
            $('html, body').animate({scrollTop: $('#url-form').position().top}, 'slow');
            $('#container2').slideDown(speed);


            var elements = "{" + result.elements.map(function (val, i) {
                return "\"" + val + "\": null"
            }).join(",") + "}"

            $('.autocomplete').autocomplete({data: $.parseJSON(elements)});


        } else {
            console.log(result.error)
            Materialize.toast(result.error, 3000, 'red darken-4')

        }


        $("#url-edit").click(function () {
            $("#check-url").slideUp(speed);
            $("#methods-container").slideUp(speed);
            $("#forms").slideDown(speed)
            $('#container2').slideUp(speed);


        })
    })
})
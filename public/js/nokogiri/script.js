$(document).ready(function () {
    $('.modal').modal();


    function check() {
        methods = $("#drag  .ui-sortable-handle a")
        console.log(methods)
        $("#message").html("")
        $.each(methods, function (key, val) {
            if ($(val).text() === "{{select}}") {
                $("#message").hide().fadeIn(1000).html("click on {{select}} to choose")
                return;
            } else {
                arr = []

                $.each($("#drag  .ui-sortable-handle"), function (key, val) {
                    var has_input = false
                    if ($(this).find("a").length) {
                        has_input = true
                    }
                    // console.log($(this))

                    arr.push({

                        id: $(this).find("a").attr("id"),
                        has_input: has_input,
                        method: $(this).data("method"),
                        type: $(this).data("type"),
                        input: $(this).find("a").text()
                    })

                })

                // console.log(arr)


                $.post('/nokogiri/parse', {info: arr, source: url()}, function (data) {
                    $("#select-container").empty()
                    if (data.error) {
                        Materialize.toast(data.error, 4000, "red darken-4") // 4000 is the duration of the toast
                    } else {
                        // console.log(data)
                        $("#container2").show()

//                            $('#code').text("<script  type=\"prism-html-markup\">" + data.code + " <\/script>")
                        $('#code').text(data.code.replace(/\s+/g, " ").replace(/></g, ">\n<"))
                        Prism.highlightAll();
//                    console.log(elements)
                        $(".tab .active").click()


                    }
                })


            }


        })


    }

//     $(".trigger").click(function () {
//         var id = $(this)[0].id
//         $('#modal-el').data("id", id)
//         $('#modal-el').modal();
//         $('#modal-el').modal('open');
//
//     })
//
//
//     $(".elements").click(function () {
//         id = $(this).parent().parent().data("id")
// //            console.log(this)
// //            console.log(id)
//         $("#" + id).html($(this).text())
//         $('#modal').modal('close');
//
//     })


    $(".method").sortable({
        connectWith: ".connectedSortable",

        helper: function (e, li) {
            this.copyHelper = li.clone().insertAfter(li);

            $(this).data('copied', false);

            return li.clone();
        },
        stop: function () {

            var copied = $(this).data('copied');

            if (!copied) {
                this.copyHelper.remove();
            }

            this.copyHelper = null;
        }, beforeStop: function (event, ui) {

            if (ui.item.parent().attr('id') === "method") {
            }
        }

    });


    $("#drag").sortable({
        items: "li:not(.unsortable)",
        receive: function (e, ui) {
            ui.item.find("a").addClass("trigger").uniqueId().text("{{select}}")
            ui.sender.data('copied', true);
            ui.item.append("<i class=\" remove material-icons\">close</i>")
            check()
            $(".trigger").click(function () {
                var id = $(this)[0].id
                $('#modal-el').data("id", id)
                $('#modal-el').modal();
                $('#modal-el').modal('open');

            })
            $(".remove").click(function () {

                $(this).parent().remove(); //close chip

                    $.post('/nokogiri/url', url(), function (data) {
                        $('#code-container').hide()

                        $('#code').text(data.content).fadeIn(1000)
                        Prism.highlightAll();
                    })
check()
            })
//                check($(this))
        },
        stop: function () {
            //  check($(this))

        }
    });

    $(".remove").click(function () {

        $(this).parent().remove(); //close chip
        check()
        console.log(check())
    })


    $("#url-try").click(function () {
        $('#modal-example').modal('close');
        $('#textarea').val("")

        $('#url').val("http://mangafox.com")
        $('#url').focus();

        $(".btn-submit").click()
    })
    $("#text-try").click(function () {
        $('#modal-example').modal('close');
        $('#url').val("")
        $('#textarea').focus();

        $('#textarea').val("")
        $('#textarea').trigger('autoresize');

        $(".btn-submit").click()
    })


    $('.tabs').tabs({
        swipeable: false,
        responsiveThreshold: 1920
    });



    $('#url').change(function (a) {
        $('#textarea').val('').removeAttr("style")
        $("#data").html()
    });
    $('#textarea').change(function (a) {
        $('#url').val('')
        $("#data").html()

    });


    function url() {
        var url = $("#url").val()
        var textarea = $("#textarea").val()
        var type = ''

        if ((textarea === '') && (url === '')) {
            Materialize.toast("Please fill a source before submitting", 4000, "red") // 4000 is the duration of the toast
            return false
        } else if (url === '') {
            type = "textarea"
            string = textarea
        } else {
            type = "url"
            string = url

        }
        return {string: string, type: type}
    }

    $(".btn-submit").click(function (e) {
        e.preventDefault()
u=url()
        if (u===false){
            return false
        }
        $.post('/nokogiri/url', u, function (data) {
            console.log(url())
            $("#select-container").empty()
            if (data.error) {
                Materialize.toast(data.error, 4000, "red darken-4") // 4000 is the duration of the toast
            } else {
                $("#container2").show()
                // console.log(data.elements)
                function add_elements(type, color) {
                    var elements = data.elements[type].map(function (val, i) {

//                            if(val.slice(0, 1)==="#"){
//                                color="amber-text text-lighten-2"
//                            }else if(val.slice(0, 1)==="."){
//                                color="light-blue-text text-lighten-2"
//
//                            }else{
//                                color="white-text"
//                            }
                        return '<div class="col s2"><a href="#" class="elements ' + color + '">' + val + '</a></div>'

                    }).join('')
                    $("#elements-" + type).html("<h6 class='white-text'>" + type.substr(0, 1).toUpperCase() + type.substr(1) + "</h6>" + elements)
                }

                add_elements("ids", "amber-text text-lighten-2")
                add_elements("classes", "light-blue-text text-lighten-2")
                add_elements("tags", "white-text")


//                    console.log(data.content)
                $('#code-container').hide()

                $('#code').text(data.content)
                Prism.highlightAll();
                $('#code-container').fadeIn(1000)
//                    console.log(elements)
                $(".tab .active").click()

                $(".elements").click(function () {
                    mod = $("#modal-el")
                    id = mod.data("id")
//                        console.log(this)
//                        console.log(id)
                    $("#" + id).hide().fadeIn(1000).html($(this).text())
                    mod.modal('close');
                    check()
                })

            }
        })


    });


});
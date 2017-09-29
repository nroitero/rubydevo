

function check() {
    var arr = []
console.log("check loaded")


    $("#drag .ui-sortable-handle").each(function (index, element) {
        if($(element).find("input").length) {
            console.log($(element).find("input").val())
            console.log($(element).data())
            arr.push({
                index: index,
                has_input: true,
                method: $(element).data("method"),
                type: $(element).data("type"),
                input: $(element).find("input").val()
            })
        }else if($(element).find("select").length) {
            console.log($(element))
            arr.push({
                index: index,
                has_input: true,
                method: $(element).data("method"),
                type: $(element).data("type"),
                input: $(element).find("option:selected").val()
            })
        }


        else{
            arr.push({
                index: index,
                has_input: false,
                method: $(element).data("method"),
                type: $(element).data("type")
            })
        }
    })

//        parent.find("li").each(function (index, element) {
//            if (index > 0) {
//                if($(this).find("input").length ){
//                    var  div=$(this)
//
//
//                arr.push({
//                    index: index,
//                    has_input: true,
//                    command: div.find(".before").text()+div.find("input").val()+div.find(".after").text()
//                })
//
//
//            }else {
//                    arr.push({
//                        index: index,
//                        has_input: false,
//                        command: $(this).find(".method").text()
//                    })
//                }
//
//            }
//        })

    var url = $("#url-display").text()
    console.log(url)

//        var div_id = parent[0].id
    console.log({"url": url, "commands": arr})

    $.ajax({
        type: 'POST',
        async: false,

        url: "/check/nokogiri",
        data: {"url": url, "commands": arr},
        dataType: 'json',
        success: function (data) {
            result = data;
        }
    });
    console.log(result)

    if (!result.error){
        console.log("no error")
        $("#show-error").hide()

        $('#code_txt').html(result.text_cmd)
        $('#result').html("<code data-language=\"html\" id=\"code\"></code>")
        $('.preloader').remove()
        $("#code").html(result.code)

        Rainbow.color();

    }else{
        console.log("error")
        $("#show-error").show()
        $("#code_txt").html(result.text_cmd_error)
        $("#code_error").html(result.text_cmd)

        $("#error_message").html("<code data-language=\"html\" >"+result.message+"</code>")

        $("#result").html("<code data-language=\"html\" id=\"code\"></code>")
        $('.preloader').remove();
        $("#code").html(result.code)
        Rainbow.color();

//            +"<br>showing instead result for: "+result.text_cmd+"<br><br>"+result.code)
//            <div id="error_message"><span id="code_error" class="red-text text-darken-2"></span></div>

    }

//    <h5 id="code_result"></h5>
//            <span id="errors"></span>
//            <pre id="result" class="col-md-6">


//        $("#" + div_id + " li").each(function (index, element) {
//            if (index >= 1) {
//                $(this).removeClass("btn-danger").addClass("btn-info")
//            }
//        })
//        if (result.message) {
//            console.log(result)
//
//            $("#" + div_id + " li").each(function (index, element) {
//
//                if (index >= parseInt(result.id)) {
//                    $(this).removeClass("btn-info").addClass("btn-danger")
//                }
//            })
//
//            $("#result").html("Error for : " + result.nokogiri + "<br><br><code id=\"error\"></code>")
//            $("#error").html(result.message).addClass("text-danger").css({"font-weight":"bold"})
//            $("#error")
//        } else {
//
//            $("#result").html("Result for : " + result.nokogiri + "<br><br><code data-language=\"html\" id=\"code\"></code>")
//            $('.preloader').remove()
//            $("#code").html(result.code)
//            Rainbow.color();
//        }
}
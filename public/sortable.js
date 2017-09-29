$(document).ready(function() {

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
            ui.sender.data('copied', true);
            ui.item.append("<i class=\"close material-icons\">close</i>")

//                check($(this))
        },
        stop: function () {
            //  check($(this))

        }
    });




//
//    <form id="url-form" class="flow-text">
//
//            </form>
//            <span id="url-answer" class="flow-text red-text"></span>
//
//            <div id="check-url">
//            URL:
//    <span id="url-display" class="  white-text"></span>
//            <br>
//            <a class="btn btn-sm waves-effect waves-light">edit</a>
//
//
//            </div>






    $("#drag").sortable({
        items: "li:not(.unsortable)",
        receive: function (e, ui) {
            ui.sender.data('copied', true);
            ui.item.append("<i class=\"close material-icons\">close</i>")

//                check($(this))
        },
        stop: function () {
            //  check($(this))

        }
    });
})
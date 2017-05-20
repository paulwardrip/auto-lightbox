var AutoLightBox = function(elem) {
    var $box = $(document.createElement("div"));
    var $window = $(window);
    var $body = $("body");
    var attached = false;
    var $parent;
    var visible = false;

    var control;

    function incrementControl() {
        control = function() {
            if (typeof window.LightboxAutoControl === 'undefined') {
                window.LightboxAutoControl = 1;
            } else {
                window.LightboxAutoControl++;
            }
            return window.LightboxAutoControl;
        }();
    }

    var show = function () {
        $box.fadeTo(200, .5);
        visible = true;
    };

    var hide = function () {
        $box.fadeTo(200, 0);
        visible = false;
    };

    function adjustSize() {
        $box.css({
            height: 1,
            width: 1
        });

        if (visible) {
            $box.css({
                height: $window.height() + "px",
                width: $window.width() + "px"
            });
        }
    }

    function parent(elem) {
        if (elem) {
            incrementControl();

            if ($parent) {
                $parent.removeClass("lightbox-auto-control-" + (control - 1));
                $box.removeClass("lightbox-" + (control - 1));
            }

            $parent = $(elem);

            $parent.addClass("lightbox-auto-control-" + control);
            $box.addClass("lightbox-" + control);

            var z = $(elem).css("z-index");
            if (!z) {
                z = 50;
                $(elem).css("z-index", z);
            }

            $box.css("z-index", parseInt(z) - 1);
        }
    }

    var attach = function () {
        if (!attached) {
            $body.append($box);
            attached = true;
        }
    };

    var detach = function () {
        $box.detach();
        attached = false;
    };

    $box.css({
        position: "fixed",
        "background-color": "black",
        opacity: 0,
        left: 0,
        top: 0
    });

    parent(elem);
    adjustSize();

    attach();

    window.setInterval(function () {
        if (automatic) {
            if ($(".lightbox-auto-control-" + control + ":visible").length > 0 && !visible) {
                show();
            }
            if ($(".lightbox-auto-control-" + control + ":visible").length === 0 && visible) {
                hide();
            }
        }

        if (attached) {
            adjustSize();
        }
    },100);

    var automatic = true;

    return {
        show: show,
        hide: hide,
        attach: attach,
        detach: detach,
        parent: parent,
        color: function (c) {
            $box.css({
                "background-color": c
            });
        },
        automatic: automatic
    }
};
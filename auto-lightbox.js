var AutoLightBox = function(elem) {
    var box = document.createElement("div");
    //var $window = $(window);
    //var $body = $("body");
    var attached = false;
    //var $parent;
    var parent;
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
        if ($) {
            $(box).fadeTo(200, .5);
        } else {
            box.style.opacity = .5;
        }
        visible = true;
    };

    var hide = function () {
        if ($) {
        	$(box).fadeTo(200, 0);
        } else {
        	box.style.opacity = 0;
        }
        visible = false;
    };

    function adjustSize() {
        box.style.height = 1;
        box.style.width = 1;
 
        if (visible) {
            box.style.height: window.innerHeight + "px",
            box.style.width: window.innerWidth + "px"
        }
    }

    function parent(elem) {
        if (elem) {
            incrementControl();

            if (parent) {
                parent.classList.remove("lightbox-auto-control-" + (control - 1));
                box.classList.remove("lightbox-" + (control - 1));
            }

            parent = elem;

            parent.classList.add("lightbox-auto-control-" + control);
            box.classList.add("lightbox-" + control);

            var z = elem.style.zIndex;
            if (!z) {
                z = 50;
                elem.style.zIndex = z;
            }

            box.style.zIndex = (parseInt(z) - 1);
        }
    }

    var attach = function () {
        if (!attached) {
            document.body.appendChild(box);
            attached = true;
        }
    };

    var detach = function () {
        document.body.removeChild(box);
        attached = false;
    };

    box.style.position = "fixed";
    box.style.backgroundColor = "black";
    box.style.opacity = 0;
    box.style.left = 0;
    box.style.top = 0;

    parent(elem);
    adjustSize();

    attach();

    window.setInterval(function () {
        if (automatic) {
            var ac = document.querySelector(".lightbox-auto-control-" + control);
            if (ac && ac.length > 0) {
                var style = window.getComputedStyle(ac[0]);
                if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === 0){
                    if (visible) hide();
                } else {
                    if (!visible) show();
                }
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
            box.style.backgroundColor = c;
        },
        automatic: automatic
    }
};
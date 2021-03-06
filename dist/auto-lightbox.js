'use strict';

var AutoLightBox = function () {
    var __albinstance = void 0;

    var __intf = function __intf(elem) {
        if (__albinstance !== undefined) {
            __albinstance.parent(elem);
            return __albinstance;
        }

        var box = document.createElement("div");
        var attached = false;
        var parent;
        var visible = false;
        var control;

        function incrementControl() {
            control = function () {
                if (typeof window.LightboxAutoControl === 'undefined') {
                    window.LightboxAutoControl = 1;
                } else {
                    window.LightboxAutoControl++;
                }
                return window.LightboxAutoControl;
            }();
        }

        var show = function show() {
            if (typeof $ !== 'undefined') {
                $(box).fadeTo(200, .5);
            } else {
                box.style.opacity = .5;
            }
            var style = window.getComputedStyle(parent);
            if (style.zIndex) {
                box.style.zIndex = style.zIndex - 1;
            } else {
                parent.style.zIndex = 100;
                box.style.zIndex = 99;
            }
            visible = true;
        };

        var hide = function hide() {
            if (typeof $ !== 'undefined') {
                $(box).fadeTo(200, 0);
            } else {
                box.style.opacity = 0;
            }
            visible = false;
        };

        function adjustSize() {
            box.style.height = "1px";
            box.style.width = "1px";

            if (visible) {
                box.style.height = window.innerHeight + "px";
                box.style.width = window.innerWidth + "px";
            }
        }

        function assignparent(elem) {
            if (elem) {
                if (elem instanceof jQuery) {
                    elem = elem.get(0);
                } else if (typeof elem === 'string') {
                    elem = document.querySelector(elem);
                }

                incrementControl();

                var zi;

                if (parent) {
                    parent.classList.remove("lightbox-auto-control-" + (control - 1));
                    box.classList.remove("lightbox-" + (control - 1));
                    var comps = window.getComputedStyle(parent);

                    zi = comps.zIndex;
                }

                parent = elem;

                if (parent.classList) {
                    parent.classList.add("lightbox-auto-control-" + control);
                } else {
                    parent.class = "lightbox-auto-control-" + control;
                }

                if (box.classList) {
                    box.classList.add("lightbox-" + control);
                } else {
                    box.class = "lightbox-" + control;
                }

                var style = window.getComputedStyle(elem);

                var z = style.zIndex;
                if (!z || z === "auto") {
                    if (zi) {
                        z = zi + 2;
                    } else {
                        z = 50;
                    }

                    elem.style.zIndex = z;
                }

                box.style.zIndex = parseInt(z) - 1;
            }
        }

        var attach = function attach() {
            if (!attached) {
                document.body.appendChild(box);
                attached = true;
            }
        };

        var detach = function detach() {
            document.body.removeChild(box);
            attached = false;
        };

        box.style.position = "fixed";
        box.style.backgroundColor = "black";
        box.style.opacity = 0;
        box.style.left = 0;
        box.style.top = 0;

        assignparent(elem);
        adjustSize();

        attach();

        window.setInterval(function () {
            if (automatic) {
                var ac = document.querySelector(".lightbox-auto-control-" + control);

                if (ac) {
                    var style = window.getComputedStyle(ac);
                    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === 0) {
                        if (visible) hide();
                    } else {
                        if (!visible) show();
                    }
                }
            }

            if (attached) {
                adjustSize();
            }
        }, 100);

        var automatic = true;

        var __api = {
            show: show,
            hide: hide,
            attach: attach,
            detach: detach,
            parent: assignparent,
            color: function color(c) {
                box.style.backgroundColor = c;
            },
            automatic: automatic
        };

        __albinstance = __api;

        return __api;
    };

    setTimeout(function () {
        if (typeof $ !== 'undefined') {
            $.fn.autolightbox = function () {
                AutoLightBox(this);
            };
            console.log("Registered jQuery plugin for autolightbox.");
        }
    }, 0);

    return __intf;
}();
"use strict";

var JsonStyle = function JsonStyle(o) {

    var obj = o;

    var head = document.getElementsByTagName("head")[0];

    function append() {
        var sheet = document.createElement("style");
        sheet.type = "text/css";
        var styles = css();
        sheet.appendChild(document.createTextNode(styles));
        head.appendChild(sheet);
    }

    function css() {
        var csstr = "";
        for (var idx in obj) {
            if (obj.hasOwnProperty(idx)) {
                csstr += idx + " " + JSON.stringify(obj[idx], null, 2).replace(/"/g, '').replace(/,/g, ';') + "\n";
            }
        }
        return csstr;
    }

    return {
        css: css,
        append: append
    };
};
"use strict";

var ElementObserver = function ElementObserver(ele, attr) {
    var observer = new MutationObserver(function (mutations) {
        var nodes = [];
        for (var midx in mutations) {
            if (attr && mutations[midx].type === "attributes") {
                attr(mutations[midx].attributeName);
            } else {
                nodes = nodes.concat(Array.prototype.slice.call(mutations[midx].addedNodes));
            }
        }
        if (ele) {
            ele(nodes);
        }
    });

    var toObserve = {
        attributes: true,
        characterData: false,
        childList: true,
        subtree: true
    };

    observer.observe(document, toObserve);
};
"use strict";

var AutoModal = function () {
    var body = void 0;
    var modals = {};
    var m = 0;
    var autoappend = false;

    var isjq = false;

    var top = void 0;

    var lightbox = void 0;

    var first = true;

    JsonStyle({
        ".auto-modal": {
            "position": "absolute",
            "border-radius": "10px",
            "border": "2px solid #efefef",
            "background": "white",
            "padding": "5px"
        },
        ".auto-modal .closer": {
            "position": "absolute",
            "top": "5px",
            "right": "5px",
            "cursor": "pointer"
        }
    }).append();

    function api(template) {
        var __mo = void 0;

        var container = document.createElement("div");
        container.setAttribute("id", template.getAttribute("id"));

        for (var cidx = 0; cidx < template.classList.length; cidx++) {
            var nextclass = template.classList.item(cidx);
            container.classList.add(nextclass);
        }

        container.innerHTML = template.innerHTML;

        var closer = document.createElement("img");
        closer.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAi0lEQVQYlY2QsRHCQAwE9xkaoAWHp5AWXINLgBKgBLsFSnALUAKEr5AWXMKT6J14PI+Sk0YrBZuye+GPOkamBlcOtTOpN6mYdI75bdKz7lcwu7+ABzCbdAM6YNiAUffIERiy+7IHApyAJT6yB87AB5iA0aRuA5p0AXrgmt0n4BuHAKTw2NRTPTal/wAsYySwFJ9hZgAAAABJRU5ErkJggg==";
        closer.classList.add("closer");
        closer.onclick = function () {
            __mo.hide(onclo);
        };
        container.appendChild(closer);

        container.style.display = "none";
        container.style.opacity = "0";

        template.parentElement.removeChild(template);
        body.appendChild(container);

        var parent = void 0;
        var onclo = void 0;
        var onopo = void 0;

        return __mo = {
            elem: function elem() {
                return container;
            },

            onopen: function onopen(callback) {
                if (callback) {
                    onopo = callback;
                }
                return onopo;
            },

            onclose: function onclose(callback) {
                if (callback) {
                    onclo = callback;
                }
                return onclo;
            },

            show: function show(callback) {
                if (autoappend) {
                    body.appendChild(container);
                }

                if (top) {
                    parent = top;
                }

                top = container;

                if (!lightbox) {
                    lightbox = AutoLightBox(container);
                } else {
                    lightbox.parent(container);
                }

                container.style.display = "block";

                setTimeout(function () {
                    var h = container.offsetHeight;
                    var w = container.offsetWidth;
                    var t = Math.floor((window.innerHeight - h) / 2);
                    var l = Math.floor((window.innerWidth - w) / 2);

                    container.style.top = t + "px";
                    container.style.left = l + "px";
                }, 0);

                var opened = function opened() {
                    if (typeof callback === 'function') {
                        callback();
                    }
                    if (typeof onopo === 'function') {
                        onopo();
                    }
                };

                if (isjq) {
                    $(container).animate({ opacity: 1 }, 250, "swing", function () {
                        opened();
                    });
                } else {
                    container.style.opacity = "1";
                    opened();
                }
            },

            hide: function hide(callback) {
                function thenHide() {
                    if (!autoappend) {
                        container.style.display = "none";
                    } else {
                        body.removeChild(container);
                    }

                    if (parent) {
                        top = parent;
                        parent = null;
                        lightbox.parent(top);
                    }

                    if (typeof callback === 'function') {
                        callback();
                    }
                    if (typeof onclo === 'function') {
                        onclo();
                    }
                }

                if (isjq) {
                    $(container).animate({ opacity: 0 }, 150, "swing", thenHide);
                } else {
                    container.style.opacity = "0";
                }
            }
        };
    }

    function detachAll() {
        for (var idx in modals) {
            if (modals.hasOwnProperty(idx)) {
                modals[idx].elem().parentElement.removeChild(modals[idx].elem());
            }
        }

        console.debug("AutoModal templates are detached from document.");
    }

    function init() {
        var scripts = document.getElementsByTagName("script");
        var todo = scripts.length;
        var temps = [];

        for (var idx = 0; idx < todo; idx++) {
            var elem = scripts[idx];
            if (elem.getAttribute("type") === "text/html") {
                if (elem.classList.contains("auto-modal")) {
                    var id = void 0;
                    if (id = elem.getAttribute("id")) {
                        console.info("AutoModal template found:", id);
                        temps.push(elem);
                    }
                }
            }
        }

        for (var eidx = 0; eidx < temps.length; eidx++) {
            modals[temps[eidx].getAttribute("id")] = api(temps[eidx]);
            m++;
        }

        if (first) {
            console.info("AutoModal init complete:", m, "modals loaded.");
        } else {
            console.info("AutoModal detected new scripts:", m, "modals loaded.");
        }

        var automs = document.querySelectorAll("[auto-modal]");
        for (var _idx = 0; _idx < automs.length; _idx++) {
            if (automs[_idx]) {
                (function () {
                    var trigger = automs[_idx].getAttribute("auto-modal");
                    automs[_idx].onclick = function () {
                        AutoModal(trigger).show();
                    };
                })();
            }
        }

        if (autoappend && m > 0) {
            setTimeout(detachAll, 250);
        }

        first = false;
    }

    setTimeout(function () {
        isjq = typeof $ !== "undefined";
        body = document.getElementsByTagName("body")[0];
        init();

        ElementObserver(function (nodes) {
            for (var idx in nodes) {
                if (nodes[idx].nodeType === Node.ELEMENT_NODE && nodes[idx].tagName === "SCRIPT" && nodes[idx].type === "text/html" && nodes[idx].classList.contains("auto-modal")) {
                    init();
                    break;
                }
            }
        }, function (attr) {
            if (attr === "auto-modal") {
                init();
            }
        });
    }, 10);

    return function (id) {
        return modals[id];
    };
}();

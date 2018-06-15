let AutoModal = function(){
    let body;
    const modals = {};
    let m = 0;
    const autoappend = false;

    let isjq = false;

    let top;

    let lightbox;

    JsonStyle(
        { ".auto-modal": {
            "position": "absolute",
            "padding": "10px",
            "border-radius": "10px",
            "border": "1px solid #efefef",
            "background": "white"
        }},

        {
            ".auto-modal .header": {
                "border-bottom": "1px solid #efefef"
            },
            ".auto-modal .footer": {
                "border-bottom": "1px solid #efefef"
            }
        }

        ).append();


    function api(template) {
        let container = document.createElement("div");
        container.setAttribute("id", template.getAttribute("id"));

        for (let cidx = 0; cidx < template.classList.length; cidx++) {
            let nextclass = template.classList.item(cidx);
            container.classList.add(nextclass);
        }

        container.innerHTML = template.innerHTML;

        container.style.display = "none";
        container.style.opacity = "0";

        body.removeChild(template);
        body.appendChild(container);

        let parent;

        return {
            elem: ()=> {
                return container;
            },

            show: function (callback) {
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

                setTimeout(()=>{
                    let h = container.offsetHeight;
                    let w = container.offsetWidth;
                    let t = Math.floor((window.innerHeight - h) / 2);
                    let l = Math.floor((window.innerWidth - w) / 2);

                    container.style.top = t + "px";
                    container.style.left = l + "px";
                },0);

                if (isjq) {
                    $(container).animate({opacity: 1}, 250, "swing", function () {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    });
                } else {
                    container.style.opacity = "1";
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            },

            hide: function (callback) {
                function thenHide() {
                    if (!autoappend) {
                        container.style.display = "none";
                    } else {
                        body.removeChild(container);
                    }
                    if (typeof callback === 'function') {
                        if (parent) {

                        }
                        callback();
                    }
                }

                if (isjq) {
                    $(container).animate({opacity: 0}, 150, "swing", thenHide);
                } else {
                    container.style.opacity = "0";
                }
            }
        }
    }

    function detachAll() {
        for (let idx in modals) {
            if (modals.hasOwnProperty(idx)) {
                modals[idx].elem().parentElement.removeChild(modals[idx].elem());
            }
        }

        console.debug("AutoModal templates are detached from document.");
    }

    function init() {
        // if (!initkicked) {
        //     initkicked = true;


            let scripts = document.getElementsByTagName("script");
            let todo = scripts.length;
            let temps = [];

            for (let idx = 0; idx < todo; idx++) {
                let elem = scripts[idx];
                if (elem.getAttribute("type") === "text/html") {
                    if (elem.classList.contains("auto-modal")) {
                        let id;
                        if (id = elem.getAttribute("id")) {
                            console.info("AutoModal template found:", id);
                            temps.push(elem);
                        }
                    }
                }
            }

            for (let eidx = 0; eidx < temps.length; eidx++) {
                modals[temps[eidx].getAttribute("id")] = api(temps[eidx]);
                m++;
            }

            console.debug("AutoModal init complete:", m, "modals loaded.");

            if (autoappend && m > 0) {
                setTimeout(detachAll, 250);
            }
        // }
    }


    // if (typeof $ === 'undefined') {
    //     console.debug("AutoModal was loaded before jQuery, triggering async load to wait for jQuery to be defined.");
    //     setTimeout(function () {
    //         $(init);
    //     }, 0);
    // } else {
    //     $(init);
    // }
    //
    // return function (id) {
    //     if (!initkicked) {
    //         init();
    //     }
    //     return modals[id];
    // }

    setTimeout(()=>{
       isjq = (typeof $ !== "undefined");
       body = document.getElementsByTagName("body")[0];
       init();
    },0);

    return (id)=>{
        return modals[id];
    }
}();
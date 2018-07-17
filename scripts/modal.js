let AutoModal = function(){
    let body;
    const modals = {};
    let m = 0;
    const autoappend = false;

    let isjq = false;

    let top;

    let lightbox;

    let first = true;

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
        let __mo;

        let container = document.createElement("div");
        container.setAttribute("id", template.getAttribute("id"));

        for (let cidx = 0; cidx < template.classList.length; cidx++) {
            let nextclass = template.classList.item(cidx);
            container.classList.add(nextclass);
        }

        container.innerHTML = template.innerHTML;

        let closer = document.createElement("img");
        closer.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAi0lEQVQYlY2QsRHCQAwE9xkaoAWHp5AWXINLgBKgBLsFSnALUAKEr5AWXMKT6J14PI+Sk0YrBZuye+GPOkamBlcOtTOpN6mYdI75bdKz7lcwu7+ABzCbdAM6YNiAUffIERiy+7IHApyAJT6yB87AB5iA0aRuA5p0AXrgmt0n4BuHAKTw2NRTPTal/wAsYySwFJ9hZgAAAABJRU5ErkJggg==";
        closer.classList.add("closer");
        closer.onclick = ()=>{
            __mo.hide(onclo);
        };
        container.appendChild(closer);

        container.style.display = "none";
        container.style.opacity = "0";

        template.parentElement.removeChild(template);
        body.appendChild(container);

        let parent;
        let onclo;
        let onopo;

        return __mo = {
            elem: ()=> {
                return container;
            },

            onopen: (callback)=> {
                if (callback) {
                    onopo = callback;
                }
                return onopo;
            },

            onclose: (callback)=> {
                if (callback) {
                    onclo = callback;
                }
                return onclo;
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

                let opened = ()=> {
                    if (typeof callback === 'function') {
                        callback();
                    }
                    if (typeof onopo === 'function') {
                        onopo();
                    }
                };

                if (isjq) {
                    $(container).animate({opacity: 1}, 250, "swing", function () {
                        opened();
                    });
                } else {
                    container.style.opacity = "1";
                    opened();
                }
            },

            hide: function (callback) {
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
                    $(container).animate({opacity: 0}, 150, "swing", thenHide);
                } else {
                    container.style.opacity = "0";
                }
            }
        };
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

        if (first) {
            console.info("AutoModal init complete:", m, "modals loaded.");
        } else {
            console.info("AutoModal detected new scripts:", m, "modals loaded.");
        }

        let automs = document.querySelectorAll("[auto-modal]");
        for (let idx = 0; idx < automs.length; idx++) {
            console.debug(automs[idx]);
            if (automs[idx]) {
                let trigger = automs[idx].getAttribute("auto-modal");
                automs[idx].onclick = () => {
                    AutoModal(trigger).show();
                };
            }
        }

        if (autoappend && m > 0) {
            setTimeout(detachAll, 250);
        }

        first = false;
    }

    setTimeout(()=>{
        isjq = (typeof $ !== "undefined");
        body = document.getElementsByTagName("body")[0];
        init();
    },0);

    ElementObserver((nodes)=>{
        init();
    });

    return (id)=>{
        return modals[id];
    }
}();
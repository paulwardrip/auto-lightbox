
let JsonStyle = function (o) {

    let obj = o;

    const head = document.getElementsByTagName("head")[0];

    function append() {
        let sheet = document.createElement("style");
        sheet.setAttribute("type", "text/css");
        sheet.innerText = css();
        head.appendChild(sheet);
    }

    function css() {
        for (let idx in obj) {
            if (obj.hasOwnProperty(idx)) {
                return idx + " " + JSON.stringify(obj[idx], null, 2).replace(/"/g,'').replace(/,/g, ';');
            }
        }
    }

    return {
        css: css,
        append: append
    }
};

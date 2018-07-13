
let JsonStyle = function (o) {

    let obj = o;

    const head = document.getElementsByTagName("head")[0];

    function append() {
        let sheet = document.createElement("style");
        sheet.type = "text/css";
        let styles = css();
        sheet.appendChild(document.createTextNode(styles));
        head.appendChild(sheet);
    }

    function css() {
        let csstr = "";
        for (let idx in obj) {
            if (obj.hasOwnProperty(idx)) {
                csstr += idx + " " + JSON.stringify(obj[idx], null, 2).replace(/"/g,'').replace(/,/g, ';') + "\n";
            }
        }
        return csstr;
    }

    return {
        css: css,
        append: append
    }
};

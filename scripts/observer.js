let ElementObserver = function(ele, attr){
    let observer = new MutationObserver(function(mutations) {
        let nodes = [];
        for (let midx in mutations) {
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

    let toObserve = {
        attributes: true,
        characterData: false,
        childList: true,
        subtree: true
    };

    observer.observe(document, toObserve);

};

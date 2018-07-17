let ElementObserver = function(cb){
    // Create a mutation observer to automatically hook up any dynamically added form fields.
    let observer = new MutationObserver(function(mutations) {
        let nodes = [];
        for (let midx in mutations) {
            nodes = nodes.concat(mutations[midx].addedNodes);
        }
        cb(nodes);
    });

    let toObserve = {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: true
    };

    observer.observe(document, toObserve);
};

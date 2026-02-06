class FritosObject {
    constructor(elements) {
        this.elements = Array.from(elements).filter(Boolean);
    }


    /**
     * @param {string} selector - optional
     * @returns {FritosObject}
     */
    parent(selector) {
        let parents = this.elements.map(p => p.parentElement).filter(Boolean);

        if (selector) {
            parents = parents.filter(p => p.matches(selector));
        }
        return new FritosObject([...new Set(parents)]);
    }


    /**
     * @param {string} selector - optional
     *      if no selector: return first ancestor (first ancestor = parent of parent => element -> parent -> first ancestor)
     *      if selector: return all ancestors that match the selector (until you reach the body)
     * @returns 
     */
    ancestor(selector) {
        let ancestors = [];

        this.elements.forEach(a => {
            // start at grandparent (skip parent)
            let current = a.parentElement ? a.parentElement.parentElement : null;

            // only grandparent if no selector
            if (!selector) {
                if (current) ancestors.push(current);
                return;
            }
            
            while (current && current.tagName.toLowerCase() !== 'body') {
                if (current.matches(selector)) {
                    ancestors.push(current);
                }
                current = current.parentElement;
            }
        });

        return new FritosObject([...new Set(ancestors)]);
    }


    /**
     * @param {object} cssProperties - animation state
     * @param {object} options  - how it should animate itself
     *      animationOptions: duration, delay, easing, iterationCount and fillMode
     */
    animate(cssProperties = {}, options = {}) {

        // get
        const easing = options.easing;
        const fillMode = options.fillMode;
        
        // duration in ms, default 0
        const duration = options.duration ? parseFloat(options.duration) : 0;

        // delay
        let delay = options.delay.trim();
        if (typeof delay === "string") {
            if (delay === "initial" || delay === "inherit") {
                options.delay = 0; // default to 0 if invalid
            }           
        
            if (delay.endsWith("ms")) {
                delay = parseFloat(delay);
            } else if (delay.endsWith("s")) {
                delay = parseFloat(delay) * 1000;
            } else if (delay.endsWith("m")) {
                delay = parseFloat(delay) * 60000;
            } else {
                delay = parseFloat(delay); // assume ms if no unit
            }
        }
        
        let iterationCount = options.iterationCount;
        if (typeof iterationCount === "string") {
            if (iterationCount === "infinite") {
                iterationCount = Infinity;
            } else if (iterationCount === "initial" || iterationCount === "inherit") {
                iterationCount = 1;
            } else {
                iterationCount = parseFloat(iterationCount);
            }
        }

        // apply animation
        this.elements.forEach(el => {
            el.animate([cssProperties], {
                duration,
                delay,
                easing,
                iterationCount,
                fill: fillMode
            });
        });

        return this; // for chaining
    }


    /**
     * @param {string} selector 
     * @returns {FritosObject}
     */
    find(selector) {
        // TODO
        // return new FritosObject([...new Set(parents)]);
        return null;
    }

    onEvent(eventType, eventFunction) {  // TODO

        return null;
    }

    /**
     * @param {string} externalURL 
     * @param {*} HTTPRequestOptions - method, timeout, headers, body, onSuccess, onError.
     */
    remoteCall(externalURL, HTTPRequestOptions) {  // TODO

        return null;
    }


    validation(someParameters) { // TODO

        return null;
    }


    hide() {
        // TODO
        return null;
    }

    prune() {
        // TODO
        return null;
    }


    /**
     * @param {int} level - default 1
     */
    raise(level = 1) { // TODO

        return null;
    };

    attrs(attributeName, value) { // TODO

        return null;
    };

    /**
     * @param {*} value - optional
     */
    val(value) {
        // TODO
        return null;
    }
}


function fritos(selector) {
    const result = document.querySelectorAll(selector);
    return new FritosObject(result);
}

window.fritos = fritos;


// TESTING


// 4. PARENT
const parent = fritos('input[type="password"]').parent();
const unknownParent = fritos('#password').parent('div');

console.log("4. PARENT");
console.log(parent.elements);
console.log(unknownParent.elements);

// 5. ANCESTOR
const ancestor1 = fritos('.item-image').ancestor(); // Returns the first ancestor <div class="items"></div>
const ancestor2 = fritos('.item-image').ancestor('main')  // Returns the ancestor <main></main>

console.log("5. ANCESTOR");
console.log(ancestor1.elements);
console.log(ancestor2.elements);

// 6. ANIMATE
console.log("6. ANIMATE");
fritos('.moveable-item').animate({
    transform: 'translateX(100px)'
}, {
    // Time in milliseconds
    duration: 1000,
    // time, 'initial', 'inherit'
    delay: '2s',
    // ease, linear, ease-in, ease-in-out, cubic-bezier(n, n, n, n)
    easing: 'linear',
    // number, 'infinite', 'initial', 'inherit'
    iterationCount: 1,
    // none, forwards, backwards, both, initial, inherit
    fillMode: 'none'
})
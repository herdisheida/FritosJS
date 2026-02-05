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
     * @param {object} animationOptions  - how it should animate itself
     */
    animate(cssProperties = {}, animationOptions = {}) {  // TODO
        if (animationOptions.duration == null) animationOptions.duration = 0;

        if (typeof normalized.delay === "string") {
            const s = normalized.delay.trim();

            if (s.endsWith("ms")) {
                normalized.delay = parseFloat(s);
            } else if (s.endsWith("s")) {
                normalized.delay = parseFloat(s) * 1000;
            } else {
                normalized.delay = parseFloat(s); // fallback
            }
        }
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

console.log(parent.elements);
console.log(unknownParent.elements);

// 5. ANCESTOR
const ancestor1 = fritos('.item-image').ancestor(); // Returns the first ancestor <div class="items"></div>
const ancestor2 = fritos('.item-image').ancestor('main')  // Returns the ancestor <main></main>

console.log(ancestor1.elements);
console.log(ancestor2.elements);
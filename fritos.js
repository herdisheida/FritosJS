class FritosObject {
    constructor(elements) {
        this.elements = Array.from(elements).filter(Boolean);
    }


    /**
     * @param {string} selector 
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
     * @param {string} selector 
     * @returns 
     */
    ancestor(selector) {
        // TODO bíða þanga til kennari svara um ancestor behaviour :DD
        const ancestor = new Set();

        this.elements.forEach(a => {
            let current = a.parentElement;
            while (current) {
                if (!selector || current.matches(selector)) {
                    ancestor.add(current);
                }
                current = current.parentElement;
            }
        });

        return new FritosObject([...ancestor]);
    }

    
    /**
     * @param {object} cssProperties 
     * @param {object} animationOptions 
     */
    animate(cssProperties, animationOptions) {

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
const ancestor1 = fritos('.item-image').ancestor(); // Returns the first ancestor <div class="item"></div>
const ancestor2 = fritos('.item-image').ancestor('main')  // Returns the ancestor <main></main>

console.log(ancestor1.elements);
console.log(ancestor2.elements);
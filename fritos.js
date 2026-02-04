class FritosObject {
    constructor(elements) {
        this.elements = Array.from(elements).filter(Boolean);
    }

    parent(selector) {
        let parents = this.elements.map(p => p.parentElement).filter(Boolean);

        if (selector) {
            parents = parents.filter(p => p.matches(selector));
        }
        return new FritosObject([...new Set(parents)]);
    }
}


function fritos(selector) {
    const result = document.querySelectorAll(selector);
    return new FritosObject(result);
}

window.fritos = fritos;


// TESTING


// 3. PARENT
const parent = fritos('input[type="password"]').parent();
const unknownParent = fritos('#password').parent('div');

console.log(parent.elements);
console.log(unknownParent.elements);
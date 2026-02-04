



// query selector function
// function fritos(query) {
//   return {
//     elements: document.querySelectorAll(query)
//   };
// }

// var fritos = {


// }

class FritosObject {
    constructor(elements) {
        this.elements = Array.from(elements).filter(Boolean);
    }

    parent() {
        const parents = this.elements.map(el => el.parentElement);
        return new FritosObject([...new Set(parents)] // remove duplicates
        );
    }
}


function fritos(selector) {
    const result = document.querySelectorAll(selector);
    return new FritosObject(result);
}

window.fritos = fritos;


console.log(fritos("p").parent());          // returns wrapper of parents
console.log(fritos("p").parent().parent()); // chaining works if parent() returns wrapper
class FritosObject {
  constructor(elements) {
    this.elements = Array.from(elements).filter(Boolean);
  }

  /**
   * @param {string} selector - optional
   */
  parent(selector) {
    let parents = this.elements.map((p) => p.parentElement).filter(Boolean);

    if (selector) {
      parents = parents.filter((p) => p.matches(selector));
    }
    return new FritosObject([...new Set(parents)]);
  }

  /**
   * @param {string} selector - optional
   *      if no selector: return first ancestor (first ancestor = parent of parent => element -> parent -> first ancestor)
   *      if selector: return all ancestors that match the selector (until you reach the body)
   */
  ancestor(selector) {
    let ancestors = [];

    this.elements.forEach((a) => {
      // start at grandparent (skip parent)
      let current = a.parentElement ? a.parentElement.parentElement : null;

      // only grandparent if no selector
      if (!selector) {
        if (current) ancestors.push(current);
        return;
      }

      while (current && current.tagName.toLowerCase() !== "body") {
        if (current.matches(selector)) {
          ancestors.push(current);
        }
        current = current.parentElement;
      }
    });
    return new FritosObject([...new Set(ancestors)]);
  }

  /**
   * @param {object} cssProperties - animation to state
   * @param {object} options  - how it should animate itself
   *      animationOptions: duration, delay, easing, iterationCount and fillMode
   */
  animate(cssProperties = {}, options = {}) {
    // normalise options
    const norm = { ...options };

    // duration - (ms)
    if (norm.duration == null) norm.duration = 0;

    // delay - '2s' (string) or 2000 (number)
    if (typeof norm.delay === "string") {
      const s = norm.delay.trim();
      if (s.endsWith("ms")) norm.delay = parseFloat(s);
      else if (s.endsWith("s")) norm.delay = parseFloat(s) * 1000;
      else norm.delay = parseFloat(s);
    }

    // change iterationCount to iterations
    if (norm.iterationCount != null) {
      norm.iterations = norm.iterationCount;
      delete norm.iterationCount;
    }
    if (norm.iterations === "infinite") norm.iterations = Infinity;

    // change fillmode to fill
    if (norm.fillMode != null) {
      norm.fill = norm.fillMode;
      delete norm.fillMode;
    }

    // @keyframes - from curr style -> to cssProperties
    this.elements.forEach((el) => {
      const start = {};

      const computed = getComputedStyle(el);
      for (const prop of Object.keys(cssProperties)) {
        start[prop] = computed[prop] || "";
      }

      el.animate([start, cssProperties], norm);
    });
    return this; // chainable and keeps original result set
  }

  /**
   * @param {string} selector - CSS selector
   */
  find(selector) {
    if (!selector) return new FritosObject([]);
    const foundElements = this.elements.flatMap((el) =>
      Array.from(el.querySelectorAll(selector)),
    );
    return new FritosObject([...new Set(foundElements)]);
  }

  /**
   * @param {string} type - event type (e.g., 'click', 'input')
   * @param {function} func
   *    add event listener of <type> and execute <func> when event is triggered
   */
  onEvent(type, func) {
    this.elements.forEach((el) => el.addEventListener(type, func));
    return this; // chainable
  }

  /**
   * @param {string} externalURL
   * @param {*} HTTPRequestOptions - method, timeout, headers, body, onSuccess, onError.
   */
  remoteCall(externalURL, HTTPRequestOptions) {
    // TODO

    return null;
  }

  validation(someParameters) {
    // TODO

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
  raise(level = 1) {
    // TODO

    return null;
  }

  attrs(attributeName, value) {
    // TODO

    return null;
  }

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

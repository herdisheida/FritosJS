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
    const op_copy = { ...options };

    // duration - (ms)
    if (op_copy.duration == null) op_copy.duration = 0;

    // delay - '2s' (string) or 2000 (number)
    if (typeof op_copy.delay === "string") {
      const s = op_copy.delay.trim();
      if (s.endsWith("ms")) op_copy.delay = parseFloat(s);
      else if (s.endsWith("s")) op_copy.delay = parseFloat(s) * 1000;
      else op_copy.delay = parseFloat(s);
    }

    // change iterationCount to iterations
    if (op_copy.iterationCount != null) {
      op_copy.iterations = op_copy.iterationCount;
      delete op_copy.iterationCount;
    }
    if (op_copy.iterations === "infinite") op_copy.iterations = Infinity;

    // change fillmode to fill
    if (op_copy.fillMode != null) {
      op_copy.fill = op_copy.fillMode;
      delete op_copy.fillMode;
    }

    // @keyframes - from curr style -> to cssProperties
    this.elements.forEach((el) => {
      const start = {};

      const computed = getComputedStyle(el);
      for (const prop of Object.keys(cssProperties)) {
        start[prop] = computed[prop] || "";
      }

      el.animate([start, cssProperties], op_copy);
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
    if (!type || typeof func !== "function") return this;
    this.elements.forEach((el) => el.addEventListener(type, func));
    return this; // chainable
  }

  /**
   * @rules {object} rules - validation rules
   *    example:
   *    rules = {
   *               email: [
   *                {
   *                    message: "some error msg",
   *                    valid: (value) => value.length > 0
   *                }
   *            ]
   *          }
   */
  validation(rules = {}) {
    // only use first element in result set
    const root = this.elements[0];
    if (!root || root.children.length === 0) return null;

    // find validatable children inside the form
    const fields = root.querySelectorAll("input, textarea, select");

    // empty if success
    const result = {}; // error msg per field

    fields.forEach((field) => {
      // get field name and rules
      const name = field.name;
      if (!name) return;

      const fieldRules = rules[name];
      if (!Array.isArray(fieldRules)) return;

      for (const rule of fieldRules) {
        if (typeof rule.valid === "function") {
          const isValid = rule.valid(field.value, root, field);
          if (!isValid) {
            result[name] = rule.message;
            break;
          }
        }
      }
    });
    return result; // no chainable after
  }

  hide() {
    this.elements.forEach((el) => {
      el.style.display = "none";
    });
    return this;
  }

  /**
   * remove the parents of the elements within the result set,
   *  therefore pruning the elements up the tree by taking their parents place.
   */
  prune() {
    this.elements.forEach((el) => {
      const child = el;

      if (!child.parentNode) return; // no parent, can't prune
      const parent = child.parentNode;

      parent.replaceWith(child); //remove parent, replace it with child
    });
    return this;
  }

  /**
   * @param {int} level - number of lvl to raise el up the DOM
   */
  raise(level = 1) {
    level = Number(level);
    if (!Number.isFinite(level) || !Number.isInteger(level) || level < 1)
      return this;

    const elems_copy = [...this.elements];
    elems_copy.forEach((el) => {
      let current = el;

      for (let i = 0; i < level; i++) {
        const parent = current.parentElement;
        if (!parent) break;
        const grandParent = parent.parentElement;
        if (!grandParent) break;

        // move elem in front of parent (siblings)
        grandParent.insertBefore(current, parent);
      }
    });
    return this;
  }

  /**
   * @param {string} name - attribute name
   * @param {*} value - attribute value
   *    the attribute name provided should be added or replaced by the new value after the method has executed
   */
  attrs(name, value) {
    if (!name || value === undefined) return this;
    this.elements.forEach((el) => {
      el.setAttribute(name, value);
    });
    return this;
  }

  /**
   * @param {*} value - optional
   *    if value: el should be updated with provided value
   *    if no value: return the value of the first element in the result set
   */
  val(value) {
    // set value
    if (value !== undefined) {
      this.elements.forEach((el) => {
        el.value = value;
      });
      return this;
    }
    // get value of first element
    return this.elements[0] ? this.elements[0].value : undefined;
  }
}

function fritos(selector) {
  const result = document.querySelectorAll(selector);
  return new FritosObject(result);
}

/**
 * @param {string} url
 * @param {object} options - HTTP request options:  method, timeout, headers, body, onSuccess, onError.
 */
fritos.remoteCall = function remoteCall(url, options = {}) {
  const {
    method = "GET",
    timeout = 45, // default 45s
    headers = {},
    body,
    onSuccess = () => {},
    onError = () => {},
  } = options;

  // abort controller to cancel fetch on timeout
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutMs = Number(timeout) * 1000; // sec to ms
  const timerId = setTimeout(() => {
    controller.abort(); // abort fetch
  }, timeoutMs);

  fetch(url, { method, headers, body, signal })
    .then(async (res) => {
      clearTimeout(timerId);

      // non 2xx status code is an error
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        const err = new Error(`HTTP ${res.status} ${res.statusText}`);
        err.status = res.status;
        err.body = text;
        throw err;
      }

      // returning resp body
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) return res.json();
      else return res.text();
    })

    .then((data) => {
      onSuccess(data);
    })

    .catch((err) => {
      clearTimeout(timerId);
      // timeout errors
      if (err.name === "AbortError") {
        onError(new Error(`Abort Error - timeout: ${timeout} seconds`));
        return;
      }
      onError(err);
    });
  // no chaining
};

window.fritos = fritos;

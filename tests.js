// TESTING

// 4. PARENT
const parent = fritos('input[type="password"]').parent();
const unknownParent = fritos("#password").parent("div");

console.log("4. PARENT");
console.log(parent.elements);
console.log(unknownParent.elements);

// 5. ANCESTOR
const ancestor1 = fritos(".item-image.ancestor").ancestor(); // Returns the first ancestor <div class="items"></div>
const ancestor2 = fritos(".item-image.ancestor").ancestor("main"); // Returns the ancestor <main></main>

console.log("5. ANCESTOR");
console.log(ancestor1.elements);
console.log(ancestor2.elements);

// 6. ANIMATE
console.log("6. ANIMATE");
fritos(".moveable-item").animate(
  {
    transform: "translateX(100px)",
    backgroundColor: "red",
    color: "white",
    fontSize: "2rem",
  },
  {
    // Time in milliseconds
    duration: 5000,
    // time, 'initial', 'inherit'
    delay: "2s",
    // ease, linear, ease-in, ease-in-out, cubic-bezier(n, n, n, n)
    easing: "linear",
    // number, 'infinite', 'initial', 'inherit'
    iterationCount: 1,
    // none, forwards, backwards, both, initial, inherit
    fillMode: "none",
  },
);

// 7. FIND
// Returns 5 <div class="item"></div>
console.log("7. FIND");
const item = fritos(".container.find").find(".item.find");
console.log(item.elements);

// 8. ON EVENT
console.log("8. ON EVENT");
fritos('form .form-group input[type="input"]').onEvent("input", function (evt) {
  // This will print out the
  console.log(evt.target.value);

  // extra test höhöh
  evt.target.animate(
    [{ transform: "translateY(0px)" }, { transform: "translateY(100px)" }],
    { duration: 500, fill: "forwards" },
  );
});

// 9. REMOTE CALL
console.log("9. REMOTE CALL");
fritos.remoteCall(
  "https://serene-island-81305-6082ab8ef713.herokuapp.com/api/201",
  {
    // GET, PUT, POST, PATCH, DELETE, HEAD, CONNECT, OPTIONS, TRACE, PATH
    method: "POST",
    // The timeout specified in seconds (defaults to 45)
    timeout: 45,
    // An object representing the headers associated with the HTTP request
    headers: {
      "Accept-Language": "is-IS",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // A request body (in this case parsed as JSON)
    body: JSON.stringify({
      id: 1,
      name: "John Doe",
    }),
    // A success function which is called if the HTTP request was successful
    onSuccess: function (data) {
      // TODO: Use data
      console.log("Remote Call Success:", data);
    },
    // An error function which is called if the HTTP request encountered an error
    onError: function (err) {
      // TODO: Handle error
      console.error("Remote Call Error:", err);
    },
  },
);

// 10. FIND
console.log("10. VALIDATION");
const form = document.querySelector("#user-credentials");
const rules = {
  "email-address": [
    {
      message: "The email address is required",
      valid: (value) => value.length > 0,
    },
    {
      message: "The email address must be correctly formatted",
      // Regex to check if the email address is correctly formatted
      valid: (value) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g.test(value),
    },
  ],
  password: [
    {
      message:
        "The password must contain at least one character, number and special character",

      valid: (value) =>
        // Regex to check if string is more than 8 in length contains
        // at least one character, number and special character
        /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,}$/g.test(value),
    },
  ],
  "confirm-password": [
    {
      message: "The confirm password must match the password",
      valid: (value, parent) => {
        const password = parent.querySelector('input[name="password"]');
        return value === password.value;
      },
    },
  ],
};

// stop reload
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const result = fritos("#user-credentials").validation(rules);
  console.log("validation result:", result);
});

// 11. HIDE
// Hides all elements
console.log("11. HIDE");
fritos(".item.hide").hide();

// 12. PRUNE
console.log("12. PRUNE");
fritos('input[type="text"]').prune();

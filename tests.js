// TESTING

// 4. PARENT
const parent = fritos('input[type="password"]').parent();
const unknownParent = fritos("#password").parent("div");

console.log("4. PARENT");
console.log(parent.elements);
console.log(unknownParent.elements);

// 5. ANCESTOR
const ancestor1 = fritos(".item-image").ancestor(); // Returns the first ancestor <div class="items"></div>
const ancestor2 = fritos(".item-image").ancestor("main"); // Returns the ancestor <main></main>

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
const item = fritos(".container").find(".item");
console.log(item.elements);

// 8. ON EVENT
console.log("8. ON EVENT");
fritos('form .form-group input[type="input"]').onEvent("input", function (evt) {
  // This will print out the
  console.log(evt.target.value);

  // extra test höhöh
  evt.target.animate(
    [{ transform: "translateX(0px)" }, { transform: "translateX(100px)" }],
    { duration: 500, fill: "forwards" },
  );
});

// 9. REMOTE CALL
fritos.remoteCall("https://example.com/api/client", {
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
  },
  // An error function which is called if the HTTP request encountered an error
  onError: function (err) {
    // TODO: Handle error
  },
});

const btn = document.getElementById("btn");
const text = document.getElementById("text");

btn.addEventListener("click", () => {
    if (text.textContent.includes("clicked")) {
        text.textContent = "This is a simple website template.";
    } else {
        text.textContent = "Button clicked!";
    }
});
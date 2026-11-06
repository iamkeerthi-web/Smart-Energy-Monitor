const authForm = document.getElementById("authForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const switchText = document.getElementById("switchText");
const switchButton = document.getElementById("switchButton");
const message = document.getElementById("message");
const dashboardLink = document.getElementById("dashboardLink");

let isLoginMode = false;

function changeMode() {
    isLoginMode = !isLoginMode;

    message.textContent = "";
    nameInput.hidden = isLoginMode;
    nameInput.required = !isLoginMode;

    if (isLoginMode) {
        formTitle.textContent = "Login";
        submitButton.textContent = "Login";
        switchText.textContent = "Don't have an account?";
        switchButton.textContent = "Register";
    } else {
        formTitle.textContent = "Create Account";
        submitButton.textContent = "Register";
        switchText.textContent = "Already have an account?";
        switchButton.textContent = "Login";
    }
}

switchButton.addEventListener("click", changeMode);

authForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const endpoint = isLoginMode
        ? "http://127.0.0.1:5000/api/login"
        : "http://127.0.0.1:5000/api/register";

    const body = isLoginMode
        ? { email, password }
        : { name, email, password };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Something went wrong");
        }

        message.textContent = result.message;
        message.style.color = "green";

        if (isLoginMode) {
            dashboardLink.hidden = false;
        } else {
            // Switch to login after successful registration
            changeMode();
            emailInput.value = email;
            passwordInput.value = "";
            message.textContent =
                "Registration successful! Please log in.";
        }

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "red";
    }
});   
// BACKEND API URL
const BASE_URL = "http://localhost:3000/api/v1/users";

// FORM TYPE
let isLogin = true;

// PASSWORD VISIBILITY TOGGLE
function togglePassword() {
    const input = document.getElementById("password");
    const icon  = document.getElementById("eyeIcon");
    if (input.type === "password") {
        input.type = "text";
        icon.textContent = "◉";
    } else {
        input.type = "password";
        icon.textContent = "◎";
    }
}

// TOGGLE FORM
function toggleForm() {
    isLogin = !isLogin;

    const formTitle    = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");
    const submitBtn    = document.getElementById("submitBtn");
    const btnText      = document.getElementById("btnText");
    const toggleText   = document.getElementById("toggleText");
    const registerFields = document.getElementById("registerFields");

    clearErrors();
    clearMessage();

    if (isLogin) {
        formTitle.innerText    = "Welcome back";
        formSubtitle.innerText = "Sign in to your account";
        btnText.innerText      = "Sign In";
        registerFields.classList.add("hidden");
        toggleText.innerHTML   = `Don't have an account? <span onclick="toggleForm()">Create one</span>`;
    } else {
        formTitle.innerText    = "Create account";
        formSubtitle.innerText = "Get started for free";
        btnText.innerText      = "Register";
        registerFields.classList.remove("hidden");
        toggleText.innerHTML   = `Already have an account? <span onclick="toggleForm()">Sign in</span>`;
    }
}

// CLEAR ERROR MESSAGES
function clearErrors() {
    ["nameError", "phoneError", "emailError", "passwordError"].forEach(id => {
        document.getElementById(id).innerText = "";
    });
}

// VALIDATE FORM
function validateForm(data) {
    let isValid = true;
    clearErrors();

    if (!isLogin) {
        if (!data.name.trim()) {
            document.getElementById("nameError").innerText = "Name is required";
            isValid = false;
        }
        if (!data.phone.trim()) {
            document.getElementById("phoneError").innerText = "Phone number is required";
            isValid = false;
        } else if (!/^[0-9]{10}$/.test(data.phone)) {
            document.getElementById("phoneError").innerText = "Phone must be 10 digits";
            isValid = false;
        }
    }

    if (!data.email.trim()) {
        document.getElementById("emailError").innerText = "Email is required";
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        document.getElementById("emailError").innerText = "Invalid email format";
        isValid = false;
    }

    if (!data.password.trim()) {
        document.getElementById("passwordError").innerText = "Password is required";
        isValid = false;
    } else if (data.password.length < 6) {
        document.getElementById("passwordError").innerText = "Password must be at least 6 characters";
        isValid = false;
    }

    return isValid;
}

// SHOW / CLEAR MESSAGES
function showMessage(message, type = "success") {
    const el = document.getElementById("formMessage");
    el.innerText  = message;
    el.className  = `message ${type}`;
}

function clearMessage() {
    const el = document.getElementById("formMessage");
    el.innerText = "";
    el.className = "message";
}

// RESET FORM FIELDS
function resetFormFields() {
    ["name", "phone", "email", "password"].forEach(id => {
        document.getElementById(id).value = "";
    });
    // Reset password visibility
    const pw = document.getElementById("password");
    const icon = document.getElementById("eyeIcon");
    pw.type = "password";
    icon.textContent = "◎";
}

// HANDLE SUBMIT
async function handleSubmit(event) {
    event.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.7";

    try {
        const data = {
            name:     document.getElementById("name").value,
            phone:    document.getElementById("phone").value,
            email:    document.getElementById("email").value,
            password: document.getElementById("password").value,
        };

        if (!validateForm(data)) {
            showMessage("Please fix the highlighted errors.", "error");
            return;
        }

        clearMessage();

        const endpoint = isLogin ? "login" : "register";
        const body     = isLogin
            ? { email: data.email, password: data.password }
            : data;

        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(body),
        });

        const result = await response.json();

        if (!response.ok) {
            showMessage(result.message || (isLogin ? "Login failed." : "Registration failed."), "error");
            return;
        }

        if (isLogin) {
            localStorage.setItem("token", result.token);
            showMessage("Login successful!", "success");
            resetFormFields();
            console.log(result);
        } else {
            showMessage("Account created! Please sign in.", "success");
            resetFormFields();
            toggleForm();
            console.log(result);
        }
    } catch (error) {
        console.error(error);
        showMessage("Something went wrong. Try again.", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
    }
}

// BACKEND API URL

const BASE_URL =
"http://localhost:3000/api/v1/users";

// FORM TYPE

let isLogin = true;

// TOGGLE FORM

function toggleForm() {

    isLogin = !isLogin;

    const formTitle =
    document.getElementById("formTitle");

    const submitBtn =
    document.getElementById("submitBtn");

    const toggleText =
    document.getElementById("toggleText");

    const registerFields =
    document.getElementById("registerFields");

    clearErrors();
    clearMessage();

    if (isLogin) {

        formTitle.innerText = "Login";

        submitBtn.innerText = "Login";

        registerFields.classList.add("hidden");

        toggleText.innerHTML = `
            Don't have an account?
            <span onclick="toggleForm()">
                Register here
            </span>
        `;

    } else {

        formTitle.innerText = "Register";

        submitBtn.innerText = "Register";

        registerFields.classList.remove("hidden");

        toggleText.innerHTML = `
            Already have an account?
            <span onclick="toggleForm()">
                Sign In
            </span>
        `;

    }

}

// CLEAR ERROR MESSAGES

function clearErrors() {

    document.getElementById("nameError").innerText = "";

    document.getElementById("phoneError").innerText = "";

    document.getElementById("emailError").innerText = "";

    document.getElementById("passwordError").innerText = "";

}

// VALIDATE FORM

function validateForm(data) {

    let isValid = true;

    clearErrors();

    // NAME VALIDATION

    if (!isLogin) {

        if (!data.name.trim()) {

            document.getElementById(
                "nameError"
            ).innerText = "Name is required";

            isValid = false;

        }

        // PHONE VALIDATION

        if (!data.phone.trim()) {

            document.getElementById(
                "phoneError"
            ).innerText = "Phone number is required";

            isValid = false;

        } else if (!/^[0-9]{10}$/.test(data.phone)) {

            document.getElementById(
                "phoneError"
            ).innerText = "Phone must be 10 digits";

            isValid = false;

        }

    }

    // EMAIL VALIDATION

    if (!data.email.trim()) {

        document.getElementById(
            "emailError"
        ).innerText = "Email is required";

        isValid = false;

    } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(data.email)
    ) {

        document.getElementById(
            "emailError"
        ).innerText = "Invalid email format";

        isValid = false;

    }

    // PASSWORD VALIDATION

    if (!data.password.trim()) {

        document.getElementById(
            "passwordError"
        ).innerText = "Password is required";

        isValid = false;

    } else if (data.password.length < 6) {

        document.getElementById(
            "passwordError"
        ).innerText =
        "Password must be at least 6 characters";

        isValid = false;

    }

    return isValid;

}

function showMessage(message, type = "success") {

    const formMessage =
    document.getElementById("formMessage");

    formMessage.innerText = message;

    formMessage.className = `message ${type}`;

}

function clearMessage() {

    const formMessage =
    document.getElementById("formMessage");

    formMessage.innerText = "";

    formMessage.className = "message";

}

function resetFormFields() {

    document.getElementById("name").value = "";

    document.getElementById("phone").value = "";

    document.getElementById("email").value = "";

    document.getElementById("password").value = "";

}

async function handleSubmit(event) {

    event.preventDefault();

    console.log("HANDLE SUBMIT RUNNING");

    try {

        const data = {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        console.log("FORM DATA:", data);

        const valid = validateForm(data);

        if (!valid) {

            showMessage(
                "Please fix the highlighted errors.",
                "error"
            );

            return;
        }

        clearMessage();

        if (isLogin) {

            console.log("LOGIN FETCH STARTED");

            const response = await fetch(
                `${BASE_URL}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: data.email,
                        password: data.password
                    })
                }
            );

            console.log("FETCH RESPONSE:", response);

            const result = await response.json();

            console.log("RESULT:", result);

            if (!response.ok) {

                showMessage(
                    result.message || "Login failed.",
                    "error"
                );

                return;
            }

            localStorage.setItem(
                "token",
                result.token
            );

            showMessage(
                "Login successful!",
                "success"
            );

            resetFormFields();

            console.log(result);

        } else {

            console.log("REGISTER FETCH STARTED");

            const response = await fetch(
                `${BASE_URL}/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            console.log("REGISTER RESULT:", result);

            if (!response.ok) {

                showMessage(
                    result.message ||
                    "Registration failed.",
                    "error"
                );

                return;
            }

            showMessage(
                "Registration successful! Please login.",
                "success"
            );

            resetFormFields();

            toggleForm();

            console.log(result);

        }

    } catch (error) {

        console.log("FULL ERROR:", error);

        showMessage(
            "Something went wrong. Try again.",
            "error"
        );
    }
}
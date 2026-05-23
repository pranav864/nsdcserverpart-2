async function handleSubmit(event) {

    alert("FORM SUBMITTED");

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
            showMessage("Please fix the highlighted errors.", "error");
            return;
        }

        clearMessage();

        if (isLogin) {

            console.log("LOGIN FETCH STARTED");

            const response = await fetch(`${BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password
                })
            });

            console.log("FETCH RESPONSE:", response);

            const result = await response.json();

            console.log("RESULT:", result);

            if (!response.ok) {
                showMessage(result.message || "Login failed.", "error");
                return;
            }

            localStorage.setItem("token", result.token);

            showMessage("Login successful!", "success");

            resetFormFields();

            console.log(result);

        } else {

            console.log("REGISTER FETCH STARTED");

            const response = await fetch(`${BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            console.log("REGISTER RESPONSE:", response);

            const result = await response.json();

            console.log("REGISTER RESULT:", result);

            if (!response.ok) {
                showMessage(result.message || "Registration failed.", "error");
                return;
            }

            showMessage("Registration successful! Please login.", "success");

            resetFormFields();

            toggleForm();

            console.log(result);
        }

    } catch (error) {

        console.log("FULL ERROR:", error);

        showMessage("Something went wrong. Try again.", "error");
    }
}
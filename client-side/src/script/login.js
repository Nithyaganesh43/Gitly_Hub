async function login() {
    try {
        let userName = document.getElementById("userName").value;
        let password = document.getElementById("password").value;
        if (userName.length < 8 || password.length < 8) {
            alert("Username and password must be at least 8 characters");
            return;
        }
        await axios.post(`https://gitly-hub-9tmi.onrender.com/userLogedIn`, { userName, password })
            .then(() => {
                location.href = `https://gitly-hub-9tmi.onrender.com/`;
            })
            .catch(() => {
                alert("Login failed");
            });
    } catch (err) {
        alert(err.message);
    }
}
 
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        login();
    }
});

function forgotPassword() {
    location.href = `https://gitly-hub-9tmi.onrender.com/forgotPassword`;
}

function googleLoginButton() {
    window.location.href = `https://gitly-hub-9tmi.onrender.com/auth/google`;
}

function githubLoginButton() {
    window.location.href = `https://gitly-hub-9tmi.onrender.com/auth/github`;
}

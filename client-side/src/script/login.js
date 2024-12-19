async function login() {
    try {
        let userName = document.getElementById("userName").value;
        let password = document.getElementById("password").value;
        if (userName.length < 8 || password.length < 8) {
            alert("Username and password must be at least 8 characters");
            return;
        }
        await axios.post(`${window.location.href.split('/').slice(0,3).join('/')}/userLogedIn`, { userName, password })
            .then(() => {
                location.href = `${window.location.href.split('/').slice(0,3).join('/')}/`;
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
    location.href = `${window.location.href.split('/').slice(0,3).join('/')}/forgotPassword`;
}

function googleLoginButton() {
    window.location.href = `${window.location.href.split('/').slice(0,3).join('/')}/auth/google`;
}

function githubLoginButton() {
    window.location.href = `${window.location.href.split('/').slice(0,3).join('/')}/auth/github`;
}

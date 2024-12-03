let isRequestInProgress = false;
var email;

function googleLoginButton() {
    window.location.href = 'http://localhost:3000/auth/google';
}

function githubLoginButton() {
    window.location.href = 'http://localhost:3000/auth/github';
}

async function getOTP() {
    if (isRequestInProgress) return;

    const emailField = document.getElementById("email");
    const otpButton = document.getElementById("otpButton");
    email = emailField.value;

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    isRequestInProgress = true;
    otpButton.disabled = true;
    otpButton.innerText = "Requesting...";

    try {
        const response = await axios.post('http://localhost:3000/auth/gitly', { email });
        alert(response.data.message);

        document.getElementById("signupBOX").innerHTML = `
            <input type="text" id="otp" placeholder="Enter Your 6-digit OTP" required>
            <button type="button" onclick="submitOTP()">Submit OTP</button>
        `;

        document.getElementById("otp").addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                submitOTP();
            }
        });

    } catch (error) {
        alert(error.response?.data?.message || "An error occurred. Please try again.");
        otpButton.disabled = false;
        otpButton.innerText = "Get OTP";
    } finally {
        isRequestInProgress = false;
    }
}

function submitOTP() {
    const otp = document.getElementById("otp")?.value;

    if (!otp || otp.length !== 6) {
        alert("Please enter a valid 6-digit OTP.");
        return;
    }

    axios.post('http://localhost:3000/auth/gitly/verifyotp', { otp })
        .then((response) => {
            alert(response.data.message);
            window.location.href = `http://localhost:3000/newUserInfo?email=${email}&platform=gitly`;
        })
        .catch((error) => {
            alert(error.response?.data?.message || "Invalid OTP. Please try again.");
        });
}

document.getElementById("email").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getOTP();
    }
});

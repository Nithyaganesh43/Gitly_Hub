window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);

    const platform = urlParams.get('platform');
    const email = urlParams.get('email');
    const fullname = urlParams.get('fullname');

    if (fullname) document.getElementById('fullName').value = fullname;
    if (email) {
        const emailField = document.getElementById('email');
        emailField.value = email;
        emailField.readOnly = true;
    }
    if (platform) {
        const platformField = document.getElementById('platform');
        platformField.value = platform;
        platformField.readOnly = true;
    }

    const defaultUrl = "https://res.cloudinary.com/dmini3yl9/image/upload/v1730714916/di75th4l9fqebilewtur.avif";
    const img = document.getElementById('profile-img');

    async function loadProfileImage(url, fallbackUrl) {
        try {
            if (!url) throw new Error('Invalid URL');
            const imgCheck = await new Promise((resolve, reject) => {
                const tempImg = new Image();
                tempImg.onload = () => resolve(true);
                tempImg.onerror = () => reject();
                tempImg.src = url;
            });
            if (imgCheck) img.setAttribute('src', url);
        } catch {
            img.setAttribute('src', fallbackUrl);
        }
    }

    const profileUrl = urlParams.get('profileUrl');
    loadProfileImage(profileUrl, defaultUrl);

    const inputFields = document.querySelectorAll('input');
    inputFields.forEach((input) => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                document.getElementById('submit-button').click();
                event.preventDefault();
            }
        });
    });

    document.getElementById('submit-button').onclick = async function (event) {
        event.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const userName = document.getElementById('userName').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password === confirmPassword) {
            await axios
            .post('https://ng-dmcz.onrender.com/signupSuccessful', { fullName, userName, password, email, platform }, {
              withCredentials: true,
            })
            .then((response) => {
              alert(response.data.message);
              window.location.href = `https://ng-dmcz.onrender.com`;
            })
            .catch((error) => {
              console.log(error);
              alert(error.response.data.message);
            });
          
        } else {
            alert("Please make sure all fields are filled correctly.");
        }
    };
};

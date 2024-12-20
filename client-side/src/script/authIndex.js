function login() {
    
    window.location.href = `https://ng-dmcz.onrender.com/login`;
}

function signup() {
    
    window.location.href = `https://ng-dmcz.onrender.com/signup`;
}


const params = new URLSearchParams(window.location.search);
        const error = params.get("error");
        const decodedError = decodeURIComponent(error);
        if(error)
        alert(decodedError);
function login() {
    
    window.location.href = `http://localhost:3000/login`;
}

function signup() {
    
    window.location.href = `http://localhost:3000/signup`;
}


const params = new URLSearchParams(window.location.search);
        const error = params.get("error");
        const decodedError = decodeURIComponent(error);
        if(error)
        alert(decodedError);
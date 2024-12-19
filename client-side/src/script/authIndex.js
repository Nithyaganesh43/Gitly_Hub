function login() {
    
    window.location.href = `${window.location.href.split('/').slice(0,3).join('/')}/login`;
}

function signup() {
    
    window.location.href = `${window.location.href.split('/').slice(0,3).join('/')}/signup`;
}


const params = new URLSearchParams(window.location.search);
        const error = params.get("error");
        const decodedError = decodeURIComponent(error);
        if(error)
        alert(decodedError);
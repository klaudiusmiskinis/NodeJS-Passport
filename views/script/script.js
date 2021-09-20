async function getRequest(url){
    try {
        fetch(url)
        .then(response => response.json())
        .then(data => console.log(data));
    } catch(e) {
        console.log(e)
    }
}


document.getElementById('modificaUsuario').onclick = postRequest('/updateProfile')
async function postRequest(url) {
    data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    console.log(data)

    await fetch(url, {
        method : "POST",
        body: data
    }).then(
        response => response.json()
    ).then(
        html => console.log(html)
    )
}
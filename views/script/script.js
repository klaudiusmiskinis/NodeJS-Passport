document.getElementById('modificar-usuario').onclick = function() {
    postRequest('/updateProfile')
}

// FUNCIONES
async function getRequest(url){
        let response = await fetch(url);
        let data = await response.text();
        console.log(data);
}

async function postRequest(url) {
    change = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(change)
      });
      
    let result = await response.json();
    console.log(result)
}
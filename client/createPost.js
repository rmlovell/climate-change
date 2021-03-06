

let submitButton = document.getElementById('submit');
submitButton.addEventListener("click", function() {
    let title = document.getElementById('title').value;

    let body = document.getElementById('body').value;

    let id = window.localStorage.getItem('currUser')

    let toSend = {'userid': id, 'body': body, 'title': title}

    // let url = 'https://localhost:8080/createPost?id=' + id.toString();
    //let url = 'http://localhost:8080/createPost';

    //let url = 'https://global-warming-cs326.herokuapp.com/createPost?id=' + id.toString();
    if (id !== null) {
        let url = 'https://global-warming-cs326.herokuapp.com/createPost?id=' + id.toString();
        location.href = 'https://global-warming-cs326.herokuapp.com/forum.html'
        sendData(url, JSON.stringify(toSend));
    } else {
        document.getElementById('errText').hidden = false;
    }
})

async function sendData(url, data) {
    fetch(url, {
        method: "POST",
        body: data,
        headers: {
        "Content-Type": "application/json; charset=utf-8",
        'Accept': 'application/json'
        }
    }).then(response => response.json());
}
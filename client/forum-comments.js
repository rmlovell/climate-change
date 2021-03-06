// const { ReplSet } = require("mongodb");
// const { response } = require("express");

//getData('https://global-warming-cs326.herokuapp.com/forum-comments');
let forumID = window.location.search.substring(4);
// let url = 'http://localhost:8080/forum-comments?id=' + forumID
let url = 'https://global-warming-cs326.herokuapp.com/forum-comments?id=' + forumID

getForumData(url)

let createButton = document.getElementById('createComment');
// let butUrl = 'http://localhost:8080/createComment.html?id=' + forumID
let butUrl = 'https://global-warming-cs326.herokuapp.com/createComment.html?id=' + forumID

createButton.href = butUrl;

let forumOPID = '';


async function getForumData(url) {
    let res = await fetch(url, {
    }).then(response => response.json());


    let title = document.getElementById('title');
    let body = document.getElementById('desc');


    // let postURL = 'http://localhost:8080/forum'
    let postURL = 'https://global-warming-cs326.herokuapp.com/forum'
    
    let postRes = await fetch(postURL, {
    }).then(response => response.json());
    let index = 0;
    for (let x = 0; x < postRes.length; x++) {
        if (postRes[x]._id === forumID) {
            forumOPID = postRes[x].userid;
            title.innerText = postRes[x].title
            body.innerText = postRes[x].body
            index = x;
            break;
        }
    }

    let OPName = document.getElementById('OP')

    // let OPURL = 'http://localhost:8080/users'
    let OPURL =  'https://global-warming-cs326.herokuapp.com/users'
    let username = ''
    let OPRes = await fetch(OPURL, {
    }).then(response => response.json());
    for (let x = 0; x < OPRes.length; x++) {
        if (OPRes[x]._id === postRes[index].userid) {
            OPName.innerText = OPRes[x].name;
            username = OPRes[x].name;
            break;
        }
    }
    if (username === '') {
        username = '[deleted]'
    }
    

    let comHolder = document.getElementById('commentHolder')
    let cardIds = {};
    let children = [];
    for (let x = 0; x < res.length; x++) {
        if (res[x].resTo === 0) {
            let name = '';
            for (let i = 0; i < OPRes.length; i++) {
                if (OPRes[i]._id === res[x].id) { 
                    name = OPRes[i].name;
                }
            }
            let card = makeCard(res[x].body, name, res[x]._id)
            comHolder.appendChild(card);
            cardIds[res[x]._id] = card; 
        } else {
            let name = '';
            for (let i = 0; i < OPRes.length; i++) {
                if (OPRes[i]._id === res[x].id) { 
                    name = OPRes[i].name;
                }
            }
            res[x].userName = name;
            children.push(res[x]);
        }
    }
    addChildComment(children, cardIds);
}

function addChildComment(children, cardIds) {
    let kids = [];
    if (children.length === 0) return;
    for (let x = 0; x < children.length; x++) {
        if (Object.keys(cardIds).includes(children[x].resTo)) {
            let toAppend = cardIds[children[x].resTo].getElementsByClassName('childCardHolder')[0]
            let card = makeCard(children[x].body, children[x].userName, children[x]._id);
            toAppend.appendChild(card)
            // delete cardIds[children[x].resTo];
            cardIds[children[x]._id] = card;
        } else {
            kids.push(children[x])
        }
    }
    addChildComment(kids, cardIds);
}

function makeCard(body, userName, resTo) {
    let inner = document.createElement('div');
    inner.className = 'card inner';

    let bod = document.createElement('div');
    bod.className = 'card-body';
    inner.appendChild(bod);

    let respond = document.createElement('a');
    respond.className = 'btn btn-link post';
    respond.innerText = '↳';
    // respond.href = 'http://localhost:8080/createComment&id=' + id + '&resTo=' + resTo;
    respond.addEventListener('click', function() {
        let user = window.localStorage.getItem('username')
        bod.appendChild(makeResponseCard(resTo, user))
    });
    bod.appendChild(respond);

    let mainText = document.createElement('h6');
    mainText.className = 'card-text main-text';
    mainText.innerText = body;
    bod.appendChild(mainText);

    let name = document.createElement('h8');
    name.className = 'card-text small';
    name.innerText = userName;
    bod.appendChild(name);
    let childCardHolder = document.createElement('div');
    childCardHolder.className = 'childCardHolder';
    bod.appendChild(childCardHolder);

    return inner;
}

function makeResponseCard(resTo, userName) {
    console.log(resTo)

    let inner = document.createElement('div');
    inner.className = 'card inner';

    let bod = document.createElement('div');
    bod.className = 'card-body';
    inner.appendChild(bod);

    let inputDiv = document.createElement('div');
    bod.appendChild(inputDiv);
    let input = document.createElement('textarea');
    input.class = 'form-control';
    input.rows = 3;
    input.id = 'commentInput';
    inputDiv.appendChild(input);

    let submit = document.createElement('a')
    // submit.type = 'button';
    submit.innerText = 'Submit Comment'
    submit.className = 'btn btn-primary';
    submit.id = 'submitContent'
    bod.appendChild(submit)

    submit.addEventListener('click', function() {
        let words = input.value;
        sendCommentData(resTo, words);
        submit.remove()
        inputDiv.remove();
        inner.parentNode.appendChild(makeCard(words, userName, resTo))
        inner.remove();
        // resToCard(words);
    })

    return inner;
} 

function sendCommentData(resTo, body) {
    // let link = 'http://localhost:8080/createComment'
    let link = 'https://global-warming-cs326.herokuapp.com/createComment'

    
    let currId = window.localStorage.getItem('currUser');

    let toSend = {'id': currId, 'body': body, 'resTo': resTo, 'postId': forumID}

    sendData(link, JSON.stringify(toSend));

}

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

document.getElementById('deletePost').addEventListener('click', deletePost);

async function deletePost() {
    // let link = 'http://localhost:8080/deletePost?id=' + forumID;
    let link = 'https://global-warming-cs326.herokuapp.com/deletePost?id=' + forumID;
    console.log(forumOPID)
    if (forumOPID === window.localStorage.getItem('currUser')) {
        let res = await fetch(link, {
        }).then(response => response.json());
        location.href = 'https://global-warming-cs326.herokuapp.com/forum.html'
    } else {
        
    }
}

const roomName = document.getElementById("room-name");
const chatMessages = document.querySelector(".chat-messages");
const chatForm = document.getElementById("chat-form");
const userList = document.getElementById("users")
// const {username, room} = qs.parse(location.search, {
//     ignoreQueryPrefix:true
// })
//query string in vanilla JS
const x = window.location.search; // ?username=Mridul&room=Javascript
const params = new URLSearchParams(x);
const username = params.get('username');
const room = params.get('room');


const socket = io();

// join room : emit query to server
const data = {
    username,
    room,
}
socket.emit("joinRoom", data);

// get room and users
socket.on("roomUser", ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})
//whenever server emits message 
socket.on("message", (message) => {
    // change room here
// roomName.textContent = message.room;
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//whenever we submit the message


chatForm.addEventListener("submit", (e) => {
    // prevents from  submitting to file => want to be in browser
    e.preventDefault();

    // get the message from "msg" input field
    const form = e.target;
    const msgInput = form.elements.msg; // element with msg id
    const msg = msgInput.value; // actual message typed by client on the browser
 
    // emit the message now to the server

    socket.emit("chatMessage", msg);

    // clear the message after it is done from input field
    msgInput.value = "";
    msgInput.focus();
});

// function to output message to DOM
function outputMessage(message) {
    //create new element "div"
    const div = document.createElement("div");
    // div class = "message"
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.message}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div);
}

// function to output room names to DOM

function outputRoomName(room) {
    roomName.innerText = room;
}

// function to output room users to DOM
function outputUsers(users) {
    // users.forEach(user => {
    //     const li = document.createElement('li');
    //     li.innerText = user.username;
    //     userList.appendChild(li);
    // });

    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
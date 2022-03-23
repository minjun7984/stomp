const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');
const messageArea = document.querySelector('#messageArea');
const connectingElement = document.querySelector('.connecting');

let stompClient = null;
let username = null;

const colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event) {
    username = document.querySelector('#name').value.trim();

    if(username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}


function onConnected() {

    stompClient.subscribe('/topic/public', onMessageReceived);
    //(Object) subscribe(destination, callback, headers = {})
    //명명된 목적지"/topic/public"을 구독합니다.


    stompClient.send("/app/chat.addUser", {}, JSON.stringify({sender: username, type: 'JOIN'}))
    //send(destination, headers = {}, body = '')
    //명명된 목적지 "/app/chat.adduser"로 메세지를 보냅니다.

    connectingElement.classList.add('hidden');
}


function onError(error) {
    connectingElement.textContent = '웹 소켓이 연결되지 않았습니다. 다시 연결해주세요';
    connectingElement.style.color = 'red';
}


function sendMessage(event) {
    const messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        let chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        //매핑 url , 서버로 보내고싶은 싶은 헤더정보 , 데이터
        messageInput.value = '';
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);

    const messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' 입장하셨습니다!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' 퇴장하셨습니다!';
    } else {
        messageElement.classList.add('chat-message');


        const avatarElement = document.createElement('i');
        const avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        const usernameElement = document.createElement('span');
        const usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    const textElement = document.createElement('p');
    const messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    let index = Math.abs(hash % colors.length);
    return colors[index];
}

usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)
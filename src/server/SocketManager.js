const io = require('./index.js').io

const {MESSAGE_RECIEVED, MESSAGE_SENT, VERIFY_USER, USER_DISCONNECTED, USER_CONNECTED,COMMUNITY_CHAT, LOGOUT} = require('../Events');

const {createUser, createMessage, createChat} = require('../Factories')

let connectedUsers = {  }
let communityChat = createChat()

module.exports = function(socket) {
    console.log("Socket ID:" + socket.id)
    let sendMessageToChatFromUser;

    //Verify Username
    socket.on(VERIFY_USER, (nickname, callback) => {
        if(isUser(connectedUsers, nickname)) {
            callback({isUser:true, user:null})
        }
        else {
            callback({isUser: false, user:createUser({name: nickname})})
        }
    })

    //User connects with username
    socket.on(USER_CONNECTED, (user) => {
        connectedUsers = addUser(connectedUsers, user);
        socket.user = user;

        sendMessageToChatFromUser = sendMessageToChat(user.name); 

        io.emit(USER_CONNECTED, connectedUsers)

        console.log(connectedUsers)
    })

    socket.on(COMMUNITY_CHAT, callback => {
        callback(communityChat)
    })


    //User disconnects
    socket.on('disconnect', ()=> {
        if("user" in socket) {
            connectedUsers = removeUser(connectedUsers, socket.user.name);

            io.emit(USER_DISCONNECTED, connectedUsers)
        }
    })
    //User logouts
    socket.on(LOGOUT, ()=>{
        connectedUsers = removeUser(connectedUsers, socket.user.name);
        io.emit(USER_DISCONNECTED, connectedUsers);
        console.log("Disconnected", connectedUsers);
    })

    socket.on(MESSAGE_SENT, ({chatId, message}) => {
        sendMessageToChatFromUser(chatId, message);
    })
}


//Checks if the user is in list passed in.
//@param userList {Object} Object with key value pairs of Users
//@param username {String}
//@return usernameList {Object} Object with key value pairs of Users
function isUser(userList, username) {
    return username in userList;
}

//Remove user from the list passed in.
//@param userList {Object} Object with key value pairs of Users
//@param username {string} name of user to be removed
//@return userList {Object} Object with key value pairs of Users
function removeUser(userList, username) {
    let newList = Object.assign({}, userList);
    delete newList[username]
    return newList;
}

//Adds user to list passed in.
//@param userList {Object} Object with key value pairs of users
//@param user {User} the user to added to the list
//@return userList {Object} Object with key value pairs of Users
function addUser(userList, user) {
    let newList = Object.assign({}, userList)
    newList[user.name] = user;
    return newList;
}


//Returns a function that will take a chat id and message
//and then emit a broadcast to the chat id.
//@param sender {string} username of sender
//@return function(chatId, message)
function sendMessageToChat(sender){
    return (chatId, message) => {
        io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({message, sender}))
    }
}


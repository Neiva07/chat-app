const io = require('./index.js').io

const {VERIFY_USER, USER_CONNECTED,COMMUNITY_CHAT, LOGOUT} = require('../Events');

const {createUser, createMessage, createChat} = require('../Factories')

let connectedUsers = {  }
let communityChat = createChat()

module.exports = function(socket) {
    console.log("Socket ID:" + socket.id)

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

        io.emit(USER_CONNECTED, connectedUsers)

        console.log(connectedUsers)
    })
    socket.on(COMMUNITY_CHAT, callback => {
        callback(communityChat)
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

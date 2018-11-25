const uuidv4 = require('uuid/v4');

//CreateUser
//Creates a user.
//@prop id {string}
//@prop name {string}
//@param {Object}
//  name {string}
const createUser = ({name = ""} = {}) => (
    {
        id:uuidv4(),
        name
    }
)


//creates a messages object.
//@prop id {string}
//@prop time {Date} the time in 24hr fromat i.e. 14:22
//@prop message {string} actual string message
//@prop sender {string} sender of the message
//@param {object}
//  message{string}
//  sender{string}
const createMessage = ({message = "", sender = ""} = {  }) => (
    {
        id:uuidv4(),
        time: getTime(new Date(Date.now())),
        message,
        sender
    }
)

const createChat = ({messages = [], name = "Community", users = []} = {}) => (
    {
        id: uuidv4(),
        name,
        messages,
        users,
        typingUsers: []
    }
)

//@param date {Date}
//@return a string represented in 24hr itme i.e. '11:30', '19:30''
const getTime = (date) => {
    return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
}

module.exports = {
    createMessage,
    createUser,
    createChat
}

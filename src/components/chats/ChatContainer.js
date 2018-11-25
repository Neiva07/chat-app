import React, {Component} from 'react';
import SideBar from './SideBar'
import {COMMUNITY_CHAT, MESSAGE_SENT, MESSAGE_RECIEVED, TYPING} from '../../Events'
import ChatHeading from './ChatHeading'
import Messages from '../messages/Messages'
import MessageInput from '../messages/MessageInput'

export default class ChatContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            activeChat: null
        }
    }

    componentDidMount() {
        console.log('I mounted!')
        const {socket} = this.props;
        socket.emit(COMMUNITY_CHAT, this.resetChat);
    }

    //Reset the chat back to only the chat passed in.
    //@param chat {Chat}
    resetChat = (chat) => {
        console.log('I will reset the chat')
        return this.addChat(chat, true);
    }

    //Adds chat to the chat container, if reset is true removes all chats
    //and sets that chat to the main chat.
    //Sets the message and typing socket events for the chat.
    //@param chat {Chat} the chat to be added.
    //@param reset {boolean} if true will set the chat as the only chat.
    addChat = (chat, reset) => {
        const {socket} = this.props;
        const {chats} = this.state;
        const newChats = reset ? [chat] : [...chats, chat]
        this.setState({chats:newChats})

        const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`
        const typingEvent = `${TYPING}-${chat.id}` 

        console.log('addChat has run')
        socket.on(typingEvent)       
        socket.on(messageEvent, this.addMessageToChat(chat.id))
    }

    //Returns a function that will
    //adds message to chat with the chatId passed in.
    //@param chatId{number}
    
    addMessageToChat = (chatId) => {
        return message => {
            const {chats} = this.state;
            let newChats = chats.map((chat) => {
                if(chat.id === chatId)
                    chat.messages.push(message)
                return chat
            })

            this.setState({chats:newChats})
        }
    }

    //Update the typing of chat with id passed in.
    //@param chatIId {number}
    updateTypingInChat = (chatId) => {

    }


    //Adds a message to the specfied chat
    //@param chatId {number} The id of the chat to be added to.
    //@param message {string} The message to be added to the chat.

    sendMessage = (chatId, message) => {
        const {socket} = this.props
        socket.emit(MESSAGE_SENT, {chatId, message})
    }
    
    //Sends typing status to server.
    //chatId {number} the id of the chat being typed in.
    //isTyping {boolean} if the user is typing still or not.
    sendTyping = (chatId, isTyping) =>{
        const {socket} = this.props
        socket.emit(TYPING, {chatId, isTyping})
    }

    setActiveChat = (activeChat) =>{
        this.setState({activeChat})
    }

    render() {
        const {user, logout} = this.props;
        const {chats, activeChat} = this.state;
        return (
            <div className="container">
                <SideBar
                    logout={logout}
                    chats={chats}
                    user={user}
                    activeChat={activeChat}
                    setActiveChat={this.setActiveChat}
                />
                <div className="chat-room-container">
                {
                    activeChat !== null ? (
                        <div className="chat-room">
                            <ChatHeading name={activeChat.name} /> 
                            <Messages
                                messages={activeChat.messages}
                                user={user}
                                typingUsers={activeChat.typingUsers}
                            />
                            <MessageInput
                                sendMessage={
                                    (message) => {
                                        this.sendMessage(activeChat.id, message)
                                    }
                                }
                                sendTyping={
                                    (isTyping) =>{
                                        this.sendTyping(activeChat.id, isTyping);
                                    }
                                }
                            />
                        </div>
                    ):
                    (<div className="chat-room choose">
                        <h3>Choose a chat!</h3> 
                    </div>
                    )
                } 
                </div>
            </div>
        )
    }
}
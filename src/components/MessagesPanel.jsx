import React from 'react';

const ChatMessage = (props) => {
    return (

        <div className='message-box'>
            <div className={`avatar ${props.hidden?`hidden`:''}`}></div>
            <div className={`message-author ${props.hidden?`hidden`:''}`} style={{ color: props.color }}>{props.nick},</div>
            <div className={`message-time ${props.hidden?`hidden`:''}`}>{props.time}</div>
            <div className='message'>
                <div className='message-text'>{props.text}</div>
            </div>
        </div>
    );
}

export const ChatBox = (props) => {
    return (
        <div id='chat-box'>
            <form id='dummy-form' onSubmit={props.onClick}></form>
            <input id='chat-input' form='dummy-form' type='text' maxLength='500' autoComplete='off' placeholder='Write a message...' onSubmit={props.onClick} onChange={props.onChange} value={props.value}></input>
            <a id='chat-button' onClick={props.onClick}>Send</a>
        </div>
    );
}

export const MessagesList = (props) => {
    const messagesList = props.messagesList;    
    const messages = messagesList.map((message) => {
        if (message.id === undefined) {
            return null;
        }
        else {
            return (
                <ChatMessage key={message.id} color={message.color} nick={message.nick} time={message.time} text={message.text} />
            )
        }
    });

    return (messages);
}
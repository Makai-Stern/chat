import React from 'react'

import ChatMessages from 'components/ChatMessages/ChatMessages'
import ChatPannel from 'components/ChatPannel/ChatPannel'
import styles from './styles.module.scss'

function Chat() {
    return (
        <div className={styles.container}>
            <ChatMessages />
            <ChatPannel />
        </div>
    )
}

export default Chat

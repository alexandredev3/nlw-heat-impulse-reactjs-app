import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import logoImg from '../../assets/logo.svg';

import styles from './styles.module.scss';

import { api } from '../../services/api';

type User = {
  id: string;
  name: string;
  avatar_url: string;
}

type Message = {
  id: string;
  text: string;
  user: User;
}

const socket = io('http://localhost:3333');

const messagesQueue: Message[] = [];

socket.on('new_messages', (message: Message) => {
  messagesQueue.push(message);
});

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages((prevState) => [
          messagesQueue[0],
          prevState[0],
          prevState[1],
        ].filter(Boolean));

        // filter(Boolean): it remove all undefined, null, values...

        messagesQueue.shift();
      }
    }, 3000);
  }, []);

  useEffect(() => {
    api.get<Message[]>('/messages').then((response) => {
      const { data } = response;

      setMessages(data);
    }).catch(err => {
      console.error(err);
      alert('Failed to load the messages :(, try again later');
    })
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages.map(message => {
          return (
            <li className={styles.message} key={message.id}>
              <p className={styles.messageContent}>{message.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userAvatar}>
                  <img src={message.user.avatar_url} alt={message.user.name} />
                </div>
                <span>
                  {message.user.name}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  )
}
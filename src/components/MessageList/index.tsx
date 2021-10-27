import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import logoImg from '../../assets/logo.svg';

import styles from './styles.module.scss';

import { api } from '../../services/api';
import { User } from '../../contexts/auth';

import { Message } from '../Message';

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
      toast('Failed to load the messages :(, try again later');
    })
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages.map((message, index) => {
          return (
            <motion.li
              className={styles.message}
              key={message.id}
              transition={{
                duration: 0.4,
                delay: index / 5,
              }}
              initial={{
                opacity: 0,
                translateY: -50,
              }}
              animate={{
                opacity: 1,
                translateY: 0,
              }}
            >
            <Message
              text={message.text}
              user={message.user}
            />
            </motion.li>
          );
        })}
      </ul>
    </div>
  )
}
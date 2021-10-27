import { FormEvent, useState } from 'react';
import { VscSignOut } from 'react-icons/vsc';
import { VscGithubInverted } from 'react-icons/vsc';
import { useAuth } from '../../contexts/auth';
import { api } from '../../services/api';

import styles from './styles.module.scss';

export function SendMessageForm() {
  const { user, signOut } = useAuth();

  const [message, setMessage] = useState('');

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!message.trim()) {
      alert('Type something!');
      return;
    }

    try {
      await api.post('/messages', {
        message,
      });

      setMessage('');
    } catch (err) {
      console.error(err);
      alert('Failed to send your message. Try again later.');
    }
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button className={styles.signOutButton} onClick={signOut}>
        <VscSignOut size={32} />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <strong className={styles.userName}>{user?.name}</strong>
        <span className={styles.userGithubUsername}>
          <VscGithubInverted size={16} />
          {user?.login}
        </span>
      </header>

      <form onSubmit={(e) => handleSendMessage(e)} className={styles.sendMessageForm}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          name="message"
          id="message"
          placeholder="Qual sua expectativa para o evento?" 
          onChange={e => setMessage(e.target.value)}
          value={message}
        />

        <button type="submit">Enviar mensagem</button>
      </form>
    </div>
  )
}
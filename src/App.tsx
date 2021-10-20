import styles from './App.module.scss';

import { useAuth } from './contexts/auth';

import { LoginBox } from './components/LoginBox';
import { MessageList } from './components/MessageList';
import { SendMessageForm } from './components/SendMessageForm';

export function App() {
  const { user } = useAuth();

  return (
    <main className={`${styles.contentWrapper} ${!!user ? styles.contentSigned : null}`}>
      <MessageList />
      {!!user ? <SendMessageForm /> : <LoginBox />}
    </main>
  );
}

import styles from './App.module.scss';

import { useAuth } from './contexts/auth';

import { LoginBox } from './components/LoginBox';
import { MessageList } from './components/MessageList';
import { SendMessageForm } from './components/SendMessageForm';
import { Toast } from './components/Toast';

export function App() {
  const { user } = useAuth();

  return (
    <main className={`${styles.contentWrapper} ${!!user ? styles.contentSigned : null}`}>
      <Toast />
      <MessageList />
      {!!user ? <SendMessageForm /> : <LoginBox />}
    </main>
  );
}

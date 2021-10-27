import { User } from '../../contexts/auth';

import styles from './styles.module.scss';

export interface MessageProps {
  text: string;
  user: User;
}

export function Message({ text, user }: MessageProps) {
  return (
    <li className={styles.message} >
      <p className={styles.messageContent}>{text}</p>
      <div className={styles.messageUser}>
        <div className={styles.userAvatar}>
          <img src={user.avatar_url} alt={user.name} />
        </div>
        <span>{user.name}</span>
      </div>
    </li>
  );
}

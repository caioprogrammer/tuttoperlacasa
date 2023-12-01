import React  from 'react';

import styles from './styles.css'

const Logged: React.FC = ({children}) => {

  return (
    <div className={`${styles.loggedWrapper} ${styles.wrapper}`}>
      {children}
    </div>
  );
}

export default Logged;
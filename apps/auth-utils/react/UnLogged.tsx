import React from 'react';

import styles from './styles.css'

const UnLogged: React.FC = ({children}) => {

  return <div className={`${styles.unloggedWrapper} ${styles.wrapper}`}>{children}</div>;
}

export default UnLogged;
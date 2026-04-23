import React from 'react';
import type { InvoiceStatus } from '../types/invoice';
import styles from './StatusBadge.module.css';

interface Props {
  status: InvoiceStatus;
}

const StatusBadge: React.FC<Props> = ({ status }) => {
  return (
    <div className={`${styles.badge} ${styles[status]}`}>
      <span className={styles.dot}></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

export default StatusBadge;

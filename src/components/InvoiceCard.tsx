import React from 'react';
import { Link } from 'react-router-dom';
import type { Invoice } from '../types/invoice';
import StatusBadge from './StatusBadge';
import styles from './InvoiceCard.module.css';

interface Props {
  invoice: Invoice;
}

const InvoiceCard: React.FC<Props> = ({ invoice }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  return (
    <Link to={`/invoice/${invoice.id}`} className={styles.card}>
      <div className={styles.left}>
        <span className={styles.id}><span className={styles.hash}>#</span>{invoice.id}</span>
        <span className={styles.dueDate}>Due {formatDate(invoice.paymentDue)}</span>
        <span className={styles.clientName}>{invoice.clientName}</span>
      </div>
      
      <div className={styles.right}>
        <span className={styles.total}>{formatCurrency(invoice.total)}</span>
        <div className={styles.status}>
          <StatusBadge status={invoice.status} />
        </div>
        <div className={styles.arrow}>
          <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd"/></svg>
        </div>
      </div>
    </Link>
  );
};

export default InvoiceCard;

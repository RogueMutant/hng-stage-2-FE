import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInvoices } from '../hooks/useInvoices';
import StatusBadge from '../components/StatusBadge';
import InvoiceForm from '../components/InvoiceForm';
import DeleteModal from '../components/DeleteModal';
import styles from './InvoiceDetail.module.css';

const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useInvoices();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const invoice = state.invoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <Link to="/" className={styles.backLink}>
            <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M6 1L2 5l4 4" stroke="#7254f3" strokeWidth="2" fill="none" fillRule="evenodd"/></svg>
            Go back
          </Link>
        </div>
        <div className={styles.notFound}>
          <h1>Invoice not found</h1>
          <p>The invoice with ID #{id} does not exist.</p>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    dispatch({ type: 'DELETE_INVOICE', payload: invoice.id });
    navigate('/');
  };

  const handleMarkAsPaid = () => {
    dispatch({ type: 'MARK_AS_PAID', payload: invoice.id });
  };

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
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <Link to="/" className={styles.backLink}>
          <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M6 1L2 5l4 4" stroke="#7254f3" strokeWidth="2" fill="none" fillRule="evenodd"/></svg>
          Go back
        </Link>
      </div>

      <header className={styles.actionBar}>
        <div className={styles.statusArea}>
          <span>Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        
        <div className={styles.desktopActions}>
          <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit</button>
          <button className="btn btn-danger" onClick={() => setIsDeleting(true)}>Delete</button>
          {invoice.status === 'pending' && (
            <button className="btn btn-primary" onClick={handleMarkAsPaid}>Mark as Paid</button>
          )}
        </div>
      </header>

      <section className={styles.details}>
        <div className={styles.top}>
          <div className={styles.idArea}>
            <h2 className={styles.id}><span className={styles.hash}>#</span>{invoice.id}</h2>
            <p className={styles.description}>{invoice.description}</p>
          </div>
          <div className={styles.senderAddress}>
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </div>
        </div>

        <div className={styles.middle}>
          <div className={styles.dates}>
            <div className={styles.dateGroup}>
              <p className={styles.label}>Invoice Date</p>
              <h3 className={styles.value}>{formatDate(invoice.createdAt)}</h3>
            </div>
            <div className={styles.dateGroup}>
              <p className={styles.label}>Payment Due</p>
              <h3 className={styles.value}>{formatDate(invoice.paymentDue)}</h3>
            </div>
          </div>

          <div className={styles.billTo}>
            <p className={styles.label}>Bill To</p>
            <h3 className={styles.value}>{invoice.clientName}</h3>
            <div className={styles.clientAddress}>
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </div>
          </div>

          <div className={styles.sentTo}>
            <p className={styles.label}>Sent to</p>
            <h3 className={styles.value}>{invoice.clientEmail}</h3>
          </div>
        </div>

        <div className={styles.itemsTable}>
          <div className={styles.tableHeader}>
            <span className={styles.itemName}>Item Name</span>
            <span className={styles.qty}>QTY.</span>
            <span className={styles.price}>Price</span>
            <span className={styles.total}>Total</span>
          </div>

          {invoice.items.map((item) => (
            <div key={item.id} className={styles.tableRow}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.mobileItemInfo}>{item.quantity} x {formatCurrency(item.price)}</span>
              </div>
              <span className={styles.qty}>{item.quantity}</span>
              <span className={styles.price}>{formatCurrency(item.price)}</span>
              <span className={styles.total}>{formatCurrency(item.total)}</span>
            </div>
          ))}

          <div className={styles.grandTotal}>
            <span>Amount Due</span>
            <span className={styles.totalAmount}>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </section>


      {/* Mobile Actions Overlay */}
      <div className={styles.mobileActions}>
        <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit</button>
        <button className="btn btn-danger" onClick={() => setIsDeleting(true)}>Delete</button>
        {invoice.status === 'pending' && (
          <button className="btn btn-primary" onClick={handleMarkAsPaid}>Mark as Paid</button>
        )}
      </div>

      <InvoiceForm 
        key={invoice.id + isEditing}
        isOpen={isEditing} 
        onClose={() => setIsEditing(false)} 
        invoiceToEdit={invoice} 
      />

      <DeleteModal 
        id={invoice.id}
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default InvoiceDetail;

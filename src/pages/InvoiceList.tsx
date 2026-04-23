import React, { useState } from 'react';
import { useInvoices } from '../hooks/useInvoices';
import InvoiceCard from '../components/InvoiceCard';
import FilterBar from '../components/FilterBar';
import InvoiceForm from '../components/InvoiceForm';
import EmptyInvoiceIllustration from '../components/EmptyInvoiceIllustration';
import styles from './InvoiceList.module.css';

const InvoiceList: React.FC = () => {
  const { state } = useInvoices();
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!state || !state.filteredInvoices) {
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className="heading-l">Invoices</h1>
          <p className={`body-text ${styles.subtitle}`}>
            {state.filteredInvoices.length > 0
              ? `${state.filteredInvoices.length} invoices`
              : "No invoices"}
          </p>
        </div>

        <div className={styles.actions}>
          <FilterBar />
          <button
            className="btn btn-primary-icon"
            onClick={() => setIsFormOpen(true)}
          >
            <div className={styles.plusIcon}>
              <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.313 10.036V6.055H10.3v-2.024H6.313V.05h-2.02v3.981H.3v2.024h3.992v3.981h2.02z"
                  fill="#7254f3"
                  fillRule="nonzero"
                />
              </svg>
            </div>
            <span>
              New <span className={styles.fullText}>Invoice</span>
            </span>
          </button>
        </div>
      </header>

      <section className={styles.list}>
        {state.filteredInvoices.length > 0 ? (
          state.filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))
        ) : (
          <div className={styles.emptyState}>
            <EmptyInvoiceIllustration />
            <h2>There is nothing here</h2>
            <p>
              Create an invoice by clicking the <strong>New Invoice</strong>{" "}
              button and get started
            </p>
          </div>
        )}
      </section>

      <InvoiceForm
        key={isFormOpen ? "open" : "closed"}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
};

export default InvoiceList;

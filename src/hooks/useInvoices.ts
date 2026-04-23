import { useContext } from 'react';
import { InvoiceContext } from '../context/InvoiceContextStore';

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
}

import { createContext } from 'react';
import type { Invoice, InvoiceStatus } from '../types/invoice';

export type State = {
  invoices: Invoice[];
  filteredInvoices: Invoice[];
  filter: InvoiceStatus | 'all';
};

export type Action =
  | { type: 'SET_INVOICES'; payload: Invoice[] }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'MARK_AS_PAID'; payload: string }
  | { type: 'SET_FILTER'; payload: InvoiceStatus | 'all' };

export const initialState: State = {
  invoices: [],
  filteredInvoices: [],
  filter: 'all',
};

export const filterInvoices = (invoices: Invoice[], filter: InvoiceStatus | 'all') => {
  if (filter === 'all') return invoices;
  return invoices.filter((inv) => inv.status === filter);
};

export const invoiceReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_INVOICES':
      return {
        ...state,
        invoices: action.payload,
        filteredInvoices: filterInvoices(action.payload, state.filter),
      };
    case 'ADD_INVOICE': {
      const newInvoices = [action.payload, ...state.invoices];
      return {
        ...state,
        invoices: newInvoices,
        filteredInvoices: filterInvoices(newInvoices, state.filter),
      };
    }
    case 'UPDATE_INVOICE': {
      const updatedInvoices = state.invoices.map((inv) =>
        inv.id === action.payload.id ? action.payload : inv
      );
      return {
        ...state,
        invoices: updatedInvoices,
        filteredInvoices: filterInvoices(updatedInvoices, state.filter),
      };
    }
    case 'DELETE_INVOICE': {
      const remainingInvoices = state.invoices.filter((inv) => inv.id !== action.payload);
      return {
        ...state,
        invoices: remainingInvoices,
        filteredInvoices: filterInvoices(remainingInvoices, state.filter),
      };
    }
    case 'MARK_AS_PAID': {
      const paidInvoices = state.invoices.map((inv) =>
        inv.id === action.payload ? { ...inv, status: 'paid' as InvoiceStatus } : inv
      );
      return {
        ...state,
        invoices: paidInvoices,
        filteredInvoices: filterInvoices(paidInvoices, state.filter),
      };
    }
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
        filteredInvoices: filterInvoices(state.invoices, action.payload),
      };
    default:
      return state;
  }
};

export const InvoiceContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

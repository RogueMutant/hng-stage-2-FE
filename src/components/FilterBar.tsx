import React, { useState } from "react";
import { useInvoices } from "../hooks/useInvoices";
import type { InvoiceStatus } from "../types/invoice";
import styles from "./FilterBar.module.css";

const FilterBar: React.FC = () => {
  const { state, dispatch } = useInvoices();
  const [isOpen, setIsOpen] = useState(false);

  const statuses: (InvoiceStatus | "all")[] = ["draft", "pending", "paid"];

  const handleFilterChange = (status: InvoiceStatus | "all") => {
    dispatch({
      type: "SET_FILTER",
      payload: state.filter === status ? "all" : status,
    });
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.desktopText}>Filter by status</span>
        <span className={styles.mobileText}>Filter</span>
        <svg
          className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
          width="11"
          height="7"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1l4.228 4.228L9.456 1"
            stroke="#7C5DFA"
            strokeWidth="2"
            fill="none"
            fillRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          {statuses.map((status) => (
            <label key={status} className={styles.option}>
              <input
                type="checkbox"
                checked={state.filter === status}
                onChange={() => handleFilterChange(status)}
              />
              <span className={styles.checkbox}></span>
              <span className={styles.label}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;

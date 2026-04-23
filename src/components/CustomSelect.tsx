import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.css';

interface Option {
  label: string;
  value: number;
}

interface CustomSelectProps {
  options: Option[];
  value: number;
  onChange: (value: number) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.customSelect} ref={dropdownRef}>
      <div
        className={`${styles.selectBox} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption.label}</span>
        <svg
          className={styles.chevron}
          width="11"
          height="7"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1l4.228 4.228L9.456 1"
            stroke="#7254f3"
            strokeWidth="2"
            fill="none"
            fillRule="evenodd"
          />
        </svg>
      </div>

      {isOpen && (
        <div className={styles.optionsContainer}>
          {options.map((option) => (
            <div
              key={option.value}
              className={styles.option}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;

import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomDatePicker.module.css';

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => new Date(value || Date.now()));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateLabel = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // Format as YYYY-MM-DD
    const offset = newDate.getTimezoneOffset();
    newDate.setMinutes(newDate.getMinutes() - offset);
    onChange(newDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);

    const blanks = Array.from({ length: firstDay }).map((_, i) => (
      <div key={`blank-${i}`} className={styles.dayBlank}></div>
    ));

    const selectedDate = value ? new Date(value) : null;
    let selectedDay = -1;
    let selectedMonth = -1;
    let selectedYear = -1;
    if (selectedDate) {
      selectedDay = selectedDate.getDate();
      selectedMonth = selectedDate.getMonth();
      selectedYear = selectedDate.getFullYear();
    }

    const dayNodes = Array.from({ length: days }).map((_, i) => {
      const day = i + 1;
      const isSelected = day === selectedDay && month === selectedMonth && year === selectedYear;
      return (
        <div
          key={`day-${day}`}
          className={`${styles.day} ${isSelected ? styles.selectedDay : ''}`}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </div>
      );
    });

    return [...blanks, ...dayNodes];
  };

  return (
    <div className={styles.customDatePicker} ref={dropdownRef}>
      <div
        className={`${styles.inputBox} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{formatDateLabel(value)}</span>
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 2h-.667V.667A.667.667 0 0012.667 0H12a.667.667 0 00-.667.667V2H4.667V.667A.667.667 0 004 0h-.667a.667.667 0 00-.666.667V2H2C.897 2 0 2.897 0 4v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm.667 12c0 .367-.3.667-.667.667H2A.667.667 0 011.333 14V6.693h13.334V14z"
            fill="#7E88C3"
            fillRule="nonzero"
          />
        </svg>
      </div>

      {isOpen && (
        <div className={styles.calendarContainer}>
          <div className={styles.calendarHeader}>
            <button className={styles.monthNav} onClick={handlePrevMonth}>
              <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 1L2 5l4 4" stroke="#7254f3" strokeWidth="2" fill="none" fillRule="evenodd" />
              </svg>
            </button>
            <span className={styles.monthYearLabel}>
              {currentMonth.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
            </span>
            <button className={styles.monthNav} onClick={handleNextMonth}>
              <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1l4 4-4 4" stroke="#7254f3" strokeWidth="2" fill="none" fillRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className={styles.daysGrid}>
            {renderCalendarDays()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;

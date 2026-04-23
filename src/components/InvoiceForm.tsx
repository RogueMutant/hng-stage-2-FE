import React, { useState } from "react";
import type { Invoice, InvoiceItem, InvoiceStatus } from "../types/invoice";
import { useInvoices } from "../hooks/useInvoices";
import CustomDatePicker from "./CustomDatePicker";
import CustomSelect from "./CustomSelect";
import styles from "./InvoiceForm.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoiceToEdit?: Invoice;
}

const InvoiceForm: React.FC<Props> = ({ isOpen, onClose, invoiceToEdit }) => {
  const { dispatch } = useInvoices();
  const [formData, setFormData] = useState<Partial<Invoice>>(() => {
    if (invoiceToEdit) return invoiceToEdit;
    return {
      createdAt: new Date().toISOString().split("T")[0],
      description: "",
      paymentTerms: 30,
      clientName: "",
      clientEmail: "",
      senderAddress: { street: "", city: "", postCode: "", country: "" },
      clientAddress: { street: "", city: "", postCode: "", country: "" },
      items: [],
      status: "pending",
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleInputChange = (path: string, value: string | number) => {
    const keys = path.split(".");
    let filteredValue = value;

    // Apply filtering based on field type only for strings
    if (typeof value === "string") {
      if (path.includes("postCode")) {
        filteredValue = value.replace(/\D/g, "").slice(0, 10);
      } else if (
        path.includes("country") ||
        path.includes("city") ||
        path === "clientName"
      ) {
        filteredValue = value.replace(/[^a-zA-Z\s]/g, "").slice(0, 30);
      } else if (path.includes("street")) {
        filteredValue = value.replace(/[^a-zA-Z0-9\s,.-]/g, "").slice(0, 50);
      } else if (path === "description") {
        filteredValue = value.slice(0, 100);
      }
    }

    if (keys.length === 1) {
      setFormData({ ...formData, [keys[0]]: filteredValue });
    } else {
      const parent = keys[0] as keyof Invoice;
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent] as any),
          [keys[1]]: filteredValue,
        },
      });
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      name: "",
      quantity: 1,
      price: 0,
      total: 0,
    };
    setFormData({ ...formData, items: [...(formData.items || []), newItem] });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = (formData.items || []).map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === "quantity" || field === "price") {
          updatedItem.total =
            Number(updatedItem.quantity) * Number(updatedItem.price);
        }
        return updatedItem;
      }
      return item;
    });
    setFormData({ ...formData, items: updatedItems });
  };

  const removeItem = (id: string) => {
    setFormData({
      ...formData,
      items: (formData.items || []).filter((i) => i.id !== id),
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.clientName) newErrors.clientName = "can't be empty";
    if (!formData.clientEmail) {
      newErrors.clientEmail = "can't be empty";
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = "invalid email";
    }
    if (!formData.description) newErrors.description = "can't be empty";
    if (!formData.items || formData.items.length === 0) {
      newErrors.noItems = "An item must be added";
    } else {
      let hasItemError = false;
      formData.items.forEach((item, index) => {
        if (!item.name) newErrors[`item-${index}-name`] = "Required";
        if (item.quantity <= 0) {
          newErrors[`item-${index}-qty`] = "invalid";
          hasItemError = true;
        }
        if (item.price <= 0) {
          newErrors[`item-${index}-price`] = "invalid";
          hasItemError = true;
        }
      });
      if (hasItemError) newErrors.itemValues = "Item quantity and price must be valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (status?: InvoiceStatus) => {
    if (status !== "draft" && !validate()) return;

    const total = (formData.items || []).reduce(
      (acc, item) => acc + item.total,
      0,
    );
    const createdAt =
      formData.createdAt || new Date().toISOString().split("T")[0];
    const dueDate = new Date(createdAt);
    dueDate.setDate(dueDate.getDate() + (formData.paymentTerms || 30));

    const finalInvoice: Invoice = {
      ...(formData as Invoice),
      id: invoiceToEdit ? invoiceToEdit.id : generateId(),
      status: status || formData.status || "pending",
      paymentDue: dueDate.toISOString().split("T")[0],
      total,
    };

    if (invoiceToEdit) {
      dispatch({ type: "UPDATE_INVOICE", payload: finalInvoice });
    } else {
      dispatch({ type: "ADD_INVOICE", payload: finalInvoice });
    }
    onClose();
  };

  const generateId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    let id = "";
    for (let i = 0; i < 2; i++)
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    for (let i = 0; i < 4; i++)
      id += nums.charAt(Math.floor(Math.random() * nums.length));
    return id;
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.formContainer}>
        <h2 className={`${styles.title} heading-m`}>
          {invoiceToEdit ? (
            <>
              Edit <span className={styles.hash}>#</span>{invoiceToEdit.id}
            </>
          ) : (
            "New Invoice"
          )}
        </h2>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <section>
            <h4 className={styles.sectionTitle}>Bill From</h4>
            <div className={styles.field}>
              <label>Street Address</label>
              <input
                type="text"
                maxLength={50}
                value={formData.senderAddress?.street}
                onChange={(e) =>
                  handleInputChange("senderAddress.street", e.target.value)
                }
              />
            </div>
            <div className={styles.grid3}>
              <div className={styles.field}>
                <label>City</label>
                <input
                  type="text"
                  maxLength={30}
                  value={formData.senderAddress?.city}
                  onChange={(e) =>
                    handleInputChange("senderAddress.city", e.target.value)
                  }
                />
              </div>
              <div className={styles.field}>
                <label>Post Code</label>
                <input
                  type="text"
                  maxLength={10}
                  value={formData.senderAddress?.postCode}
                  onChange={(e) =>
                    handleInputChange("senderAddress.postCode", e.target.value)
                  }
                />
              </div>
              <div className={styles.field}>
                <label>Country</label>
                <input
                  type="text"
                  maxLength={30}
                  value={formData.senderAddress?.country}
                  onChange={(e) =>
                    handleInputChange("senderAddress.country", e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          <section>
            <h4 className={styles.sectionTitle}>Bill To</h4>
            <div
              className={`${styles.field} ${errors.clientName ? styles.error : ""}`}
            >
              <div className={styles.labelRow}>
                <label>Client's Name</label>
                {errors.clientName && <span>{errors.clientName}</span>}
              </div>
              <input
                type="text"
                maxLength={50}
                value={formData.clientName}
                onChange={(e) =>
                  handleInputChange("clientName", e.target.value)
                }
              />
            </div>
            <div
              className={`${styles.field} ${errors.clientEmail ? styles.error : ""}`}
            >
              <div className={styles.labelRow}>
                <label>Client's Email</label>
                {errors.clientEmail && <span>{errors.clientEmail}</span>}
              </div>
              <input
                type="email"
                placeholder="e.g. email@example.com"
                value={formData.clientEmail}
                onChange={(e) =>
                  handleInputChange("clientEmail", e.target.value)
                }
              />
            </div>
            <div className={styles.field}>
              <label>Street Address</label>
              <input
                type="text"
                maxLength={50}
                value={formData.clientAddress?.street}
                onChange={(e) =>
                  handleInputChange("clientAddress.street", e.target.value)
                }
              />
            </div>
            <div className={styles.grid3}>
              <div className={styles.field}>
                <label>City</label>
                <input
                  type="text"
                  maxLength={30}
                  value={formData.clientAddress?.city}
                  onChange={(e) =>
                    handleInputChange("clientAddress.city", e.target.value)
                  }
                />
              </div>
              <div className={styles.field}>
                <label>Post Code</label>
                <input
                  type="text"
                  maxLength={10}
                  value={formData.clientAddress?.postCode}
                  onChange={(e) =>
                    handleInputChange("clientAddress.postCode", e.target.value)
                  }
                />
              </div>
              <div className={styles.field}>
                <label>Country</label>
                <input
                  type="text"
                  maxLength={30}
                  value={formData.clientAddress?.country}
                  onChange={(e) =>
                    handleInputChange("clientAddress.country", e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          <section className={styles.grid2}>
            <div className={styles.field}>
              <label>Invoice Date</label>
              <CustomDatePicker
                value={formData.createdAt || ""}
                onChange={(val) => handleInputChange("createdAt", val)}
              />
            </div>
            <div className={styles.field}>
              <label>Payment Terms</label>
              <CustomSelect
                value={formData.paymentTerms || 30}
                onChange={(val) => handleInputChange("paymentTerms", val)}
                options={[
                  { label: "Net 1 Day", value: 1 },
                  { label: "Net 7 Days", value: 7 },
                  { label: "Net 14 Days", value: 14 },
                  { label: "Net 30 Days", value: 30 }
                ]}
              />
            </div>
          </section>

          <div
            className={`${styles.field} ${errors.description ? styles.error : ""}`}
          >
            <div className={styles.labelRow}>
              <label>Project Description</label>
              {errors.description && <span>{errors.description}</span>}
            </div>
            <input
              type="text"
              maxLength={100}
              placeholder="e.g. Graphic Design Service"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          <section className={styles.itemList}>
            <h3 className={styles.itemListTitle}>Item List</h3>
            <div className={styles.itemHeader}>
              <span className={styles.colName}>Item Name</span>
              <span className={styles.colQty}>Qty.</span>
              <span className={styles.colPrice}>Price</span>
              <span className={styles.colTotal}>Total</span>
              <span className={styles.colAction}></span>
            </div>

            {formData.items?.map((item, index) => (
              <div key={item.id} className={styles.itemRow}>
                <div
                  className={`${styles.field} ${errors[`item-${index}-name`] ? styles.error : ""}`}
                >
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      updateItem(item.id, "name", e.target.value)
                    }
                  />
                </div>
                <div
                  className={`${styles.field} ${errors[`item-${index}-qty`] ? styles.error : ""}`}
                >
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, "quantity", Number(e.target.value))
                    }
                  />
                </div>
                <div
                  className={`${styles.field} ${errors[`item-${index}-price`] ? styles.error : ""}`}
                >
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(item.id, "price", Number(e.target.value))
                    }
                  />
                </div>
                <div className={styles.itemTotal}>
                  {(item.total || 0).toFixed(2)}
                </div>
                <button
                  className={styles.deleteItem}
                  onClick={() => removeItem(item.id)}
                >
                  <svg
                    width="13"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H3.194a1.777 1.777 0 01-1.777-1.778V3.556h10.166zM9.25 0a.889.889 0 01.889.889v1.778H2.861V.889A.889.889 0 013.75 0h5.5z"
                      fill="#888EB0"
                      fillRule="nonzero"
                    />
                  </svg>
                </button>
              </div>
            ))}

            <button className="btn btn-light" onClick={addItem}>
              + Add New Item
            </button>
          </section>

          {/* Consolidated error summary */}
          {Object.keys(errors).length > 0 && (
            <div className={styles.errorSummary}>
              {(errors.clientName || errors.clientEmail || errors.description) && (
                <p>- All fields must be added</p>
              )}
              {errors.noItems && <p>- An item must be added</p>}
              {errors.itemValues && <p>- Item values (qty &amp; price) must be valid</p>}
            </div>
          )}
        </form>

        <footer className={styles.footer}>
          {invoiceToEdit ? (
            <div className={styles.editActions}>
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={() => handleSubmit()}>
                Save Changes
              </button>
            </div>
          ) : (
            <div className={styles.createActions}>
              <button className="btn btn-secondary" onClick={onClose}>
                Discard
              </button>
              <div className={styles.createActionRight}>
                <button
                  className="btn btn-dark"
                  onClick={() => handleSubmit("draft")}
                >
                  Save as Draft
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleSubmit("pending")}
                >
                  Save & Send
                </button>
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};

export default InvoiceForm;

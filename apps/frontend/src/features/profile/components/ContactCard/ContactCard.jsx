import React from 'react';
import './ContactCard.css';

function ContactCard({ contact, onEdit, onDelete }) {
  return (
    <div className="contact-card">
      <div className="contact-card-header">
        <h3>{contact.name}</h3>
        <span className="contact-card-phone">{contact.phone_number}</span>
      </div>
      {contact.email && (
        <p className="contact-card-email">{contact.email}</p>
      )}
      <div className="contact-card-actions">
        <button onClick={() => onEdit(contact)} className="btn-edit">
          Edit
        </button>
        <button onClick={() => onDelete(contact.id)} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
}

export default ContactCard;

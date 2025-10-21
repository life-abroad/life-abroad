import React from 'react';
import './AudienceCard.css';

function AudienceCard({ audience, onEdit, onDelete, onViewDetails }) {
  return (
    <div className="audience-card">
      <div className="audience-card-header">
        <h3>{audience.name}</h3>
        <span className="audience-card-id">ID: {audience.id}</span>
      </div>
      
      {audience.contacts && audience.contacts.length > 0 && (
        <div className="audience-contacts-preview">
          <span className="contacts-count">
            {audience.contacts.length} contact{audience.contacts.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      <div className="audience-card-actions">
        <button onClick={() => onEdit(audience)} className="btn-edit">
          Edit
        </button>
        <button onClick={() => onDelete(audience.id)} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
}

export default AudienceCard;

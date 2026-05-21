import React, { useState } from 'react';

const SimpleBookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    teacherId: '',
    learnerId: '',
    skillName: '',
    startTime: '',
    endTime: '',
    format: '',
    virtualMeetingUrl: '',
    location: '',
    price: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Form submitted! Check console for data.');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Simple Session Booking Form (Debug Version)</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Teacher ID:</label>
          <input 
            type="text" 
            name="teacherId" 
            value={formData.teacherId}
            onChange={handleChange}
            placeholder="Enter teacher ID (e.g., 1)"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label>Learner ID:</label>
          <input 
            type="text" 
            name="learnerId" 
            value={formData.learnerId}
            onChange={handleChange}
            placeholder="Enter learner ID (e.g., 2)"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label>Skill Name:</label>
          <input 
            type="text" 
            name="skillName" 
            value={formData.skillName}
            onChange={handleChange}
            placeholder="e.g., Kotlin Programming"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label>Start Time:</label>
          <input 
            type="datetime-local" 
            name="startTime" 
            value={formData.startTime}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label>End Time:</label>
          <input 
            type="datetime-local" 
            name="endTime" 
            value={formData.endTime}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label>Session Format:</label>
          <select 
            name="format" 
            value={formData.format}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="">Select format...</option>
            <option value="ONLINE">Online</option>
            <option value="IN_PERSON">In Person</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        <div>
          <label>
            Virtual Meeting URL 
            {formData.format === 'ONLINE' && <span style={{ color: 'red' }}>*</span>}
          </label>
          <input 
            type="url" 
            name="virtualMeetingUrl" 
            value={formData.virtualMeetingUrl}
            onChange={handleChange}
            placeholder="e.g., https://meet.google.com/abc-def-ghi"
            style={{ width: '100%', padding: '0.5rem' }}
          />
          <small style={{ color: '#666' }}>
            {formData.format === 'ONLINE' ? 'Required for online sessions' : 
             formData.format === 'HYBRID' ? 'Optional for hybrid sessions' : 
             'Select session format to see requirements'}
          </small>
        </div>

        <div>
          <label>
            Location 
            {formData.format === 'IN_PERSON' && <span style={{ color: 'red' }}>*</span>}
          </label>
          <input 
            type="text" 
            name="location" 
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., 123 Main Street, City, State"
            style={{ width: '100%', padding: '0.5rem' }}
          />
          <small style={{ color: '#666' }}>
            {formData.format === 'IN_PERSON' ? 'Required for in-person sessions' : 
             formData.format === 'HYBRID' ? 'Optional for hybrid sessions' : 
             'Select session format to see requirements'}
          </small>
        </div>

        <div>
          <label>Price ($):</label>
          <input 
            type="number" 
            name="price" 
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g., 50.00"
            step="0.01"
            min="0"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            padding: '1rem', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit Form (Debug)
        </button>
      </form>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Current Form Data:</h3>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default SimpleBookingForm;
// src/components/UploadClothingForm.jsx

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

export default function UploadClothingForm({ onAddClothing }) {
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    type: 'T-shirt',
    color: 'black',
    season: 'Winter',
    formality: 'Casual',
    warmth: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
    if (imageFile) payload.append('image', imageFile);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/clothing',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      onAddClothing(res.data);
      setFormData({
        name: '',
        type: 'T-shirt',
        color: 'black',
        season: 'Winter',
        formality: 'Casual',
        warmth: '',
      });
      setImageFile(null);
    } catch (err) {
      // If the server sent a JSON error, this will show it
      if (err.response) {
        console.error('Server responded with:', err.response.status, err.response.data);
        alert(`Upload failed: ${err.response.data.message || err.response.statusText}`);
      } else {
        console.error(err);
        alert('Upload failed: Network or client error.');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: '40px auto',
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >

      <label style={{ display: 'flex', flexDirection: 'column' }}>
        Name
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column' }}>
        Type
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option>T-shirt</option>
          <option>Jacket</option>
          <option>Hoodie</option>
          <option>Jeans</option>
        </select>
      </label>

      <label style={{ display: 'flex', flexDirection: 'column' }}>
        Color
        <select
          name="color"
          value={formData.color}
          onChange={handleChange}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        >
          {[
            'black','white','blue','skyblue','navy','gray','beige',
            'brown','red','maroon','olive','green','sea green','yellow'
          ].map(col => (
            <option key={col} value={col}>
              {col.charAt(0).toUpperCase() + col.slice(1)}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: 'flex', flexDirection: 'column' }}>
        Season
        <select
          name="season"
          value={formData.season}
          onChange={handleChange}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option>Winter</option>
          <option>Summer</option>
          <option>Rain</option>
          <option>Snow</option>
        </select>
      </label>

      <label style={{ display: 'flex', flexDirection: 'column' }}>
        Formality
        <select
          name="formality"
          value={formData.formality}
          onChange={handleChange}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option>Formal</option>
          <option>Casual</option>
        </select>
      </label>

      <label style={{ display: 'flex', flexDirection: 'column' }}>
        Warmth (1–10)
        <input
          type="number"
          name="warmth"
          value={formData.warmth}
          onChange={handleChange}
          min="1"
          max="10"
          required
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column' }}>
        Image (optional)
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginTop: 4 }}
        />
      </label>

      <button
        type="submit"
        style={{
          padding: '12px',
          background: '#5C2A00',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          marginTop: 8
        }}
      >
        Upload
      </button>
    </form>
  );
}

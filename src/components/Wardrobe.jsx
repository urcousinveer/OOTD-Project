// src/components/Wardrobe.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Wardrobe = () => {
  const email = 'ajay@gmail.com'; // hard‑coded for now
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWardrobe = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/clothing/${email}`);
        setItems(res.data);
      } catch (err) {
        console.error('❌ Could not fetch wardrobe:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWardrobe();
  }, []);

  if (loading) return <p>Loading wardrobe…</p>;
  if (!items.length) return <p>No items in your wardrobe yet.</p>;

  return (
    <div>
      <h2>My Wardrobe</h2>
      <div className="wardrobe-grid">
        {items.map(item => (
          <div key={item._id} className="clothing-card">
            {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
            <h3>{item.name}</h3>
            <p>Type: {item.type}</p>
            <p>Color: {item.color}</p>
            <p>Warmth: {item.warmth}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;

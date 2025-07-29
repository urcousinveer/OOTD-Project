import React from "react";

function CategorySection({ items }) {
  if (!items.length) return <div style={{ color: "#aaa" }}>No items yet.</div>;

  return (
    <div style={{ display: "flex", gap: 16 }}>
      {items.map((item, idx) => (
        <div key={idx} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 8, width: 120 }}>
          <img src={item.image} alt="clothing" width={100} style={{ borderRadius: 4 }} />
          <div style={{ fontSize: 12, marginTop: 6 }}>
            <b>{item.description}</b><br />
            <span>Color: {item.color}</span><br />
            <span>Material: {item.material}</span><br />
            <span>Type: {item.type}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CategorySection;
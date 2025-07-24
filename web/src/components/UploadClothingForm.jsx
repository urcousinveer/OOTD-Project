import React, { useRef, useState } from "react";

const categoryOptions = ["T-Shirts", "Jeans", "Jackets", "Hoodies"];

function UploadClothingForm({ onAddClothing }) {
  const fileInput = useRef();
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fileInput.current.files[0]) return alert("Please select an image!");

    onAddClothing(category, {
      image: previewUrl,
      description,
      color,
      material,
      type,
    });

    setDescription(""); setColor(""); setMaterial(""); setType("");
    setPreviewUrl(""); fileInput.current.value = "";
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        onChange={handleFileChange}
        style={{ marginBottom: 10 }}
      />
      {previewUrl && <img src={previewUrl} alt="Preview" width={100} style={{ display: "block", marginBottom: 10 }} />}
      <div>
        <label>Category: </label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div>
        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ marginTop: 6 }}
        />
      </div>
      <div>
        <input
          placeholder="Color"
          value={color}
          onChange={e => setColor(e.target.value)}
          style={{ marginTop: 6 }}
        />
      </div>
      <div>
        <input
          placeholder="Material"
          value={material}
          onChange={e => setMaterial(e.target.value)}
          style={{ marginTop: 6 }}
        />
      </div>
      <div>
        <input
          placeholder="Type"
          value={type}
          onChange={e => setType(e.target.value)}
          style={{ marginTop: 6 }}
        />
      </div>
      <button type="submit" style={{ marginTop: 10 }}>Add Clothing</button>
    </form>
  );
}

export default UploadClothingForm;

// src/components/UploadClothingForm.jsx
import React, { useState } from "react";
import axios from "axios";

const UploadClothingForm = () => {
  //  Include `email` in your form state
  const [formData, setFormData] = useState({
    email: "ajay@gmail.com",    // ← hard‑coded for now
    name: "",
    type: "",
    color: "",
    season: "",
    formality: "",
    warmth: "",
    imageUrl: ""
  });

  //  Update state on each input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  //  Send entire formData (including email) to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/clothing", formData);
      alert("✅ Clothing item uploaded!");
      console.log(res.data);
      //  Reset everything _except_ email so it's still there next time
      setFormData((prev) => ({
        email: prev.email,
        name: "",
        type: "",
        color: "",
        season: "",
        formality: "",
        warmth: "",
        imageUrl: ""
      }));
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("Upload failed. Check console.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upload Clothing Item</h2>

      {/* email is hidden from user, but keep it in state */}
      <input type="hidden" name="email" value={formData.email} />

      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="type"
        placeholder="Type (e.g. shirt, jacket)"
        value={formData.type}
        onChange={handleChange}
        required
      />
      <input
        name="color"
        placeholder="Color"
        value={formData.color}
        onChange={handleChange}
      />
      <input
        name="season"
        placeholder="Season (e.g. summer)"
        value={formData.season}
        onChange={handleChange}
      />
      <input
        name="formality"
        placeholder="Formality (e.g. casual)"
        value={formData.formality}
        onChange={handleChange}
      />
      <input
        name="warmth"
        type="number"
        placeholder="Warmth (1-10)"
        value={formData.warmth}
        onChange={handleChange}
      />
      <input
        name="imageUrl"
        placeholder="Image URL (optional)"
        value={formData.imageUrl}
        onChange={handleChange}
      />

      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadClothingForm;

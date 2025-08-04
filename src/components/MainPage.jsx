// src/components/MainPage.jsx
import React from "react";
import UploadClothingForm from "./UploadClothingForm";
import "./MainPage.css";              // ← import your new styles

export default function MainPage({ onAddClothing }) {
  return (
    <div className="upload-form-card">
      <h2 className="upload-form-title">Upload Clothing Item</h2>
      <UploadClothingForm onAddClothing={onAddClothing} />
    </div>
  );
}

import React from "react";
import UploadClothingForm from "./UploadClothingForm";
import CategorySection from "./CategorySection";

const categories = ["T-Shirts", "Jeans", "Jackets", "Hoodies"];

function MainPage({ clothes, onAddClothing }) {
  return (
    <div style={{ maxWidth: 600, margin: "30px auto", padding: 20 }}>
      <h2>Upload Clothing Item</h2>
      <UploadClothingForm onAddClothing={onAddClothing} />

      {categories.map((cat) => (
        <div key={cat} style={{ marginTop: 30 }}>
          <h3>{cat}</h3>
          <CategorySection items={clothes[cat]} />
        </div>
      ))}
    </div>
  );
}

export default MainPage;
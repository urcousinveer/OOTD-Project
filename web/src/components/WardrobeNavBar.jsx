import React from "react";

const navItems = [
  {
    name: "T-Shirts",
    image: "https://img.icons8.com/color/48/t-shirt.png",
  },
  {
    name: "Jeans",
    image: "https://img.icons8.com/color/48/jeans.png",
  },
  {
    name: "Jackets",
    image: "https://img.icons8.com/color/48/jacket.png",
  },
  {
    name: "Hoodies",
    image: "https://img.icons8.com/color/48/sweater.png",
  },
];

function WardrobeNavBar({ selected, onCategorySelect }) {
  return (
    <nav className="wardrobe-nav">
      {navItems.map((item) => (
        <button
          key={item.name}
          className={`wardrobe-nav-btn${selected === item.name ? " selected" : ""}`}
          onClick={() => onCategorySelect(item.name)}
        >
          <img src={item.image} alt={item.name} />
          <span>{item.name}</span>
        </button>
      ))}
    </nav>
  );
}

export default WardrobeNavBar;

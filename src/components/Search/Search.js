import React from "react";
import "./Search.css";

export const Search = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={
        theme === "dark" ? "search-container-dark" : "search-container"
      }
    >
      <input type="text" class="search-input" placeholder="Buscar..." />
    </div>
  );
};

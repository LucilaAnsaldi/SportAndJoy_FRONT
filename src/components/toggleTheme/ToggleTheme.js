import React, { useContext } from "react";
import { ThemeContext } from "../../services/theme.context";
import { Form } from "react-router-dom";
import "./ToggleTheme.css";

const ToggleTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const themeAddLocalStorage = () => {
    // Guardar el tema actual en el localStorage
    localStorage.setItem("theme", theme);
  };

  return (
    <>
      <p> Cambiar a tema {theme === "light" ? "oscuro" : "claro"}</p>
      <label className="theme-switch">
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={() => {
            toggleTheme(); // Cambiar el tema
            themeAddLocalStorage(); // Guardar el tema en el localStorage después de cambiarlo
          }}
        />
        <span className="slider round"></span>
      </label>
    </>
  );
};

export default ToggleTheme;
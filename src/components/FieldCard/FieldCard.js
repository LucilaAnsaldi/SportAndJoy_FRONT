import React, { useContext, useEffect, useState } from "react";
import "./FieldCard.css";
import { ThemeContext } from "../../services/theme.context";

const FieldCard = ({ field, onCardClick }) => {
  const handleCardClick = () => {
    onCardClick(field);
  };
  let sport = "";
  if (field.sport === 0) {
    sport = "Fútbol";
  } else if (field.sport === 1) {
    sport = "Vóley";
  } else if (field.sport === 2) {
    sport = "Tenis";
  }
  const { theme } = useContext(ThemeContext);

  const role = localStorage.getItem("role");

  return (
    <div
      className={theme === "dark" ? "tarjeta-dark" : "tarjeta"}
      onClick={handleCardClick}
    >
      <img className="imagen-field" src={field.image} alt={field.name} />
      <div className="info-field">
        <h2 className={theme === "dark" ? "field-name-dark" : "field-name"}>
          {field.name}
        </h2>
        <p className="deporte">{sport}</p>
        <p className={theme === "dark" ? "ubicacion-dark" : "ubicacion"}>
          {field.location}
        </p>
        <p className={theme === "dark" ? "precio-dark" : "precio"}>
          {" "}
          $ {field.price}
        </p>
        {role === "ADMIN" && (
          <p className={theme === "dark" ? "ubicacion-dark" : "ubicacion"}>
            Id de Propietario: {field.userId}
          </p>
        )}
      </div>
    </div>
  );
};

export default FieldCard;

import React, { useContext } from "react";
import "./ReservationCard.css";
import { ThemeContext } from "../../services/theme.context";

const ReservationCard = ({ reservation }) => {
  const { theme } = useContext(ThemeContext);
  console.log("User prop en ReservationCard:", reservation);
  return (
    <div
      className={
        theme === "dark" ? "reservation-card-dark" : "reservation-card"
      }
    >
      <div className="reservation-details">
        <h3>Cancha: {reservation.field.name}</h3>
        <p>Ubicacion:{reservation.field.location}</p>
        <p>Del dia: {reservation.date}</p>
      </div>
      <button className="cancel-button">Cancelar</button>
    </div>
  );
};

export default ReservationCard;

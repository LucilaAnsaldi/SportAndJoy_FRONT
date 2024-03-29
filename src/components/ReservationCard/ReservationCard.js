import React, { useContext, useState } from "react";
import "./ReservationCard.css";
import { RoleContext } from "../../services/role.context";
import API_URL from "../../constants/api";
import { ThemeContext } from "../../services/theme.context";


const ReservationCard = ({ reservation }) => {
  const { theme } = useContext(ThemeContext);
  console.log("User prop en ReservationCard:", reservation);
  const { role } = useContext(RoleContext);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);


  const handleCancel = () => {
    // Mostrar el modal de confirmación
    setShowConfirmation(true);
  };


  const handleConfirmCancel = () => {
    const token = localStorage.getItem("token");


    if (!token) {
      console.error("Token no encontrado.");
      return;
    }


    try {
      console.log(reservation.id);


      const endpoint =
        role === "ADMIN"
          ? `${reservation.id}/delete-admin`
          : `${reservation.id}/delete`;


      fetch(`${API_URL}/api/Reservation/${endpoint}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            // Actualiza el estado para marcar la tarjeta como eliminada
            setIsDeleted(true);
            console.log("Reserva cancelada con éxito");
          } else {
            console.error("Error al cancelar reserva");
          }
        })
        .catch((error) => console.error("Error de red", error));
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  };


  // Si la reserva ha sido eliminada, no renderiza la tarjeta
  if (isDeleted) {
    return null;
  }


  return (
    <div
      className={
        theme === "dark" ? "reservation-card-dark" : "reservation-card"
      }
    >
      <div className="reservation-details">
        <h3>Cancha: {reservation.field?.name || "Nombre no disponible"}</h3>
        <p>
          Ubicacion: {reservation.field?.location || "Ubicación no disponible"}
        </p>
        <p>Fecha: {reservation.date?.slice(0, 10) || "Fecha no disponible"}</p>
        <p>
          Usuario: {reservation.user?.firstName} {reservation.user?.lastName}
        </p>
      </div>
      {(role === "ADMIN" || role === "PLAYER") && (
        <button onClick={handleCancel} className="cancel-button">
          Cancelar
        </button>
      )}


      {showConfirmation && (
        <div className="modal">
          <div
            className={
              theme === "dark" ? "modal-content-dark" : "modal-content"
            }
          >
            <p>¿Está seguro que desea cancelar su reserva?</p>
            <button
              className={
                theme === "dark" ? "confirmButton-dark" : "confirmButton"
              }
              onClick={handleConfirmCancel}
            >
              Sí
            </button>
            <button
              className={
                theme === "dark" ? "cancelButton-dark" : "cancelButton"
              }
              onClick={() => setShowConfirmation(false)}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default ReservationCard;

import React, { useContext, useState } from "react";
import "./UsersCard.css";
import avatarImage from "../../assets/images/default_avatar.jpg";
import API_URL from "../../constants/api";
import { ThemeContext } from "../../services/theme.context";

const UsersCard = ({ user, onDeleteUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const imageUrl = user.image ? user.image : avatarImage;
  let roleText;
  if (user.role === 0) {
    roleText = "System Admin";
  } else if (user.role === 1) {
    roleText = "Propietario de cancha";
  } else if (user.role === 2) {
    roleText = "Jugador";
  } else {
    roleText = "Rol desconocido";
  }

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    onDeleteUser(user.id);
    setShowConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser({ ...user });
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/User/${user.id}/edit-admin`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedUser),
        }
      );
      if (response.ok) {
        setIsEditing(false);
      } else {
        console.log("Error al editar usuario:", await response.text());
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const { theme } = useContext(ThemeContext);

  return (
    <div className={theme === "dark" ? "users-card-dark" : "users-card"}>
      <div className="users-details">
        <img className="userpic" src={imageUrl} alt="foto del usuario" />
        <h3>
          {isEditing ? (
            <>
              <input
                type="text"
                name="firstName"
                value={editedUser.firstName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="lastName"
                value={editedUser.lastName}
                onChange={handleInputChange}
              />
            </>
          ) : (
            `${user.firstName} ${user.lastName}`
          )}
        </h3>

        <p className="email">
          {isEditing ? (
            <input
              type="text"
              name="email"
              value={editedUser.email}
              onChange={handleInputChange}
            />
          ) : (
            user.email
          )}
        </p>
        <p className="p">
          {isEditing ? (
            <select
              name="role"
              value={editedUser.role}
              onChange={handleInputChange}
            >
              <option value={0}>System Admin</option>
              <option value={1}>Propietario de cancha</option>
              <option value={2}>Jugador</option>
            </select>
          ) : (
            roleText
          )}
        </p>
        <p className="p">Id: {user.id}</p>
      </div>
      <div id="buttons">
        {isEditing ? (
          <>
            <button className="edit-button" onClick={handleSaveEdit}>
              Guardar
            </button>
            <button className="cancel-button" onClick={handleCancelEdit}>
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button className="edit-button" onClick={handleEditClick}>
              Editar
            </button>
            <button className="delete-button" onClick={handleDeleteClick}>
              Eliminar
            </button>
            {showConfirmation && (
              <div className="modal">
                <div
                  className={
                    theme === "dark" ? "modal-content-dark" : "modal-content"
                  }
                >
                  <p>¿Seguro que quieres eliminar este usuario?</p>
                  <button
                    className={
                      theme === "dark" ? "confirmButton-dark" : "confirmButton"
                    }
                    onClick={handleConfirmDelete}
                  >
                    Sí
                  </button>
                  <button
                    className={
                      theme === "dark" ? "cancelButton-dark" : "cancelButton"
                    }
                    onClick={handleCancelDelete}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersCard;

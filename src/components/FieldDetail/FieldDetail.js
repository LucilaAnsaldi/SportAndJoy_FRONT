import React, { useContext, useEffect, useState } from "react";
import "./FieldDetail.css";
import { Header } from "../Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import { RoleContext } from "../../services/role.context";
import API_URL from "../../constants/api";
import { jwtDecode } from "jwt-decode";
import { ThemeContext } from "../../services/theme.context";

const FieldDetail = (props) => {
  const { name, location, image, description, sport, lockerRoom, bar, price } =
    props;

  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useContext(RoleContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedSport, setEditedSport] = useState("");
  const [editedLockerRoom, setEditedLockerRoom] = useState("");
  const [editedBar, setEditedBar] = useState("");
  const [editedPrice, setEditedPrice] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [fieldData, setField] = useState({});

  // RESERVA

  const handleReserveClick = () => {
    setShowConfirmation(true);
  };

  // Crear reserva POST

  const handleConfirmReservation = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/Reservation/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Date: new Date().toISOString(),
          FieldId: id,
          // Otros datos necesarios para la reserva
        }),
      });

      if (response.ok) {
        console.log("Reserva exitosa");
      } else {
        console.error("Error al realizar la reserva");
      }

      setShowConfirmation(false);
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
    }
  };

  const handleCancelReservation = () => {
    setShowConfirmation(false);
  };


  // EDITAR

  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Editar cancha PUT

  const handleSaveClick = () => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/Field/${id}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: id,
        name: editedName,
        location: editedLocation,
        image: editedImage,
        description: editedDescription,
        lockerRoom: editedLockerRoom,
        bar: editedBar,
        price: editedPrice,
        sport: editedSport
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(
              `HTTP error! Status: ${response.status}, Message: ${error}`
            );
          });
        }
        if (response.status === 204) {
          console.log("Edición exitosa");
          setIsEditing(false);
        }
        return response.json();
      })
      .then((updatedFieldData) => {
        setIsEditing(false);
        setField(updatedFieldData);
      })
      .catch((error) => {
        console.error("Error updating field data:", error.message);
      });
  };

  const handleInputChange = (e) => {
    if (e.target.name === "name") {
      setEditedName(e.target.value);
    } else if (e.target.name === "location") {
      setEditedLocation(e.target.value);
    } else if (e.target.name === "image") {
      setEditedImage(e.target.value);
    } else if (e.target.name === "description") {
      setEditedDescription(e.target.value);
    } else if (e.target.name === "sport") {
      setEditedSport(e.target.value);
    } else if (e.target.name === "lockerRoom") {
      setEditedLockerRoom(e.target.value);
    } else if (e.target.name === "bar") {
      setEditedBar(e.target.value);
    } else if (e.target.name === "price") {
      setEditedPrice(e.target.value); }
  };

  const buttonCancelEdit = () => {
    setIsEditing(false);
  };


  // Traer Cancha GET

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/api/Field/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((fieldData) => {
        console.log("Datos de la cancha:", fieldData);
        setEditedName(fieldData.name);
        setEditedLocation(fieldData.location);
        setEditedImage(fieldData.image);
        setEditedDescription(fieldData.description);
        setEditedSport(fieldData.sport);
        setEditedLockerRoom(fieldData.lockerRoom);
        setEditedBar(fieldData.bar);
        setEditedPrice(fieldData.price);
        setField(fieldData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  let sportName = "";
  if (fieldData.sport === 0) {
    sportName = "Fútbol";
  } else if (fieldData.sport === 1) {
    sportName = "Vóley";
  } else if (fieldData.sport === 2) {
    sportName = "Tenis";
  }

  const { theme } = useContext(ThemeContext);
  return (
    <>
      <Header />

      <div
        className={
          theme === "dark"
            ? "field-detail-dark field-card"
            : "field-detail field-card"
        }
      >
        <img src={image} alt={name} className="field-image" />
        <div className="field-info">
          <h2> {editedName}</h2>
          {isEditing ? (
            <div>
              <label>Cambia tu foto de perfil:</label>
              <input
                type="text"
                name="image"
                value={editedImage}
                onChange={handleInputChange}
              />
              <label>Ubicación:</label>
              <input
                type="text"
                name="location"
                value={editedLocation}
                onChange={handleInputChange}
              />
              <label>Descripción:</label>
              <input
                type="text"
                name="description"
                value={editedDescription}
                onChange={handleInputChange}
              />
              <label>Deporte:</label>
              <input
                type="text"
                name="sport"
                value={editedSport}
                onChange={handleInputChange}
              />
              <label>Vestuarios:</label>
              <input
                type="text"
                name="lockerRoom"
                value={editedLockerRoom}
                onChange={handleInputChange}
              />
              <label>Bar:</label>
              <input
                type="text"
                name="bar"
                value={editedBar}
                onChange={handleInputChange}
              />
              <label>Precio:</label>
              <input
                type="text"
                name="price"
                value={editedPrice}
                onChange={handleInputChange}
              />
              <button onClick={handleSaveClick}>Guardar</button>
              <button onClick={buttonCancelEdit}>Cancelar</button>
            </div>
          ) : (
            <div>
              <img src={editedImage} alt={editedName} className="field-image" />
              <p>
                <strong>Ubicación: </strong> {editedLocation}
              </p>
              <p>
                <strong>Descripción: </strong> {editedDescription}
              </p>
              <p>
                <strong>Deporte: </strong> {sportName}
              </p>
              <p>
                <strong>Vestuarios: </strong> {editedLockerRoom ? "Sí" : "No"}
              </p>
              <p>
                <strong>Bar: </strong> {editedBar ? "Sí" : "No"}
              </p>
              <p>
                <strong>Precio: </strong> $ {editedPrice}
              </p>
              { (role === "OWNER" || role === "ADMIN") && (
                  <button className="edit-button" onClick={handleEditClick}>
                    Editar
                  </button>
                )}
              { (role === "OWNER" || role === "ADMIN") && (
                <button className="delete-button" onClick={handleEditClick}>
                  Eliminar
                </button>
              )}
              {role === "PLAYER" && (
                <button className="reserve-button" onClick={handleReserveClick}>
                  Reservar
                </button>
              )}
              {showConfirmation && (
                <div className="popup">
                  <p>¿Seguro que desea reservar?</p>
                  <button onClick={handleConfirmReservation}>Sí</button>
                  <button onClick={handleCancelReservation}>No</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FieldDetail;

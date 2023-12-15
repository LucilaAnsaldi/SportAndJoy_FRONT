import React, { useContext, useEffect, useState } from "react";
import "./FieldDetail.css";
import { Header } from "../Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import { RoleContext } from "../../services/role.context";
import API_URL from "../../constants/api";
import { jwtDecode } from "jwt-decode";
import { ThemeContext } from "../../services/theme.context";

const FieldDetail = (props) => {
  const {
    name,
    location,
    image,
    description,
    sport,
    lockerRoom,
    bar,
    price,
    userId,
  } = props;

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
  const [editedUserId, setEditedUserId] = useState("");

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [fieldData, setField] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservationError, setReservationError] = useState(null);

  const [isNameValid, setIsNameValid] = useState(true);
  const [isLocationValid, setIsLocationValid] = useState(true);
  const [isSportValid, setIsSportValid] = useState(true);
  const [isPriceValid, setIsPriceValid] = useState(true);

  useEffect(() => {
    setIsNameValid(true);
    setIsLocationValid(true);
    setIsSportValid(true);
    setIsPriceValid(true);
  }, []);


  


  const handleReserveClick = () => {
    setShowConfirmation(true);
  };

  const handleDeleteField = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDeleteField = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/Field/${id}/delete-admin`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Manejar la eliminación exitosa según sea necesario
        console.log("Campo eliminado exitosamente");
        // Redirigir a la página principal u otro lugar
        navigate("/allFields");
      } else {
        console.error("Error al eliminar el campo:", await response.text());
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleCancelDeleteField = () => {
    setShowDeleteConfirmation(false);
  };

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
          // Date: new Date().toISOString(),
          date: selectedDate.toISOString(),
          FieldId: id,
          // Otros datos necesarios para la reserva
        }),
      });

      if (response.ok) {
        console.log("Reserva exitosa");
        navigate("/dashboard");
      } else if (response.status === 400) {
      const errorMessage = await response.text();
      console.error("Error al realizar la reserva:", errorMessage);
      setReservationError(errorMessage);
    } else {
      console.error("Error al realizar la reserva:", response.statusText);
      setReservationError("Error desconocido al realizar la reserva.");
    }

    setShowConfirmation(false);
  } catch (error) {
    console.error("Error al realizar la reserva:", error);
    setReservationError("Error desconocido al realizar la reserva.");
  }
  };

  const navitateDashboard = () => {
    if (role === "ADMIN") {
      navigate("/allFields");
    } else {
      navigate("/dashboard");
    }
  };

  const handleCancelReservation = () => {
    setShowConfirmation(false);
  };

  // EDITAR

  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Editar cancha PUT OWNER

  const handleSaveClickOwner = () => {

    // Validaciones
    if (!isNameValid || !isLocationValid || !isSportValid || !isPriceValid) {
      // No permite guardar si alguna validación falla
      return;
    }

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
        sport: editedSport,
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

  // Editar cancha PUT ADMIN

  const handleSaveClickAdmin = () => {

    // Validaciones
    if (!isNameValid || !isLocationValid || !isSportValid || !isPriceValid) {
      // No permite guardar si alguna validación falla
      return;
    }

    const token = localStorage.getItem("token");

    fetch(`${API_URL}/api/Field/${id}/edit-admin`, {
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
        sport: editedSport,
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
          console.log("respuestaaaaa", response);
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

  const handleInputChangeOwner = (e) => {
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
      setEditedPrice(e.target.value);
    }

    const { name, value } = e.target;

    // Validaciones adicionales
    if (name === "name") {
      setIsNameValid(value.trim() !== "" || !isEditing);
    } else if (name === "location") {
      setIsLocationValid(value.trim() !== "" || !isEditing);
    } else if (name === "sport") {
      setIsSportValid(value !== "" || !isEditing);
    } else if (name === "price") {
      setIsPriceValid(Number(value) > 0 || !isEditing);
    }


  };

  const handleInputChangeAdmin = (e) => {
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
      setEditedPrice(e.target.value);
    } else if (e.target.name === "userId") {
      setEditedUserId(e.target.value);
    }

    const { name, value } = e.target;

    // Validaciones adicionales
    if (name === "name") {
      setIsNameValid(value.trim() !== "" || !isEditing);
    } else if (name === "location") {
      setIsLocationValid(value.trim() !== "" || !isEditing);
    } else if (name === "sport") {
      setIsSportValid(value !== "" || !isEditing);
    } else if (name === "price") {
      setIsPriceValid(Number(value) > 0 || !isEditing);
    }
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
        setEditedUserId(fieldData.userId);
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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "lockerRoom") {
      setEditedLockerRoom(checked);
    } else if (name === "bar") {
      setEditedBar(checked);
    }
  };

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

          {isEditing && role === "OWNER" && (
            <div>
              <label>Imagen de la cancha:</label>
              <input
                type="text"
                name="image"
                value={editedImage}
                onChange={handleInputChangeOwner}
              />
              <label>Nombre:</label>
              <input
                type="text"
                name="name"
                value={editedName}
                onChange={handleInputChangeOwner}
                style={{ borderColor: isNameValid ? "" : "red" }}
              />
              {!isNameValid && <p style={{ color: "red" }}>Ingrese el nombre</p>}


              <label>Ubicación:</label>
              <input
                type="text"
                name="location"
                value={editedLocation}
                onChange={handleInputChangeOwner}
                style={{ borderColor: isLocationValid ? "" : "red" }}
              />
              {!isLocationValid && <p style={{ color: "red" }}>Ingrese la ubicación</p>}

              <label>Descripción:</label>
              <input
                type="text"
                name="description"
                value={editedDescription}
                onChange={handleInputChangeOwner}
              />

              <label>Deporte:</label>
              <select
                name="sport"
                value={editedSport}
                onChange={handleInputChangeOwner}
                style={{ borderColor: isSportValid ? "" : "red" }}
              >
                <option value="">Seleccionar Deporte</option>
                <option value="0">Fútbol</option>
                <option value="1">Vóley</option>
                <option value="2">Tenis</option>
              </select>
              {!isSportValid && (
              <div style={{ color: "red", marginTop: "5px" }}>
                Seleccione un deporte.
              </div>
            )}

              <label>Vestuarios:</label>
              <input
                type="checkbox"
                name="lockerRoom"
                checked={editedLockerRoom}
                onChange={handleCheckboxChange}
              />

              <label>Bar:</label>
              <input
                type="checkbox"
                name="bar"
                checked={editedBar}
                onChange={handleCheckboxChange}
              />

              <label>Precio:</label>
              <input
                type="text"
                name="price"
                value={editedPrice}
                onChange={handleInputChangeOwner}
                style={{
                  borderColor: !isPriceValid ? "red" : "",
                }}
              />
              {!isPriceValid && (
              <div style={{ color: "red", marginTop: "5px" }}>
                Ingrese un precio válido.
              </div>
            )}
              <div className="botones">
                <button className="boton-verde" onClick={handleSaveClickOwner}>
                  Guardar
                </button>
                <button className="cancelar" onClick={buttonCancelEdit}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {isEditing && role === "ADMIN" && (
            <div>
              <label>Imagen de la cancha:</label>
              <input
                type="text"
                name="image"
                value={editedImage}
                onChange={handleInputChangeAdmin}
              />
              <label>Nombre:</label>
              <input
                type="text"
                name="name"
                value={editedName}
                onChange={handleInputChangeAdmin}
                style={{ borderColor: isNameValid ? "" : "red" }}
              />
              {!isNameValid && <p style={{ color: "red" }}>Ingrese el nombre</p>}

              <label>Ubicación:</label>
              <input
                type="text"
                name="location"
                value={editedLocation}
                onChange={handleInputChangeAdmin}
                style={{ borderColor: isLocationValid ? "" : "red" }}
              />
              {!isLocationValid && <p style={{ color: "red" }}>Ingrese la ubicación</p>}

              <label>Descripción:</label>
              <input
                type="text"
                name="description"
                value={editedDescription}
                onChange={handleInputChangeAdmin}
              />

              <label>Deporte:</label>
              <select
                name="sport"
                value={editedSport}
                onChange={handleInputChangeAdmin}
                style={{ borderColor: isSportValid ? "" : "red" }}
              >
                <option value="">Seleccionar Deporte</option>
                <option value="0">Fútbol</option>
                <option value="1">Vóley</option>
                <option value="2">Tenis</option>
              </select>
              {!isSportValid && (
              <div style={{ color: "red", marginTop: "5px" }}>
                Seleccione un deporte.
              </div>
            )}

              <label>Vestuarios:</label>
              <input
                type="checkbox"
                name="lockerRoom"
                checked={editedLockerRoom}
                onChange={handleCheckboxChange}
              />

              <label>Bar:</label>
              <input
                type="checkbox"
                name="bar"
                checked={editedBar}
                onChange={handleCheckboxChange}
              />

              <label>Precio:</label>
              <input
                type="text"
                name="price"
                value={editedPrice}
                onChange={handleInputChangeAdmin}
                style={{
                  borderColor: !isPriceValid ? "red" : "",
                }}
              />
               {!isPriceValid && (
              <div style={{ color: "red", marginTop: "5px" }}>
                Ingrese un precio válido.
              </div>
            )}
              <div className="botones">
                <button className="boton-verde" onClick={handleSaveClickAdmin}>
                  Guardar
                </button>
                <button className="cancelar" onClick={buttonCancelEdit}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {!isEditing && (
            <div>
              <img src={editedImage} className="field-image" />
              <p>
                <strong>Nombre: </strong> 
                {" "}
              <span style={{ borderColor: isNameValid ? "" : "red" }}></span>{editedName}
              </p>
              <p>
                <strong>Ubicación: </strong> {" "}
              <span style={{ borderColor: isLocationValid ? "" : "red" }}></span> {editedLocation}
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
              {role === "ADMIN" && (
                <p>
                  <strong>Id de propietario: </strong> {editedUserId}
                </p>
              )}
              <button className="atras" onClick={navitateDashboard}>
                Atrás
              </button>
              {(role === "OWNER" || role === "ADMIN") && (
                <button className="editar" onClick={handleEditClick}>
                  Editar
                </button>
              )}
              {role === "ADMIN" && (
                <button className="delete-button" onClick={handleDeleteField}>
                  Eliminar
                </button>
              )}
              {showDeleteConfirmation && (
                <div className={theme === "dark" ? "popup-dark" : "popup"}>
                  <p>¿Seguro que quieres eliminar?</p>
                  <button onClick={handleConfirmDeleteField}>Sí</button>
                  <button onClick={handleCancelDeleteField}>No</button>
                </div>
              )}
              {role === "PLAYER" && (
                <button className="reserve-button" onClick={handleReserveClick}>
                  Reservar
                </button>
              )}
              {showConfirmation && (
                <div className={theme === "dark" ? "popup-dark" : "popup"}>
                  <p>Seleccione la fecha de reserva de su cancha:</p>
                  <div className="calendar-container">
                    <label htmlFor="date">Fecha:</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={selectedDate.toISOString().split("T")[0]}
                      onChange={(e) =>
                        setSelectedDate(new Date(e.target.value))
                      }
                    />
                  </div>
                  {selectedDate < new Date() &&(
                    <p>Podés seleccionar una fecha a partir de hoy</p>
                  )}
                  <div className="button-container">
                    <button className= "accept" onClick={handleConfirmReservation}
                      disabled={selectedDate < new Date()}>
                      Aceptar</button>
                    <button onClick={handleCancelReservation}>Cancelar</button>
                  </div>
                </div>
              )}
                {reservationError && (
                <div className="popup-container">
                  <div className={`popup ${theme === "dark" ? "popup-dark" : ""} custom-popup`}>
                    <p>Oops! Hay un problema ...</p>
                    <p>{reservationError}</p>
                    <button onClick={() => setReservationError(null)}>Cerrar</button>
                  </div>
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

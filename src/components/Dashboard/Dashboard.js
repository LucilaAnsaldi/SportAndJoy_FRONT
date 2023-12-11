import React, { useContext, useEffect, useState } from "react";
import "./Dashboard.css";
import FieldCard from "../FieldCard/FieldCard";
import { Header } from "../Header/Header";
import { Search } from "../Search/Search";
import { Filter } from "../Filter/Filter";
import { useNavigate } from "react-router-dom";
import ToggleTheme from "../toggleTheme/ToggleTheme";
import API_URL from "../../constants/api";
import { RoleContext } from "../../services/role.context";
import { ThemeContext } from "../../services/theme.context";

const Dashboard = () => {
  const [fields, setFields] = useState([]);
  const [allFields, setAllFields] = useState([]);
  const [selectedfield, setSelectedfield] = useState(null);
  const { role } = useContext(RoleContext);
  const [showAddFieldPopup, setShowAddFieldPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newField, setNewField] = useState({
    image: null,
    name: "",
    location: "",
    description: "",
    sport: "",
    lockerRoom: "",
    bar: "",
    price: "",
  });

  const handleAddFieldClick = () => {
    setShowAddFieldPopup(true);
  };

  const handleAddFieldChange = (e) => {
    const { name, value } = e.target;
    setNewField((prevField) => ({ ...prevField, [name]: value }));
  };

  //POST FIELD 

  const handleAddFieldSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("token");
  
      // Asegúrate de que el campo 'sport' tenga un valor seleccionado
      if (!newField.sport) {
        console.error("Seleccione un deporte antes de enviar la solicitud.");
        return;
      }
  
      // Asegúrate de que el campo 'Name' tenga un valor
      if (!newField.name) {
        console.error("Ingrese un nombre antes de enviar la solicitud.");
        return;
      }
  
      const response = await fetch(`${API_URL}/api/Field/create-admin?IdUser=${selectedUserId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Name: newField.name,
          Location: newField.location,
          Image: newField.image,
          Description: newField.description,
          LockerRoom: newField.lockerRoom ? 1 : 0, // Convertir a número
          Bar: newField.bar ? 1 : 0, // Convertir a número
          Price: newField.price,
          Sport: parseInt(newField.sport), // Asegúrate de que el valor sea un entero
        }),
      });
  
      if (response.ok) {
        const createdField = await response.json();
        setFields((prevFields) => [...prevFields, createdField]);
        setShowAddFieldPopup(false);
      } else {
        console.log("Error al crear cancha:", await response.text());
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
    console.log("ESTE OWNER",selectedUserId)
    console.log(newField.bar)
    console.log(newField.lockerRoom) //no lee esto
  };
  
  

  ///////GET ALL FIELDS para player y para owner
  const endpoint =
    role === "PLAYER" || role === "ADMIN"
      ? "/api/Field/getall"
      : "/api/Field/get/myfields";

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}${endpoint}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((fieldData) => {
        const fieldsMapped = fieldData.map((field) => ({
          ...field,
        }));
        setAllFields(fieldsMapped);
        setFields(fieldsMapped);
        console.log("Canchas cargadas:", fieldsMapped);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [role]);

  const navigate = useNavigate();

  const handleCardClick = (field) => {
    setSelectedfield(field);
    navigate(`/fieldDetail/${field.id}`);
  };

  const handleApplyFilters = (
    deporte,
    bar,
    vestuario,
    precioMin,
    precioMax
  ) => {
    console.log("handleApplyFilters está siendo ejecutada");
    console.log(
      "Filtros aplicados:",
      deporte,
      bar,
      vestuario,
      precioMin,
      precioMax
    );
    const filteredFields = allFields.filter((field) => {
      const deporteFilter = !deporte || field.sport === parseInt(deporte);
      const barFilter = bar === undefined || field.bar === bar;
      const vestuarioFilter =
        vestuario === undefined || field.lockerRoom === vestuario;
      const precioFilter =
        (!precioMin || field.price >= parseFloat(precioMin)) &&
        (!precioMax || field.price <= parseFloat(precioMax));

      return deporteFilter && barFilter && vestuarioFilter && precioFilter;
    });

    console.log("Canchas filtradas:", filteredFields);
    setFields(filteredFields);
  };
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <Header />
      <div
        className={`dashboard-container ${
          role === "ADMIN" || role === "OWNER" ? "admin-owner" : "player"
        }`}
      >
        {role !== "ADMIN" && role !== "OWNER" && (
          <Filter onApplyFilters={handleApplyFilters} />
        )}
        <div
          className={`dashboard-right ${
            role === "ADMIN" || role === "OWNER" ? "admin-owner" : "player"
          }`}
        >
          {(role === "ADMIN" || role === "OWNER") && (
            <>
              <Search />
              <button id="add-field-button" onClick={handleAddFieldClick}>
                Agregar Cancha
              </button>
            </>
          )}
          {role !== "ADMIN" && role !== "OWNER" && <Search />}
          <div className="flex-fields">
            {fields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </div>
        {/* Popup para agregar cancha */}
        {showAddFieldPopup && (
          <div
            className={
              theme === "dark" ? "add-field-popup-dark" : "add-field-popup"
            }
          >
            <form onSubmit={handleAddFieldSubmit}>
              <label>
                Imagen:
                <input
                  type="text"
                  name="image"
                  onChange={handleAddFieldChange}
                />
              </label>
              <label>
                Nombre:
                <input
                  type="text"
                  name="name"
                  value={newField.name}
                  onChange={handleAddFieldChange}
                />
              </label>

              <label>
                Ubicación:
                <input
                  type="text"
                  name="location"
                  value={newField.location}
                  onChange={handleAddFieldChange}
                />
              </label>
              <label>
                Descripción:
                <input
                  type="text"
                  name="description"
                  value={newField.description}
                  onChange={handleAddFieldChange}
                />
              </label>
              <label>
                Deporte:
                <select
  name="sport"
  value={newField.sport}
  onChange={handleAddFieldChange}
>
  <option value="0">Fútbol</option>
  <option value="1">Vóley</option>
  <option value="2">Tenis</option>
</select>
              </label>
              <label>
                Vestuarios:
                <input
                  type="checkbox"
                  name="lockerRoom"
                  value={newField.lockerRoom}
                  onChange={handleAddFieldChange}
                />
              </label>
              <label>
                Bar:
                <input
                  type="checkbox"
                  name="bar"
                  value={newField.bar}
                  onChange={handleAddFieldChange}
                />
              </label>
              <label>
                Precio:
                <input
                  type="text"
                  name="price"
                  value={newField.price}
                  onChange={handleAddFieldChange}
                />
              </label>
              <label>
  ID de Usuario:
  <input
    type="text"
    name="userId"
    value={selectedUserId}
    onChange={(e) => setSelectedUserId(e.target.value)}
  />
</label>
              <button type="submit">Agregar</button>
            </form>
            <button onClick={() => setShowAddFieldPopup(false)}>
              Cancelar
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;

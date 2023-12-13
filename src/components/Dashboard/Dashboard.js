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
  const { theme } = useContext(ThemeContext);
  const [showAddFieldPopup, setShowAddFieldPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [ownerUsers, setOwnerUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newField, setNewField] = useState({
    image: null,
    name: "",
    location: "",
    description: "",
    sport: "",
    lockerRoom: false,
    bar: false,
    price: 0,
  });

  // Método para manejar cambios en la barra de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrar canchas según el término de búsqueda
  const filteredFields = fields.filter((field) => {
    const fieldMatchesSearch =
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Puedes agregar más condiciones según tus necesidades

    return fieldMatchesSearch;
  });

  const handleAddFieldClick = () => {
    setShowAddFieldPopup(true);
  };

  const handleAddFieldChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Para manejar checkboxes correctamente
    const fieldValue = type === "checkbox" ? checked : value;

    setNewField((prevField) => ({
      ...prevField,
      [name]: type === "checkbox" ? checked : fieldValue,
    }));
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

      if (!newField.image) {
        console.error("Ingrese una imagen.");
        return
      }


      // Asegúrate de que el campo 'Name' tenga un valor
      if (!newField.name) {
        console.error("Ingrese un nombre antes de enviar la solicitud.");
        return;
      }
      // Asegúrate de que el campo 'location' tenga un valor
      if (!newField.location) {
        console.error("Ingrese una ubicación antes de enviar la solicitud.");
        return;
      } 

      if (!newField.description) {
        console.warn("No se proporcionó una descripción, se usará 'sin descripción'.");
        newField.description = "sin descripción";
      }

      if (!newField.price || parseFloat(newField.price) < 0) {
        console.error("Ingrese un precio válido antes de enviar la solicitud.");
        return;
      }

      // Asegúrate de que el campo 'userId' tenga un valor
      if (!selectedUserId) {
        console.error("Seleccione un usuario antes de enviar la solicitud.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/Field/create-admin?IdUser=${selectedUserId}`,
        {
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
            LockerRoom: newField.lockerRoom, // Convertir a número
            Bar: newField.bar, // Convertir a número
            Price: newField.price,
            Sport: parseInt(newField.sport), // Asegúrate de que el valor sea un entero
          }),
        }
      );

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
    console.log("ESTE OWNER", selectedUserId);
    console.log(newField.bar);
    console.log(newField.lockerRoom); //no lee esto
  };

  //TRAE ID DE OWNERS
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/api/User/getall`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((userData) => {
        const ownerUsersFiltered = userData.filter((user) => user.role === 1);
        setOwnerUsers(ownerUsersFiltered);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
          {role === "ADMIN" && (
            <>
              <Search onSearchChange={handleSearchChange}/>
              <button id="add-field-button" onClick={handleAddFieldClick}>
                Agregar Cancha
              </button>
            </>
          )}
          {role !== "ADMIN" && <Search onSearchChange={handleSearchChange}/>}
          {role === "OWNER" && (
            <>
            <h3 className={theme === "dark" ? "textos-dark" : "textos"}>
              Mis Canchas
            </h3>
            <a href="https://forms.gle/eEvQKMMGp3r92jrQ8" target="_blank" rel="noopener noreferrer">
              Solicitud para agregar cancha
            </a>
            <br />
            <a href="https://forms.gle/gxes8gnC9jF3JEcG9" target="_blank" rel="noopener noreferrer">
              Solicitud para eliminar cancha
            </a>
            </>
          )}
          <div className="flex-fields">
            {filteredFields.map((field) => (
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
                  style={{
                    borderColor: !newField.image ? "red" : "",
                  }}
                />
              </label>
              <label>
                Nombre:
                <input
                  type="text"
                  name="name"
                  // value={newField.name}
                  onChange={handleAddFieldChange}
                  style={{
                    borderColor: !newField.name ? "red" : "",
                  }}
                />
              </label>

              <label>
                Ubicación:
                <input
                  type="text"
                  name="location"
                  // value={newField.location}
                  onChange={handleAddFieldChange}
                  style={{
                    borderColor: !newField.location ? "red" : "",
                  }}
                />
              </label>
              <label>
                Descripción:
                <input
                  type="text"
                  name="description"
                  // value={newField.description}
                  onChange={handleAddFieldChange}
                  style={{
                    borderColor: !newField.description ? "red" : "",
                  }}
                />
              </label>
              <label>
                Deporte:
                <select
                  name="sport"
                  value={newField.sport}
                  onChange={handleAddFieldChange}
                  style={{
                    borderColor: !newField.sport ? "red" : "",
                  }}
                >
                  <option value="">Seleccionar un deporte</option>
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
                  // value={newField.lockerRoom}
                  onChange={handleAddFieldChange}
                />
              </label>
              <label>
                Bar:
                <input
                  type="checkbox"
                  name="bar"
                  // value={newField.bar}
                  onChange={handleAddFieldChange}
                />
              </label>
              <label>
                Precio:
                <input
                  type="text"
                  name="price"
                  // value={newField.price}
                  onChange={handleAddFieldChange}
                  style={{
                    borderColor: !newField.price || parseFloat(newField.price) < 0 ? "red" : "",
                  }}
                />
              </label>
              <label>
                ID de Usuario:
                <select
                  name="userId"
                  // value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  style={{
                    borderColor: !selectedUserId ? "red" : "",
                  }}
                >
                  <option value="">Seleccionar Usuario</option>

                  {ownerUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.id}
                    </option>
                  ))}
                </select>
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

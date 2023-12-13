import React, { useContext, useEffect, useState } from "react";
import ReservationCard from "../ReservationCard/ReservationCard";
import { Header } from "../Header/Header";
import "./Reservations.css";
import { Search } from "../Search/Search";
import { RoleContext } from "../../services/role.context";
import API_URL from "../../constants/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Reservations = () => {
  const { role } = useContext(RoleContext);
  const [reservations, setReservations] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState([]); // Nuevo estado
  const [fields, setFields] = useState([]);
  const [playerUsers, setPlayerUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado

  const navigate = useNavigate();

  const [newReservation, setNewReservation] = useState({
    date: new Date(),
    fieldId: 0,
    userId: 0,
  });

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
        const playerUsersFiltered = userData.filter((user) => user.role === 2);
        setPlayerUsers(playerUsersFiltered);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const fetchFields = async () => {
    try {
      const response = await fetch(`${API_URL}/api/Field/getall`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setFields(data);
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (role === "ADMIN") {
          // Lógica para obtener todas las reservaciones como administrador
          const response = await fetch(`${API_URL}/api/Reservation/getall`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = await response.json();
          setReservations(data);
        } else if (role === "PLAYER") {
          // Obtener el ID del usuario directamente del token al iniciar sesión
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const decodedToken = jwtDecode(token);
              const userId = decodedToken.sub;

              // Hacer la solicitud al endpoint específico para obtener las reservaciones del jugador
              const response = await fetch(
                `${API_URL}/api/Reservation/myreservations`,
                {
                  headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              const data = await response.json();
              console.log("Player reservations:", data);

              setReservations(data);
            } catch (error) {
              console.error("Error decoding token:", error);
            }
          }
        } else if (role === "OWNER") {
          // Lógica para obtener todas las reservaciones del owner
          const response = await fetch(
            `${API_URL}/api/Reservation/allreservations-owner`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await response.json();
          setReservations(data);
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [role]);

  const handleCreateFormToggle = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleCreateReservation = async (e) => {
    e.preventDefault();

    try {
      if (!selectedUserId) {
        console.error("Por favor, selecciona un usuario.");
        return;
      }

      const fieldId = document.getElementById("fieldID").value;
      const date = new Date(document.getElementById("date").value);

      // Formatear la fecha al formato ISO sin la parte de tiempo
      const formattedDate = date.toISOString().split("T")[0];
      const response = await fetch(`${API_URL}/api/Reservation/create-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          date: formattedDate,
          fieldId: fieldId,
          userId: selectedUserId,
        }),
      });

      if (response.ok) {
        console.log("Reserva creada exitosamente");
        const createdReservation = await response.json();
        setReservations((prevReservations) => [
          ...prevReservations,
          createdReservation,
        ]);
        setShowCreateForm(false);
      } else {
        console.error("Error al crear la reserva:", await response.text());
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <>
      <Header />
      <h1>
        {role === "ADMIN"
          ? "Todas las Reservas"
          : role === "OWNER"
          ? "Reservas de mis canchas"
          : "Mis Reservas"}
      </h1>
      <Search onSearchChange={(e) => setSearchTerm(e.target.value)}/>
      <div className="container">
        {Array.isArray(reservations) &&
          reservations
            .filter((reservation) =>
              reservation.field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              reservation.field.location.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
      </div>

      {role === "ADMIN" && (
        <>
          <button onClick={handleCreateFormToggle}>Crear Reserva</button>

          {showCreateForm && (
            <form>
              <label htmlFor="userId">ID de Usuario:</label>
              <select
                id="userID"
                name="userID"
                value={newReservation.selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Seleccionar Usuario</option>
                {playerUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.id} - {user.name}{" "}
                    {/* Ajusta según la estructura de tus datos de usuario */}
                  </option>
                ))}
              </select>
              <label htmlFor="fieldId">ID de Cancha:</label>
              <select id="fieldID" name="fieldID">
                <option value={newReservation.fieldId}>
                  Seleccionar Cancha
                </option>
                {fields
                  .filter((field) => !field.reserved) // Filtrar las canchas no reservadas
                  .map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.id} - {field.name}{" "}
                      {/* Ajusta según la estructura de tus datos de cancha */}
                    </option>
                  ))}
              </select>
              <label htmlFor="date">Fecha:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={newReservation.date?.toISOString().split("T")[0]}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    date: new Date(e.target.value),
                  })
                }
              />{" "}
              <button type="button" onClick={handleCreateReservation}>
                Crear
              </button>
              <button type="button" onClick={handleCreateFormToggle}>
                Cancelar
              </button>
            </form>
          )}
        </>
      )}
    </>
  );
};

export default Reservations;

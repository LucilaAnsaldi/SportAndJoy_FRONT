import React, { useContext, useEffect, useState } from "react";
import UsersCard from "../UsersCard/UsersCard";
import { Header } from "../Header/Header";
import "./Users.css";
import { Search } from "../Search/Search";
import API_URL from "../../constants/api";
import { ThemeContext } from "../../services/theme.context";

//CON FORMULARIO!

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editedUser, setEditedUser] = useState(null); // Nuevo estado para el usuario editado
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newUser, setNewUser] = useState({
    image: null,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "PLAYER",
  });

  const handleUpdateUser = (updatedUser) => {
    setEditedUser(updatedUser);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Renderización de los usuarios con el filtro
  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleAddUserClick = () => {
    setShowAddUserPopup(true);
  };

  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  useEffect(() => {
    if (editedUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === editedUser.id ? editedUser : user))
      );
      setEditedUser(null); // Reiniciar el estado después de la actualización
    }
  }, [editedUser]);

  //POST USER

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/User/registration-adduser-admin`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newUser),
        }
      );

      if (response.ok) {
        const createdUser = await response.json();
        setUsers((prevUsers) => [...prevUsers, createdUser]);
        setShowAddUserPopup(false);
      } else {
        console.log("Error al crear usuario:", await response.text());
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  // DELETE USER

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/User/${userId}/delete-admin`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
      } else {
        console.log("Error al eliminar usuario:", await response.text());
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  //GET ALL
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
        // console.log(userData);
        setUsers(userData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const { theme } = useContext(ThemeContext);

  return (
    <>
      <Header />
      <h1>Usuarios activos</h1>
      <Search  onSearchChange={handleSearchChange} />
      <button id="add-user-button" onClick={handleAddUserClick}>
        Agregar Usuario
      </button>
      <div className="container">
        {filteredUsers.map((user) => (
          <UsersCard
            key={user.id}
            user={user}
            onDeleteUser={handleDeleteUser}
            onUpdateUser={handleUpdateUser}
          />
        ))}
      </div>

      {/* Popup para agregar usuario */}
      {showAddUserPopup && (
        <div
          className={theme == "dark" ? "add-user-popup-dark" : "add-user-popup"}
        >
          <form onSubmit={handleAddUserSubmit}>
            {/* Campos del formulario para el nuevo usuario */}
            <label>
              Imagen:
              <input type="text" name="image" onChange={handleAddUserChange} />
            </label>
            <label>
              Nombre:
              <input
                type="text"
                name="firstName"
                value={newUser.firstName}
                onChange={handleAddUserChange}
              />
            </label>
            <label>
              Apellido:
              <input
                type="text"
                name="lastName"
                value={newUser.lastName}
                onChange={handleAddUserChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleAddUserChange}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleAddUserChange}
              />
            </label>
            <label>
              Tipo de Usuario:
              <select
                name="role"
                value={newUser.role}
                onChange={handleAddUserChange}
              >
                <option value="Player">Player</option>
                <option value="Owner">Owner</option>
              </select>
            </label>
            <button type="submit">Agregar</button>
          </form>
          <button onClick={() => setShowAddUserPopup(false)}>Cancelar</button>
        </div>
      )}
    </>
  );
};

export default Users;

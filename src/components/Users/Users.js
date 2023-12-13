import React, { useContext, useEffect, useState } from "react";
import UsersCard from "../UsersCard/UsersCard";
import { Header } from "../Header/Header";
import "./Users.css";
import { Search } from "../Search/Search";
import API_URL from "../../constants/api";
import { ThemeContext } from "../../services/theme.context";
import avatarImage from "../../assets/images/default_avatar.jpg";

//CON FORMULARIO!

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editedUser, setEditedUser] = useState(null); // Nuevo estado para el usuario editado
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const [isLastnameValid, setIsLastnameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

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
  const filteredUsers = users.filter(
    (user) =>
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

    // Validaciones adicionales
    if (name === "firstName") {
      setIsNameValid(value.trim() !== "" || !showAddUserPopup); // Marcar en rojo solo si está vacío y se está editando
    } else if (name === "lastName") {
      setIsLastnameValid(value.trim() !== "" || !showAddUserPopup); // Marcar en rojo solo si está vacío y se está editando
    } else if (name === "email") {
      // Validar el formato del correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailValid(
        value.trim() === "" || emailRegex.test(value) || !showAddUserPopup
      ); // Marcar en rojo solo si está vacío o el formato es inválido y se está editando
    } else if (name === "password") {
      setIsPasswordValid(
        value.length >= 6 || value.trim() === "" || !showAddUserPopup
      ); // Marcar en rojo solo si la longitud es inferior a 6 y se está editando
    }
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
    // Validar antes de enviar la solicitud
    if (!newUser.firstName.trim()) {
      setIsNameValid(false);
    }

    if (!newUser.lastName.trim()) {
      setIsLastnameValid(false);
    }

    // Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newUser.email.trim() || !emailRegex.test(newUser.email)) {
      setIsEmailValid(false);
    }

    // Validar la longitud de la contraseña
    if (newUser.password.trim().length < 6) {
      setIsPasswordValid(false);
    }

    if (!newUser.image) {
      console.error(
        "No se proporcionó una imagen, se usará la imagen por defecto."
      );
      newUser.image = avatarImage;
    }

    // Si alguna validación falla, no enviar la solicitud
    if (!isNameValid || !isLastnameValid || !isEmailValid || !isPasswordValid) {
      return;
    }

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

  const handleAddUserCancel = () => {
    // Restablecer el formulario al estado inicial
    setNewUser({
      image: null,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "PLAYER",
    });

    // Restablecer las validaciones
    setIsNameValid(true);
    setIsLastnameValid(true);
    setIsEmailValid(true);
    setIsPasswordValid(true);

    // Ocultar el popup
    setShowAddUserPopup(false);
  };

  const { theme } = useContext(ThemeContext);

  return (
    <>
      <Header />
      <h1>Usuarios activos</h1>
      <Search onSearchChange={handleSearchChange} />
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
                // value={newUser.firstName}
                onChange={handleAddUserChange}
                style={{ borderColor: isNameValid ? "" : "red" }}
              />
              {!isNameValid && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  El nombre es obligatorio.
                </div>
              )}
            </label>
            <label>
              Apellido:
              <input
                type="text"
                name="lastName"
                // value={newUser.lastName}
                onChange={handleAddUserChange}
                style={{ borderColor: isLastnameValid ? "" : "red" }}
              />
              {!isLastnameValid && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  El apellido es obligatorio.
                </div>
              )}
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                // value={newUser.email}
                onChange={handleAddUserChange}
                style={{ borderColor: isEmailValid ? "" : "red" }}
              />
              {!isEmailValid && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  {newUser.email.trim() === ""
                    ? "El correo electrónico es obligatorio."
                    : "Formato de correo electrónico inválido."}
                </div>
              )}
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
                // value={newUser.password}
                onChange={handleAddUserChange}
                style={{ borderColor: isPasswordValid ? "" : "red" }}
              />
              {!isPasswordValid && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  La contraseña debe tener al menos 6 caracteres.
                </div>
              )}
            </label>
            <label>
              Tipo de Usuario:
              <select
                name="role"
                // value={newUser.role}
                onChange={handleAddUserChange}
              >
                <option value="Player">Player</option>
                <option value="Owner">Owner</option>
              </select>
            </label>
            <button id="verde" type="submit">
              Agregar
            </button>
          </form>
          <button id="rojo" onClick={handleAddUserCancel}>
            Cancelar
          </button>
        </div>
      )}
    </>
  );
};

export default Users;

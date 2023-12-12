import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { Header } from "../Header/Header";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../../services/role.context";
import { jwtDecode } from "jwt-decode";
import API_URL from "../../constants/api";
import avatarImage from "../../assets/images/default_avatar.jpg";
import { ThemeContext } from "../../services/theme.context";
import ToggleTheme from "../toggleTheme/ToggleTheme";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const { role } = useContext(RoleContext);
  const [userData, setUserData] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { theme } = useContext(ThemeContext);
  const imageUrl = image ? image : avatarImage;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Realiza la lógica para enviar los datos actualizados al backend
    const token = localStorage.getItem("token");
    const userId = jwtDecode(token).sub;
    fetch(`${API_URL}/api/User/${userId}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName: name,
        lastName: lastname,
        email: email,
        image: image,
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
        return response.json();
      })
      .then((updatedUserData) => {
        setIsEditing(false);
        setUserData(updatedUserData);
      })
      .catch((error) => {
        console.error("Error updating user data:", error.message);
      });
  };

  const handleInputChange = (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    } else if (e.target.name === "lastname") {
      setLastname(e.target.value);
    } else if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "image") {
      setImage(e.target.value);
    }
  };

  const handleLogout = () => {
    // Muestra el popup de confirmación
    setShowConfirmation(true);
  };

  const handleConfirmLogout = () => {
    // Limpiar el token del localStorage
    localStorage.removeItem("token");
    navigate("/signin");
  };

  useEffect(() => {
    // Obtén el userId directamente del token al iniciar sesión
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;

        // Realiza la solicitud al servidor para obtener los datos del usuario
        fetch(`${API_URL}/api/User/get/${userId}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((userData) => {
            console.log("Datos del usuario:", userData);
            setName(userData.firstName);
            setLastname(userData.lastName);
            setEmail(userData.email);
            setImage(userData.image);
            setUserData(userData);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []); // Asegúrate de que este sea un arreglo vacío

  return (
    <>
      <Header />
      <ToggleTheme />
      <div className="perfil-container">
        <div className="perfil-header">
          <h1>Mi perfil</h1>
        </div>
        <div className="perfil-datos">
          {isEditing ? (
            <div>
              <div>
                <label>Cambia tu foto de perfil:</label>
                <input
                  type="text"
                  name="image"
                  value={imageUrl}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Nombre:</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Apellido:</label>
                <input
                  type="text"
                  name="lastname"
                  value={lastname}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                />
              </div>
              <button onClick={handleSaveClick}>Guardar</button>
            </div>
          ) : (
            <div>
              <div>
                <div className="userpic-container">
                  <img
                    className="userpic"
                    src={imageUrl}
                    alt="foto del usuario"
                  />
                </div>
              </div>
              <div>
                <label>Nombre:</label>
                <span>{name}</span>
              </div>
              <div>
                <label>Apellido:</label>
                <span>{lastname}</span>
              </div>
              <div>
                <label>Email:</label>
                <span>{email}</span>
              </div>
              <button className="editar" onClick={handleEditClick}>
                Editar
              </button>
              <>
                <button
                  className="cerrarSesion"
                  onClick={() => setShowConfirmation(true)}
                >
                  Cerrar sesión
                </button>
                {showConfirmation && (
                  <div className="modal">
                    <div
                      className={
                        theme === "dark" ? "modalContent-dark" : "modalContent"
                      }
                    >
                      <p>¿Estás seguro que deseas salir?</p>
                      <button
                        className={
                          theme === "dark"
                            ? "confirmButton-dark"
                            : "confirmButton"
                        }
                        onClick={handleConfirmLogout}
                      >
                        Sí
                      </button>
                      <button
                        className={
                          theme === "dark"
                            ? "cancelButton-dark"
                            : "cancelButton"
                        }
                        onClick={() => setShowConfirmation(false)}
                      >
                        No
                      </button>{" "}
                    </div>
                  </div>
                )}
              </>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;

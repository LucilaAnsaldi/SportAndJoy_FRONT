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


  const [isEmailValid, setIsEmailValid] = useState(true); // Nuevo estado
  const [isNameValid, setIsNameValid] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLastnameValid, setIsLastnameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [passwordConditions, setPasswordConditions] = useState([]);


  const imageUrl = image ? image : avatarImage;


  const handleEditClick = () => {
    setIsEditing(true);
    setShowPassword(true);
  };




  const validatePassword = (password) => {
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;


  const conditions = [];
  if (password.length < 6) {
    conditions.push("Al menos 6 caracteres");
  }
  if (!/\d/.test(password)) {
    conditions.push("Al menos un número");
  }
  if (!/[A-Za-z]/.test(password)) {
    conditions.push("Al menos una letra");
  }
  if (!/[@$!%*?&]/.test(password)) {
    conditions.push("Al menos un carácter especial");
  }


  return {
    isValid: passwordPattern.test(password) && conditions.length === 0,
    conditions,
  };
};


 


  const handleSaveClick = () => {
    // Validaciones adicionales
    if (!isNameValid || !isLastnameValid || !isEmailValid || !isPasswordValid) {
      // No permite guardar si alguna validación falla
      return;
    }


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
        password: password,
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
    setIsEditing(false);
  };


  const handleInputChange = (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
      setIsNameValid(e.target.value.trim() !== "");
    } else if (e.target.name === "lastname") {
      setLastname(e.target.value);
      setIsLastnameValid(e.target.value.trim() !== "");
    } else if (e.target.name === "email") {
      const inputEmail = e.target.value;
      setEmail(inputEmail);
      // Validar el formato del correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailValid(emailRegex.test(inputEmail));
    } else if (e.target.name === "image") {
      setImage(e.target.value);
    } else if (e.target.name === "password") {
      const newPassword = e.target.value;
      setPassword(newPassword);
 
      const { isValid, conditions } = validatePassword(newPassword);
      setIsPasswordValid(isValid);
      setPasswordConditions(conditions);
    }
  };


  const handleLogout = () => {
    // Muestra el popup de confirmación
    setShowConfirmation(true);
  };


  const handleConfirmLogout = () => {
    // Limpiar el token del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("theme");
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
            setPassword(userData.password);
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
      {role === "OWNER" &&  (
            <>
            <div
              className="solicitud-links-container"
            >
              <a
                href="https://forms.gle/eEvQKMMGp3r92jrQ8"
                target="_blank"
                rel="noopener noreferrer"
                className={`solicitud-link ${
                  theme === "dark" ? "solicitud-link-dark " : ""
                }`}
              >
                Solicitud para agregar cancha
              </a>
              <br />
              <a
                href="https://forms.gle/gxes8gnC9jF3JEcG9"
                target="_blank"
                rel="noopener noreferrer"
                className={`solicitud-link ${
                  theme === "dark" ? "solicitud-link-dark " : ""
                }`}
              >
                Solicitud para eliminar cancha
              </a>
            </div>
            </>
          )}
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
                  style={{ borderColor: isNameValid ? "" : "red" }}
                />
                {!isNameValid && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    El nombre no puede estar vacío.
                  </div>
                )}
              </div>
              <div>
                <label>Apellido:</label>
                <input
                  type="text"
                  name="lastname"
                  value={lastname}
                  onChange={handleInputChange}
                  style={{ borderColor: isLastnameValid ? "" : "red" }}
                />
                {!isLastnameValid && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    El apellido no puede estar vacío.
                  </div>
                )}
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  style={{ borderColor: isEmailValid ? "" : "red" }}
                />
                {!isEmailValid && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    Formato de correo electrónico inválido.
                  </div>
                )}
              </div>
              <div>
                <label>Contraseña:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  style={{
                    borderColor:
                      !isPasswordValid ? "red" : "",
                  }}
                />
                {!isPasswordValid && (
  <div style={{ color: "red", marginTop: "5px" }}>
    {password.length === 0 && "La contraseña no puede estar vacía."}
    <ul>
      {passwordConditions.map((condition, index) => (
        <li key={index}>{condition}</li>
      ))}
    </ul>
  </div>
                )}
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
                <span
                  className={
                    theme === "dark" ? "profileName-dark" : "profileName"
                  }
                >
                  {name}
                </span>
              </div>
              <div>
                <label>Apellido:</label>
                <span
                  className={
                    theme === "dark"
                      ? "profileLastName-dark"
                      : "profileLastName"
                  }
                >
                  {lastname}
                </span>
              </div>
              <div>
                <label>Email:</label>
                <span
                  className={
                    theme === "dark" ? "profileEmail-dark" : "profileEmail"
                  }
                >
                  {email}
                </span>
              </div>
              <div>
                <label>Contraseña:</label>
                <input
                  className={
                    theme === "dark"
                      ? "profilePassword-dark"
                      : "profilePassword"
                  }
                  type="password"
                  name="password"
                  value="********" // Aquí puedes mostrar asteriscos o lo que prefieras
                  readOnly
                />
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




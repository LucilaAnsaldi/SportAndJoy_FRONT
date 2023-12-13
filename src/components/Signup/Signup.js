import React, { useContext, useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router";
import "./Signup.css";
import API_URL from "../../constants/api";
import { ThemeContext } from "../../services/theme.context";

const Signup = () => {
  const [image, setImage] = useState("");
  const [lastName, setLastname] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [passwordConditions, setPasswordConditions] = useState([]);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const lastNameRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const navigate = useNavigate();
  const buttonNavigateSignup = () => {
    navigate("/signin");
  };

  const validateName = () => {
    setNameError(name.trim() === "");
  };

  const validateLastName = () => {
    setLastNameError(name.trim() === "");
  };

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    setEmailError(!emailPattern.test(email));
  };

  const validatePassword = () => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    setPasswordError(!passwordPattern.test(password));

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

    setPasswordConditions(conditions);
  };

  const validateConfirmPassword = () => {
    setConfirmPasswordError(confirmPassword !== password);
  };



  const signUpHandler = async () => {
    validateName();
    validateLastName();
    validateEmail();
    validatePassword();
    validateConfirmPassword();

    if (nameError || emailError || passwordError || lastNameError || confirmPasswordError) {
      return;
    }

    if (name === "" || email === "" || password === "" || lastName === "" || confirmPassword === "" ) {
      // Si algún campo está vacío, muestra el mensaje de error
      setNameError(true);
      setEmailError(true);
      setPasswordError(true);
      setLastNameError(true);
      setConfirmPasswordError(true);
      return;
    }

    // Tu lógica de registro aquí
    try {
      const response = await fetch(`${API_URL}/api/User/registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Image: image,
          FirstName: name,
          LastName: lastName,
          Email: email,
          Password: password,
          Role: "PLAYER",
        }),
      });

      if (response.ok) {
        // Registro exitoso, puedes manejar la respuesta del servidor si es necesario
        // const role = "player";  Reemplaza con la lógica para obtener el rol
        // updateUser({ role });
        // console.log("Registro exitoso");

        // Redirige a la página de dashboard después del registro
        navigate("/signin");
      } else {
        // Manejar errores, por ejemplo, mostrar un mensaje de error
        console.log("Error en el registro");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const { theme } = useContext(ThemeContext);
  // navigate("/dashboard");

  return (
    <div
      className={
        theme === "dark" ? "signup-container-dark" : "signup-container"
      }
    >
      <h2>Creá tu cuenta</h2>
      <div className="input-container">
        <label className="label">Imagen</label>
        <input
          placeholder=""
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label className="label">Nombre</label>
        <input
          className={`input ${nameError ? "error" : ""}`}
          placeholder=""
          type="text"
          ref={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={validateName}
        />
        {nameError && <p className="error-message">Ingrese su nombre</p>}
      </div>
      <div className="input-container">
        <label className="label">Apellido</label>
        <input
          className={`input ${lastNameError ? "error" : ""}`}
          placeholder=""
          type="text"
          ref={lastNameRef}
          value={lastName}
          onChange={(e) => setLastname(e.target.value)}
          onBlur={validateLastName}
        />
        {lastNameError && <p className="error-message">Ingrese su apellido</p>}
      </div>
      <div className="input-container">
        <label className="label">Mail</label>
        <input
          className={`input ${emailError ? "error" : ""}`}
          placeholder=""
          type="email"
          ref={emailRef}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validateEmail}
        />
        {emailError && (
          <p className="error-message">Ingrese un correo electrónico válido</p>
        )}
      </div>
      <div className="input-container">
        <label className="label">Contraseña</label>
        <input
          className={`input ${passwordError ? "error" : ""}`}
          placeholder=""
          type="password"
          ref={passwordRef}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword();
          }}
          onBlur={validatePassword}
        />
        {passwordConditions.length > 0 && (
          <div className="password-conditions">
            <p className="error-message">Condiciones de la contraseña:</p>
            <ul>
              {passwordConditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          </div>
        )}
        {passwordError && (
          <p className="error-message">
            La contraseña no cumple con los requisitos.
          </p>
        )}
      </div>
      <div className="input-container">
        <label className="label">Confirmar Contraseña</label>
        <input
          className={`input ${confirmPasswordError ? "error" : ""}`}
          placeholder=""
          type="password"
          ref={confirmPasswordRef}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            validateConfirmPassword();
          }}
          onBlur={validateConfirmPassword}
        />
        {confirmPasswordError && (
          <p className="error-message">Las contraseñas no coinciden</p>
        )}
      </div>
      <button className="signin-button" type="button" onClick={signUpHandler}>
        Registrarse
      </button>
      <p>
      ¿Ya tenés una cuenta?{" "}
      <a href="#" onClick={buttonNavigateSignup}>
      ¡Iniciá Sesión!
      </a>
    </p>
    </div>
  );
};

export default Signup;

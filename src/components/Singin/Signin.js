import React, { useContext, useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router";
import "./Signin.css";
import API_URL from "../../constants/api";
import { jwtDecode } from "jwt-decode";
import { RoleContext } from "../../services/role.context";
import { ThemeContext } from "../../services/theme.context";

const Signin = () => {
  // const { updateUserRole, setDecodedToken } = useUser(); // Asegúrate de tener una función setDecodedToken en el contexto
  // const { updateUserRole } = useUser(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para el spinner

  const { setRole } = useContext(RoleContext);
  const { setToken } = useContext(RoleContext);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();
  const buttonNavigateSignin = () => {
    navigate("/signup");
  };

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
    setEmailError(!emailPattern.test(email));
  };

  const validatePassword = () => {
    setPasswordError(password.length < 6);
  };

  const signInHandler = async () => {
    validateEmail();
    validatePassword();

    if (emailError || passwordError) {
      return;
    }

    if (email === "" || password === "") {
      // Si algún campo está vacío, muestra el mensaje de error
      setEmailError(true);
      setPasswordError(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/User/authorization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        try {
          const responseText = await response.text();
          console.log("Response Text:", responseText);

          // Intenta analizar la respuesta solo si es un formato JSON válido
          // const responseData = JSON.parse(responseText);

          // const { token, role } = responseText;

          // Almacena el token en el localStorage
          localStorage.setItem("token", responseText);
          console.log("Inicio de sesión exitoso");
          console.log(responseText);

          // const role = localStorage.getItem(dasdwq)

          const role = jwtDecode(responseText).role;

          localStorage.setItem("role", role);

          setRole(role);

          setToken(responseText);

          console.log(role);

          // Actualiza el usuario en el contexto con el nuevo rol
          // updateUserRole(role);
          // console.log(role);

          // No actualizamos el rol directamente aquí, ya que solo obtenemos el token
          // Redirige a la página de dashboard
          navigate("/dashboard");
        } catch (jsonError) {
          console.error("Error al analizar la respuesta JSON:", jsonError);
        }
      } else {
        const errorText = await response.text();

        if (response.status === 401) {
          // Usuario no autorizado (credenciales incorrectas)
          setSignInError(
            "Usuario o contraseña incorrectos, intente nuevamente"
          );
        } else if (response.status === 404) {
          // Usuario no encontrado en la base de datosb
          setSignInError(
            "El usuario no existe. Si no tiene una cuenta, puede registrarse."
          );
        } else {
          // Otro tipo de error no manejado específicamente
          setSignInError("Error en el inicio de sesión. Intente nuevamente.");
          console.log("Error en el inicio de sesión:", errorText);
        }
      }
    } catch (error) {
      setSignInError(
        "Ocurrió un error en el inicio de sesión. Intente nuevamente."
      );
      console.error("Error en la solicitud:", error);
    } finally {
      // Finaliza la carga
      setIsLoading(false);
    }
  };

  const { theme } = useContext(ThemeContext);
  // navigate("/dashboard");

  return (
    <div
      className={
        theme === "dark" ? "signin-container-dark" : "signin-container"
      }
    >
      <h2>Ingresá a tu cuenta</h2>
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
          onChange={(e) => setPassword(e.target.value)}
          onBlur={validatePassword}
        />
        {passwordError && (
          <p className="error-message">
            La contraseña debe tener al menos 6 caracteres
          </p>
        )}
      </div>
      {signInError && <p className="error-message">{signInError}</p>}

      <button className="signin-button" type="button" onClick={signInHandler}>
        {isLoading ? "Ingresando..." : "Ingresar"}
      </button>
      <p>
        ¿No tenés una cuenta?{" "}
        <a href="#" onClick={buttonNavigateSignin}>
          ¡Registrate!
        </a>
      </p>
      <p>
        ¿Tenés canchas para alquilar?{" "}
        <a
          href="https://forms.gle/SyaMTya5DL83Mwyd7"
          target="_blank"
          rel="noopener noreferrer"
        >
          ¡Contactanos!
        </a>
      </p>
    </div>
  );
};

export default Signin;

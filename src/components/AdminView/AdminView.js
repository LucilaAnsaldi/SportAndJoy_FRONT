import React, { useContext } from "react";
import { Header } from "../Header/Header";
import "./AdminView.css";
import { useNavigate } from "react-router-dom";
import ToggleTheme from "../toggleTheme/ToggleTheme";
import { RoleContext } from "../../services/role.context";
import NotFound from "../NotFound/NotFound";
import API_URL from "../../constants/api";
import { Button } from "react-bootstrap";
import { ThemeContext } from "../../services/theme.context";

const AdminView = () => {
  const { role } = useContext(RoleContext);

  console.log("Role:", role);
  const navigate = useNavigate();

  const buttonNavigateUsers = () => {
    navigate("/users");
  };

  const buttonNavigateReservations = () => {
    navigate("/reservations");
  };
  const buttonNavigateFields = () => {
    navigate("/allFields");
  };

  const handleDownloadPdf1 = () => {
    fetch(API_URL + "/api/Reports/players-with-reservations", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al descargar el informe");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Informe.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleDownloadPdf2 = () => {
    fetch(API_URL + "/api/Reports/owners-with-fields", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al descargar el informe");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Informe.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const { theme } = useContext(ThemeContext);

  function handleDownloadPdf3() {
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    fetch(
      API_URL + "/api/Reports/reservations-in-month/" + month + "/" + year,
      {
        method: "GET",
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        console.log("entro");
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `InformeReservas${month}-${year}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) =>
        console.error("Error al realizar la solicitud:", error)
      );
  }

  if (role === "ADMIN") {
    return (
      <>
        <Header />
        <div className={theme === "dark" ? "body-dark" : "x"}>
          <div>
            <button
              className={
                theme === "dark" ? "users-button-dark" : "users-button"
              }
              onClick={buttonNavigateUsers}
            >
              Usuarios Activos
            </button>
            <button
              className={
                theme === "dark"
                  ? "reservations-button-dark"
                  : "reservations-button"
              }
              onClick={buttonNavigateReservations}
            >
              Reservas
            </button>
            <button
              className={
                theme === "dark" ? "allFields-button-dark" : "allFields-button"
              }
              onClick={buttonNavigateFields}
            >
              Canchas activas
            </button>
          </div>
          <section className={theme === "dark" ? "section-dark" : "section"}>
            <h1 className={theme === "dark" ? "textos-dark" : "textos"}>
              Informes
            </h1>
            <h3 className={theme === "dark" ? "textos-dark" : "textos"}>
              Jugadores que hicieron al menos una reserva:
            </h3>
            <button
              className={theme === "dark" ? "pdf-dark" : "pdf"}
              onClick={handleDownloadPdf1}
            >
              descargar pdf
            </button>
            <h3 className={theme === "dark" ? "textos-dark" : "textos"}>
              Dueños que tienen al menos una cancha:
            </h3>
            <button
              className={theme === "dark" ? "pdf-dark" : "pdf"}
              onClick={handleDownloadPdf2}
            >
              descargar pdf
            </button>
            <h3 className={theme === "dark" ? "textos-dark" : "textos"}>
              Todas las reservas que se hicieron en un período:
            </h3>
            <form id="reportForm" onSubmit={handleDownloadPdf3}>
              <label for="month">Mes:</label>
              <select id="month" name="month">
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>

              <label for="year">Año:</label>
              <input
                type="number"
                id="year"
                name="year"
                min="2000"
                max="2100"
                required
              />

              <button
                className={theme === "dark" ? "pdf-dark" : "pdf"}
                type="submit"
              >
                Generar Informe pdf
              </button>
            </form>
          </section>
        </div>
      </>
    );
  } else {
    return <h1>No tenés permisos suficientes para ver esta página...</h1>;
  }
};

export default AdminView;

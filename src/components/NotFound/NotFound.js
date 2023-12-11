import React, { useContext } from "react";
import "./NotFound.css";

import not_found from "../../assets/images/not_found.png";

const NotFound = () => {
  return (
    <>
      <div className="body">
        <img src={not_found} alt="pagina no encontrada" />
      </div>
    </>
  );
};

export default NotFound;

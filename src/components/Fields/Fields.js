import React from "react";
import { FieldDetail } from "../FieldDetail/FieldDetail";

export const Fields = ({ fields }) => {
  console.log("las canchas");

  const fieldsMapped = fields.map((field) => (
    <FieldDetail
      id={field.id}
      name={field.name}
      location={field.location}
      image={field.image}
      description={field.description}
      bar={field.bar}
      price={field.price}
      sport={field.sport}
      lockerRoom={field.lockerRoom}
      userId={field.userId} // Agrega esta línea
    />
  ));

  return <div className="fields">fieldsMapped</div>;
};

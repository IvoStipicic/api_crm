import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Alerta from "./Alerta";
import { useNavigate } from "react-router-dom";
import Spiner from "./Spinner";

const Formulario = ({ cliente, cargando }) => {
  const navigate = useNavigate();
  const nuevoClienteSchema = Yup.object().shape({
    nombre: Yup.string()
      .min(3, "El nombre es muy corto")
      .max(20, "El nombre es muy largo")
      .required("El nombre del Cliente es Obligatorio"),
    empresa: Yup.string().required("El nombre de la empresa es obligatorio"),
    email: Yup.string()
      .email("Email no valido")
      .required("El  email es obligatorio"),
    telefono: Yup.number()
      .integer("Numero no valido")
      .positive("Numero no valido")
      .typeError("Solo debe tener numeros"),
  });

  const handleSubmit = async (values) => {
    let respuesta;
    try {
      if (cliente.id) {
        const url = `http://localhost:4000/clientes/${cliente.id}`;
        respuesta = await fetch(url, {
          method: "PUT",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        const url = "http://localhost:4000/clientes";
        respuesta = await fetch(url, {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      await respuesta.json();
      navigate("/clientes");
    } catch (error) {
      console.log("error ", error);
    }
  };

  return (
    <div className="bg-white mt-10 px-5 py-10 rounded-md shadow-md md:w-3/4 mx-auto">
      <h1 className="text-gray-600 font-bold text-xl uppercase text-center">
        {cliente?.nombre ? "Editar Cliente" : "Agregar Cliente"}
      </h1>
      <Formik
        initialValues={{
          nombre: cliente?.nombre ?? "",
          empresa: cliente?.empresa ?? "",
          email: cliente?.email ?? "",
          telefono: cliente?.telefono ?? "",
          notas: cliente?.notas ?? "",
        }}
        enableReinitialize={true}
        onSubmit={async (values, { resetForm }) => {
          await handleSubmit(values);

          resetForm();
        }}
        validationSchema={nuevoClienteSchema}
      >
        {({ errors }) => {
          return cargando ? (
            <Spiner />
          ) : (
            <Form className="mt-10">
              <div className="mb-4">
                <label className="text-gray-800" htmlFor="nombre">
                  Nombre:
                </label>
                <Field
                  className="mt-2 block w-full p-3 bg-gray-50"
                  id="nombre"
                  placeholder="Nombre del cliente"
                  type="text"
                  name="nombre"
                />
                {errors.nombre ? <Alerta>{errors.nombre}</Alerta> : null}
              </div>
              <div className="mb-4">
                <label className="text-gray-800" htmlFor="empresa">
                  Empresa:
                </label>
                <Field
                  className="mt-2 block w-full p-3 bg-gray-50"
                  id="empresa"
                  placeholder="Empresa del cliente"
                  type="text"
                  name="empresa"
                />
                {errors.empresa ? <Alerta>{errors.empresa}</Alerta> : null}
              </div>
              <div className="mb-4">
                <label className="text-gray-800" htmlFor="email">
                  Email:
                </label>
                <Field
                  className="mt-2 block w-full p-3 bg-gray-50"
                  id="email"
                  placeholder="Email del cliente"
                  type="email"
                  name="email"
                />
                {errors.email ? <Alerta>{errors.email}</Alerta> : null}
              </div>
              <div className="mb-4">
                <label className="text-gray-800" htmlFor="telefono">
                  Telefono:
                </label>
                <Field
                  className="mt-2 block w-full p-3 bg-gray-50"
                  id="telefono"
                  placeholder="Telefono del cliente"
                  type="tel"
                  name="telefono"
                />
                {errors.telefono ? <Alerta>{errors.telefono}</Alerta> : null}
              </div>
              <div className="mb-4">
                <label className="text-gray-800" htmlFor="notas">
                  Notas:
                </label>
                <Field
                  as="textarea"
                  className="mt-2 block w-full p-3 bg-gray-50 h-40"
                  id="notas"
                  placeholder="Notas del cliente"
                  type="text"
                  name="notas"
                />
              </div>
              <input
                type="submit"
                value={cliente?.nombre ? "Editar Cliente" : "Agregar Cliente"}
                className="mt-5 w-full bg-blue-800 p-3 text-white font-bold text-lg uppercase"
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

Formulario.defaultProps = {
  cliente: {},
  cargando: false,
};

export default Formulario;

import { useState } from "react";
import { useAuth } from "../../../hooks/UseAuth";
import { Global } from "../../../helpers/Global";
import SerializeForm from "../../../helpers/SerializeForm";
import ProfileForm from "./ProfileForm";
import UpdateMessage from "./UpdateMessage";

const Config = () => {
  const { auth, setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState("not_saved");

  const updateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let newDataUser = SerializeForm(e.target, { interests: auth.interests });
    delete newDataUser.file0; //Eliminamos file0 de datos JSON para no enviarlo en el PUT

    try {
      const request = await fetch(Global.url + "user/update", {
        method: "PUT",
        body: JSON.stringify(newDataUser),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const data = await request.json();
      handleResponse(data);

      //Si la respuesta exito y hay archivo, subimos imagen
      const fileInput = document.querySelector("#fileInput");
      if (data.status === "success" && fileInput.files[0]) {
        await uploadImage(fileInput.files[0], token);
      }
    } catch (error) {
      setSaved("error");
      console.error(error);
    }
  };

  const handleResponse = (data) => {
    if (data.status === "success") {
      delete data.user.password;
      setAuth(data.user); //Actualizamos información usuario en estado
      setSaved("saved");
    } else {
      setSaved("error");
    }
  };

  const uploadImage = async (file, token) => {
    const formData = new FormData();
    formData.append("file0", file); //Archivo que se selecciona

    try {
      const uploadRequest = await fetch(Global.url + "user/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token,
        },
      });

      const uploadData = await uploadRequest.json();
      handleResponse(uploadData); //Procesamos respuesta después de la subida
    } catch (error) {
      setSaved("error");
      console.error("Error al subir la imagen:", error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 text-start">
        Editar Perfil
      </h1>
      <ProfileForm
        auth={auth}
        setAuth={setAuth}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onChange={updateUser} //Pasamos la función para manejar el submit del formulario
        onFileChange={() => {}} //La función en este caso no hace nada porque la manejamos directamente
      />
      <UpdateMessage saved={saved} setSaved={setSaved} />
    </>
  );
};

export default Config;

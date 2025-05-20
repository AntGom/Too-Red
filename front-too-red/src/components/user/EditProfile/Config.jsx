import { useState } from "react";
import { useAuth } from "../../../hooks/UseAuth";
import { Global } from "../../../helpers/Global";
import SerializeForm from "../../../helpers/SerializeForm";
import ProfileForm from "./ProfileForm";
import { useToast } from "../../../hooks/useToast";

const Config = () => {
  const { auth, setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const updateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    let newDataUser = SerializeForm(e.target, { interests: auth.interests });
    delete newDataUser.file0;

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
      
      if (data.status === "success") {
        delete data.user.password;
        setAuth(data.user); // Actualiza el estado del usuario

        //Si hay archivo, subimos imagen
        const fileInput = document.querySelector("#fileInput");
        if (fileInput.files[0]) {
          await uploadImage(fileInput.files[0], token);
        } else {
          showToast({ 
            message: "¡¡Usuario actualizado correctamente!!", 
            type: "success" 
          });
        }
      } else {
        showToast({ 
          message: "Error al actualizar los datos de usuario", 
          type: "error" 
        });
      }
    } catch (error) {
      showToast({ 
        message: "Error al actualizar los datos de usuario", 
        type: "error" 
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file, token) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const uploadRequest = await fetch(Global.url + "user/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token,
        },
      });

      const uploadData = await uploadRequest.json();
      
      if (uploadData.status === "success") {
        delete uploadData.user.password;
        setAuth(uploadData.user);
        showToast({ 
          message: "¡¡Usuario actualizado correctamente!!", 
          type: "success" 
        });
      } else {
        showToast({ 
          message: "Error al subir la imagen", 
          type: "error" 
        });
      }
    } catch (error) {
      showToast({ 
        message: "Error al subir la imagen", 
        type: "error" 
      });
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
        onChange={updateUser} 
        onFileChange={() => {}} 
        loading={loading}
      />
    </>
  );
};

export default Config;
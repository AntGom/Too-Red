import Follow from "../../models/followModel.js";

//Acción de guardar un follow (acción de seguir)

const save = async (req, res) => {
    try {
        // Obtener los datos enviados en el cuerpo de la petición
        let params = req.body;

        // Obtener el ID del usuario autenticado
        let identity = req.user;

        // Crear un nuevo objeto Follow con los datos del usuario que sigue y el seguido
        let userToFollow = new Follow({
            user: identity.id,     // ID del usuario que está siguiendo
            followed: params.followed  // ID del usuario que está siendo seguido
        });

        // Guardar el nuevo follow en la base de datos
        const followStored = await userToFollow.save();

        // Enviar una respuesta exitosa
        return res.status(200).send({
            status: "success",
            message: "Follow guardado correctamente",
            identity,
            follow: followStored   // Devolver el objeto follow guardado
        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al guardar el follow. No has podido seguir al usuario.",
            error: error
        });
    }
}

export default save;

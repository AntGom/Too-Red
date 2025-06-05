import Follow from "../../models/followModel.js";

//Acción de seguir a alguien

const save = async (req, res) => {
    try {
        let params = req.body;

        // ID del usuario autenticado
        let identity = req.user;

        // Crear un nuevo objeto Follow con los datos del usuario que sigue y el seguido
        let userToFollow = new Follow({
            user: identity.id,     // ID del usuario que está siguiendo
            followed: params.followed  // ID del usuario seguido
        });

        // Guardar el nuevo follow en bbdd
        const followStored = await userToFollow.save();

        return res.status(200).send({
            status: "success",
            message: "Follow guardado correctamente",
            identity,
            follow: followStored   // Objeto follow guardado
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

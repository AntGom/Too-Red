import Follow from "../../models/followModel.js";

const unfollow = async (req, res) => {

    try {
        let followedId = req.params.id;//ID de usuario a dejar de seguir
        let identity = req.user; //Usuario autenticado

        if (!followedId) {
            return res.status(400).send({
                status: "error",
                message: "El ID del usuario a dejar de seguir es requerido.",
            });
        }

        const followExists = await Follow.findOne({ //Buscar relación entre el usuario autenticado-followed
            user: identity.id,
            followed: followedId,
        });

        if (!followExists) { // Si no existe relación, error
            return res.status(404).send({
                status: "error",
                message: "No se encontró el follow para eliminar.",
            });
        }

        let result = await Follow.deleteOne({ // Si existe la relación, eliminarla
            _id: followExists._id
        });

        if (result.deletedCount === 0) { // Verificar si se eliminó
            return res.status(500).send({
                status: "error",
                message: "Error al eliminar el follow.",
            });
        }
        return res.status(200).send({
            status: "success",
            message: "Has dejado de seguir al usuario correctamente.",
        });
        
    } catch (error) {
        console.error("Error en unfollow:", error);
        return res.status(500).send({
            status: "error",
            message: "Error al eliminar el follow. No has podido dejar de seguir al usuario.",
        });
    }
};

export default unfollow;

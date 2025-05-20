import User from "../../models/userModel.js";
import { followThisUser } from "../../services/followService.js";

const profile = async (req, res) => {
    try {
        // Verificar que los parámetros estén definidos
        if (!req.user || !req.params.id) {
            return res.status(400).send({
                status: "error",
                message: "Parámetros inválidos",
            });
        }

        console.log("User ID:", req.user.id);
        console.log("Followed ID:", req.params.id);

        // Obtener el usuario cuyo perfil estamos solicitando, excluyendo password y role
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "Usuario no encontrado",
            });
        }

        // Info de seguimiento
        const followInfo = await followThisUser(req.user.id, req.params.id);
        console.log(followInfo);

        // Devolver el resultado
        return res.status(200).send({
            status: "success",
            message: "Usuario identificado correctamente",
            user: user,
            following: followInfo.following,
            follower: followInfo.follower 
        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al obtener el perfil del usuario",
            error: error.message,
        });
    }
};

export default profile;

import Follow from "../../models/followModel.js";
import Publication from "../../models/publicationModel.js";

const counter = async (req, res) => {
    
    let userId = req.user._id;

    if (req.params.id) {
        userId = req.params.id;
    }

    try {
        const following = await Follow.countDocuments({ user: userId }); 
        const followers = await Follow.countDocuments({ followed: userId }); 
        const publications = await Publication.countDocuments({ user: userId });

        return res.status(200).send({
            userId,
            following,
            followers,
            publications,
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al obtener los contadores",
        });
    }
};

export default counter;

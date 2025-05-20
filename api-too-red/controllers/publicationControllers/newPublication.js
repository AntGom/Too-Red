import Publication from "../../models/publicationModel.js";

const save = async (req, res) => {
    // Recoger datos del body
    const params = req.body;

    // Si no llegan dar respuesta negativa
    if(!params.text){
        return res.status(400).send({
            status: "error",
            message: "Debes rellenar el campo 'texto' para crear una publicacion"
        });
    }

    try {
        // Crear objeto de la clase Publication
        let newPublication = new Publication(params);
        newPublication.user = req.user.id;

        // Guardar modelo en BBDD
        const publicationStored = await newPublication.save();

        return res.status(200).send({
            status: "success",
            message: "Publicación realizada con éxito",
            publicationStored,
            userId: newPublication.user
        });

    }catch (error) {
    return res.status(500).send({
        status: "error",
        message: "La publicación no se ha guardado",
        error: error.message
    });
    }
}

export default save;
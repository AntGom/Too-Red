import Publication from "../../models/publicationModel.js";

const editPublication = async (req, res) => {
  const publicationId = req.params.id;
  const params = req.body;

  // Verificar que 'texto' existe
  if (!params.text) {
    return res.status(400).send({
      status: "error",
      message: "Debes rellenar el campo 'texto' para actualizar la publicación",
    });
  }

  try {
    // Buscar la por ID
    const publication = await Publication.findById(publicationId);

    // Si no se encuentra, error
    if (!publication) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado la publicación",
      });
    }

    // Verificar si usuario que realiza solicitud es el mismo que la creó
    if (publication.user.toString() !== req.user.id) {
      return res.status(403).send({
        status: "error",
        message: "No tienes permiso para editar esta publicación",
      });
    }

    // Actualizar
    const publicationUpdated = await Publication.findByIdAndUpdate(
      publicationId,
      params,
      { new: true }
    );

    return res.status(200).send({
      status: "success",
      message: "Publicación actualizada con éxito",
      publication: publicationUpdated,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al actualizar la publicación",
      error,
    });
  }
};

export default editPublication;

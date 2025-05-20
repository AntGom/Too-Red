import User from "../models/userModel.js";
import Publication from "../models/publicationModel.js";
import Follow from "../models/followModel.js";
import moment from "moment";

const deletePhysicallyAfter30Days = async () => {
    const currentDate = moment();
    const thirtyDaysAgo = currentDate.subtract(30, "days").toDate();
  
    try {
      //Eliminar usuarios en 30 días
      const usersToDelete = await User.find({
        isDeleted: true,
        deletedAt: { $lte: thirtyDaysAgo },
      });
  
      if (usersToDelete.length > 0) {
        await User.deleteMany({
          _id: { $in: usersToDelete.map((user) => user._id) },
        });
        console.log(`Se han eliminado físicamente ${usersToDelete.length} usuarios.`);
      } else {
        console.log("No hay usuarios para eliminar físicamente.");
      }
  
      //Eliminar publicaciones en 30 días
      const publicationsToDelete = await Publication.find({
        isDeleted: true,
        deletedAt: { $lte: thirtyDaysAgo },
      });
  
      if (publicationsToDelete.length > 0) {
        await Publication.deleteMany({
          _id: { $in: publicationsToDelete.map((pub) => pub._id) },
        });
        console.log(`Se han eliminado físicamente ${publicationsToDelete.length} publicaciones.`);
      } else {
        console.log("No hay publicaciones para eliminar físicamente.");
      }
  
      //Eliminar follows en 30 días
      const followsToDelete = await Follow.find({
        isDeleted: true,
        deletedAt: { $lte: thirtyDaysAgo },
      });
  
      if (followsToDelete.length > 0) {
        await Follow.deleteMany({
          _id: { $in: followsToDelete.map((f) => f._id) },
        });
        console.log(`Se han eliminado físicamente ${followsToDelete.length} follows.`);
      } else {
        console.log("No hay follows para eliminar físicamente.");
      }
    } catch (error) {
      console.error("Error en el borrado físico:", error);
    }
  };
  

export default deletePhysicallyAfter30Days;

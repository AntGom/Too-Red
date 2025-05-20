import cron from "node-cron";
import deletePhysicallyAfter30Days from "./deletePhysically.js";

//Borrado físico diario 00:00
cron.schedule("0 0 * * *", () => {
  console.log("Ejecutando borrado físico de usuarios, publicaciones y follows...");
  deletePhysicallyAfter30Days();
});
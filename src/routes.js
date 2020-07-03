import express from "express";
import ContasController from "./controller/contasController.js";

const routes = express.Router();
const contasController = new ContasController();

routes.get("/", contasController.index);
routes.put("/", contasController.updateBalance);
routes.get("/findAccount", contasController.findAccount);
routes.delete("/deleteAccount", contasController.deleteAccount);
routes.put("/transferAccount", contasController.transferAccount);
routes.get("/mediaBalanceAgency", contasController.mediaBalanceAgency);
routes.get("/clientsMorePoors", contasController.clientsMorePoors);
routes.get("/clientsMoreRichs", contasController.clientsMoreRichs);
routes.get("/clientsPrime", contasController.clientsPrime);

export default routes;

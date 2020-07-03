import express from "express";
import routes from "./routes.js";
import mongoose from "mongoose";

(async () => {
  try {
    await mongoose.connect("mongodb://localhost/db_trabalho_modulo_4", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Conectado ao banco!");
  } catch (error) {
    console.log("Erro ao conectar no banco!");
  }
})();

const app = express();
app.use(express.json());
app.use(routes);

app.listen(3333, () => {
  console.log("Application start");
});

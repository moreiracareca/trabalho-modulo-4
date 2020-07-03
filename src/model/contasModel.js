import mongoose from "mongoose";

// mongoose.set("debug", true);

const contaSchema = mongoose.Schema({
  agencia: {
    type: Number,
    required: true,
  },
  conta: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    min: [0, "after operations should not be negative"],
  },
});

const contasModel = mongoose.model("contas", contaSchema);

export default contasModel;

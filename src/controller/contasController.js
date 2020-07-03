import conta from "../model/contasModel.js";
import contasModel from "../model/contasModel.js";

class ContasController {
  //LISTAR TODAS AS CONTAS
  async index(_, res) {
    try {
      const data = await conta.find({});
      res.send(data);
    } catch (error) {
      res.status(500).send("Erro");
    }
  }

  async updateBalance(req, res) {
    try {
      const { agencia, conta, balance } = req.body;

      const account = await contasModel.findOne({
        agencia: agencia,
        conta: conta,
      });

      if (!account) {
        return res.status(404).json({ msg: "Não localizou a conta!" });
      }

      const id = account._id;

      let balanceValue = balance;
      if (balance < 0) {
        balanceValue = balance - 1;
      }

      const newBalance = account.balance + balanceValue;

      if (newBalance < 0) {
        return res.json({ msg: "Saldo insuficiente!" });
      }

      const accountUpdate = await contasModel.findOneAndUpdate(
        {
          _id: id,
        },
        { balance: newBalance },
        { new: true, upsert: true }
      );

      if (!accountUpdate) {
        res.status(404).json({ msg: "Could not find account" });
      }

      res.json({ balance: accountUpdate.balance });
    } catch (error) {
      res.status(404).json({ msg: error });
    }
  }

  async findAccount(req, res) {
    try {
      const { agencia, conta } = req.body;

      const account = await contasModel.findOne({
        agencia: agencia,
        conta: conta,
      });

      if (!account) {
        return res.status(404).json({ msg: "Não localizou a conta!" });
      } else {
        return res.json({ balance: account.balance });
      }
    } catch (error) {
      res.status(404).json({ msg: error });
    }
  }

  async deleteAccount(req, res) {
    try {
      const { agencia, conta } = req.body;

      const account = await contasModel.findOneAndDelete({
        agencia: agencia,
        conta: conta,
      });

      if (!account) {
        res.status(404).json({ msg: "Não encontrou a conta" });
      }

      return res.json({ activeAccounts: await contasModel.countDocuments({ agencia: agencia }) });
    } catch (error) {
      res.status(404).json({ msg: error });
    }
  }

  async transferAccount(req, res) {
    try {
      const { contaOrigem, contaDestino, valor } = req.body;

      const account = await contasModel.find({
        $or: [{ conta: contaOrigem }, { conta: contaDestino }],
      });

      let balanceOrigem = account[0].balance - valor;
      let balanceDestino = account[1].balance + valor;

      const idOrigem = account[0]._id;
      const idDestino = account[1]._id;

      if (account[0].agencia != account[1].agencia) {
        balanceOrigem = balanceOrigem - 8;
      }

      const accountUpdateOrigem = await contasModel.findOneAndUpdate(
        {
          _id: idOrigem,
        },
        { balance: balanceOrigem },
        { new: true, upsert: true }
      );

      const accountUpdateDestino = await contasModel.findOneAndUpdate(
        {
          _id: idDestino,
        },
        { balance: balanceDestino },
        { new: true, upsert: true }
      );

      if (!accountUpdateOrigem || !accountUpdateDestino) {
        return res.status(404).json({ msg: "Não localizou a conta!" });
      } else {
        return res.json({ balance: accountUpdateOrigem.balance });
      }
    } catch (error) {
      res.status(404).json({ msg: error });
    }
  }

  async mediaBalanceAgency(req, res) {
    try {
      const { agencia } = req.body;

      const media = await contasModel.aggregate([
        {
          $match: { agencia: agencia },
        },
        {
          $group: {
            _id: null,
            average: {
              $avg: `$balance`,
            },
          },
        },
      ]);

      if (!media) {
        return res.status(404).json({ msg: "Não localizou a agencia!" });
      } else {
        return res.json({ media: media[0].average.toFixed(2) });
      }
    } catch (error) {
      res.status(404).json({ msg: error });
    }
  }

  async clientsMorePoors(req, res) {
    try {
      const { qtde } = req.body;

      const accounts = await contasModel.aggregate([
        { $sort: { balance: 1 } },
        {
          $limit: qtde,
        },
      ]);

      if (!accounts) {
        return res.status(404).json({ msg: "Não localizou a conta!" });
      } else {
        return res.json(accounts);
      }
    } catch (error) {
      res.status(404).json({ msg: error });
    }
  }

  async clientsMoreRichs(req, res) {
    try {
      const { qtde } = req.body;

      const accounts = await contasModel.aggregate([
        { $sort: { balance: -1 } },
        {
          $limit: qtde,
        },
      ]);

      if (!accounts) {
        return res.status(404).json({ msg: "Não localizou a conta!" });
      } else {
        return res.json(accounts);
      }
    } catch (error) {
      res.status(404).json({ msg: error });
    }
  }

  async clientsPrime(req, res) {
    try {
      const accounts = await contasModel.aggregate([
        { $sort: { balance: -1 } },
        {
          $group: {
            _id: `$agencia`,
            id: {
              $first: `$_id`,
            },
          },
        },
      ]);

      accounts.forEach(async (account) => {
        const accountUpdate = await contasModel.findOneAndUpdate(
          {
            _id: account.id,
          },
          {
            agencia: 99,
          },
          { new: true, upsert: true }
        );
      });

      const accountPrivate = await contasModel.find({
        agencia: 99,
      });

      if (!accountPrivate) {
        return res.status(404).json({ msg: "Não localizou a conta!" });
      } else {
        return res.json(accountPrivate);
      }
    } catch (error) {
      res.status(404).json({ msg: error });
    }
  }
}

export default ContasController;

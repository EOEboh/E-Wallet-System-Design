const User = require("../db/models/User");
const bcrypt = require("bcrypt");
const joi = require("joi");
const Wallet = require("../db/models/wallet");

const reg_user = async (req, res) => {
  const user = new User(req.body);
  const { email } = req.body;

  if (!user) {
    res.send("error occured");
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).send("this email has already been registered");
  }

  user.password = hashedPassword;

  let wallet = Wallet.create({ balance: 0, new: true });
  // user_id: user.id;

  await user
    .save({ wallet_id: wallet.id })
    .then((user) => {
      res.status(201).send({
        success: true,
        message: "created successfully",
      });
    })
    .catch((err) => {
      res.send(err._message);
      console.log(err);
    });
};

module.exports = reg_user;

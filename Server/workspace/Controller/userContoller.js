const User = require("../Model/userModels");

exports.insertData = async (req, res) => {
  try {
    const user = new User(req.body);
    const saveuser = await user.save();
    res.status(200).json(`new user add succsessfully ${saveuser}`);
  } catch (err) {
    res.status(400).json("something went wrong " + err);
  }
};
exports.getUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
    }
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Sign-in successful", user });
  } catch (err) {
    res.status(500).json(`something went wrong on getuser api ${err}`);
  }
};

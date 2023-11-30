const { createUser, getUserByEmail } = require("./aws/DynamoDb");
const bcrypt = require("bcrypt");
const { generateJWT } = require("./jwt");
const { generateTopic, sendAlert } = require("./aws/SNS");

const router = require("express").Router();

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

function generateRandomString(length) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset.charAt(randomIndex);
  }

  return result;
}
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const id = generateRandomString(10);
    await createUser({
      id,
      name,
      email,
      password: await hashPassword(password),
    });
    await generateTopic(email, id);
    await res.status(201).json({ message: "Sucessfully created user." });
  } catch (errir) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: "User dosen't exist" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      await sendAlert(email, req.socket.remoteAddress);
      return res.status(401).json({ message: "Invalid Password" });
    }

    res.status(200).json({ token: generateJWT({ email, id: user.id }) });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

module.exports = router;

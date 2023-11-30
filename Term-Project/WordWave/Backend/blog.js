const { createPost, getPosts } = require("./aws/DynamoDb");
const uuid = require("uuid");
const multer = require("multer");
const { storeFile } = require("./aws/S3");
const { verifyJWT } = require("./jwt");
const { sendEmail } = require("./aws/SNS");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = require("express").Router();
const AWS = require("./aws/index");
const InvokeLambda = require("./aws/Lambda");

router.use(verifyJWT);

const cloudFront = new AWS.CloudFront();

async function getCloudFrontURL(key) {
  const DistributionList = await cloudFront.listDistributions().promise();
  const name = DistributionList.DistributionList.Items[0]?.DomainName;
  return "https://" + name + "/" + key;
}

router.post("/add", upload.single("file"), async (req, res) => {
  const { title, content } = req.body;
  const file = req.file;

  if (!title || !content) {
    return res.status(400).json({ error: " title, and content are required." });
  }

  try {
    const storageDetails = await storeFile(file);

    const id = uuid.v4();
    await createPost({
      id,
      title,
      content,
      imageKey: storageDetails.Key,
      imgUrl: await getCloudFrontURL(storageDetails.Key),
      userId: req.user.email,
    });

    await InvokeLambda({ title: title, content, id });

    await sendEmail(req.user.id, title);

    res.status(201).json({ message: "Sucessfully added post." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Could not create post: " + err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const a = req.query;
    const search = a?.search;

    const data = await getPosts();

    if (data) {
      if (search) {
        const queryData = data.filter((e) =>
          e.searchValues.includes(search.toLowerCase())
        );

        return res.status(200).json(queryData);
      }

      return res.status(200).json(data);
    } else {
      return res.status(404).json({ error: "Post not found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Could not retrieve post: " + err.message });
  }
});

module.exports = router;

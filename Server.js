const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use("/uploads", express.static("uploads"));

const upload = multer({ dest: "uploads/" });

app.post("/convert", upload.single("video"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `uploads/${Date.now()}.mp3`;

  ffmpeg(inputPath)
    .toFormat("mp3")
    .on("end", () => {
      fs.unlinkSync(inputPath);
      res.json({ file: outputPath });
    })
    .on("error", (err) => {
      console.error(err);
      res.status(500).send("Conversion failed");
    })
    .save(outputPath);
});

app.listen(3000, () => console.log("Server running on port 3000"));

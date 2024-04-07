import fs from "fs";
import path from "path";
import axios from "axios";
const tempDirectory = path.resolve(__dirname, "../tmp/");

import * as ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import util from "util";
const exec = util.promisify(require("child_process").exec);

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const convertFile = async (file: string) => {
  const outputName = generateRandomString(10) + ".mp4";
  const thumbnailName = generateRandomString(10) + ".jpg";
  await runCommand(file, outputName);
  await new Promise((resolve, reject) => {
    ffmpeg(path.resolve(tempDirectory, outputName))
      .screenshots({
        timestamps: ["00:00:01"],
        filename: thumbnailName,
        folder: tempDirectory,
        size: "320x240",
      })
      .on("end", function () {
        console.log("Thumbnail created");
        resolve(thumbnailName);
      })
      .on("error", function (err) {
        console.log("An error occurred: " + err.message);
        reject(err);
      });
  });
  return {
    outputName: outputName,
    thumbnailName,
  };
};
async function runCommand(file: string, outputName: string) {
  const command = `ffmpeg -i ${path.resolve(
    tempDirectory,
    file
  )} -c:v libx264 -preset slow -crf 23 -c:a aac -strict experimental -b:a 128k ${path.resolve(
    tempDirectory,
    outputName
  )}`;
  try {
    const { stdout, stderr } = await exec(command);

    console.log(`stdout: ${stdout}`);
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
  } catch (error: any) {
    console.error(`error: ${error.message}`);
  }
}

export const folderGuard = () => {
  if (!fs.existsSync(tempDirectory)) {
    fs.mkdirSync(tempDirectory, { recursive: true });
  }
};

export const generateRandomString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const fetchFile = async (prefix: string, url: string, ext: string) => {
  folderGuard();
  const response = await axios.get(url, { responseType: "stream" });
  if (response.status !== 200) {
    throw new Error(
      `Failed to fetch image: ${response.status} ${response.statusText}`
    );
  }
  const fileName = prefix + "_" + generateRandomString(10) + ext;
  const filePath = path.resolve(tempDirectory, fileName);
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(fileName));
    writer.on("error", reject);
  });
};
export const deleteFile = async (filename: string) => {
  console.log("deleting : " + path.resolve(tempDirectory, filename));
  fs.unlinkSync(path.resolve(tempDirectory, filename));
};

import fs from "fs";
import path from "path";
import axios from "axios";
const tempDirectory = path.resolve(__dirname, "../tmp/");

import * as ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const convertFile = async (file: string) => {
  const outputName = generateRandomString(10) + ".mp4";
  await new Promise((resolve, reject) => {
    ffmpeg(path.resolve(tempDirectory, file))
      .output(path.resolve(tempDirectory, outputName))
      .on("end", function () {
        console.log("conversion ended");
        resolve(path.resolve(tempDirectory, outputName));
      })
      .on("error", function (err: any) {
        console.log("error: ", err);
        reject(err);
      })
      .run();
  });
  return outputName;
};

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
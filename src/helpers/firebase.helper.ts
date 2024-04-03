import path from "path";
import { firebase } from "../configs/firebase.configs";
const tempDirectory = path.resolve(__dirname, "../tmp/");
export const uploadFileToFirebase = async (
  filename: string,
  folder: string
) => {
  const bucket = firebase.storage().bucket();
  try {
    await bucket.upload(path.resolve(tempDirectory, filename), {
      destination: folder + "/" + filename,
    });
  } catch (error) {
    console.log(error);
  }

  const fileRef = bucket.file(folder + "/" + filename);
  await fileRef.makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;
  return publicUrl;
};

import {getDownloadURL, ref, uploadBytes} from "firebase/storage";

import {storage} from "./firebase";

export const uploadImage = async (file: any, path: string) => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file[0]);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    throw error;
  }
};

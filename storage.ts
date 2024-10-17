import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";

import {firebaseApp} from "./firebase";

export const uploadImage = async (file: any, path: string) => {
  const storage = getStorage(firebaseApp);

  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file[0]);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    throw error;
  }
};

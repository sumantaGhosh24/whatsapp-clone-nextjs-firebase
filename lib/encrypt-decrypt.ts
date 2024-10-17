import CryptoJS from "crypto-js";

export const encryptWithAES = (text: string, key: string) => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

export const decryptWithAES = (text: string, key: string) => {
  const bytes = CryptoJS.AES.decrypt(text, key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

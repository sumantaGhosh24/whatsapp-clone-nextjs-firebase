"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import {Plus, UserCheck2} from "lucide-react";
import {toast} from "react-toastify";

import {Button} from "./ui/button";
import {firebaseApp} from "../firebase";
import {encryptWithAES} from "../lib/encrypt-decrypt";

interface User {
  id: string;
  avatar: string;
  bio: string;
  name: string;
  username: string;
  currentUser: string;
  setOpen: any;
}

const FindUser = ({
  id,
  avatar,
  bio,
  name,
  username,
  currentUser,
  setOpen,
}: User) => {
  const [exists, setExists] = useState(false);

  const db = getFirestore(firebaseApp);

  const unsubscribe = async () => {
    const chatQuery = query(
      collection(db, "chats"),
      where("users", "array-contains", currentUser)
    );
    onSnapshot(chatQuery, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (
          (doc.data().users[0] === currentUser && doc.data().users[1] === id) ||
          (doc.data().users[0] === id && doc.data().users[1] === currentUser)
        ) {
          setExists(true);
        }
      });
    });
  };

  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, []);

  const addChat = async (e: any, id: string) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "chats"), {
        users: [currentUser, id],
        lastMessage: serverTimestamp(),
        timestamp: serverTimestamp(),
      });
      await addDoc(collection(db, "chats", docRef.id, "messages"), {
        type: "info",
        message: encryptWithAES("chat created", docRef.id),
        timestamp: serverTimestamp(),
      });
      unsubscribe();
      setOpen(false);
      toast.success("Chat Added!", {toastId: "add-chat-success"});
    } catch (error: any) {
      toast.error(error.message, {toastId: "add-chat-error"});
    }
  };

  return (
    <div
      key={id}
      className="my-4 flex items-center justify-start rounded-md p-4 shadow-md hover:bg-green-50"
    >
      <Image
        src={avatar}
        alt={username}
        height={100}
        width={100}
        unoptimized
        className="mr-10 h-12 w-12 rounded-full object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold capitalize">{name}</h3>
        <h4 className="my-2 text-base">{username}</h4>
        <p className="text-sm font-light">{bio}</p>
      </div>
      {!exists ? (
        <Button
          type="button"
          variant="primary"
          size="icon"
          onClick={(e) => addChat(e, id)}
          className="ml-auto rounded-full"
        >
          <Plus />
        </Button>
      ) : (
        <Button
          type="button"
          variant="primary"
          size="icon"
          onClick={() =>
            toast.info("You are already friend.", {toastId: "chat-info"})
          }
          className="ml-auto rounded-full"
        >
          <UserCheck2 />
        </Button>
      )}
    </div>
  );
};

export default FindUser;

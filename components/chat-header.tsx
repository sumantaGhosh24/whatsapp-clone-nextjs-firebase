"use client";

import {useState, useEffect} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {Power, PowerOff, MoveLeft} from "lucide-react";

import {firebaseApp} from "@/firebase";

import {Button} from "./ui/button";

interface ChatHeaderType {
  messageId: string;
  currentUser: string;
}

interface ChatType {
  id: string;
  timestamp: any;
  lastMessage: any;
  users: string[];
}

interface ChatUserType {
  avatar: string;
  username: string;
  name: string;
  bio: string;
  lastLogin: any;
  online: boolean;
}

const ChatHeader = ({messageId, currentUser}: ChatHeaderType) => {
  const [chatUser, setChatUser] = useState<ChatUserType>();
  const [chat, setChat] = useState<ChatType>();

  const db = getFirestore(firebaseApp);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = async () => {
      const docSnap = await getDoc(doc(db, "chats", `${messageId}`));
      setChat({
        id: docSnap.id,
        timestamp: docSnap.data()?.timestamp,
        lastMessage: docSnap.data()?.lastMessage,
        users: docSnap.data()?.users,
      });

      const users = await docSnap.data()?.users;
      if (users) {
        const chatUser = users?.filter((el: string) => el !== currentUser);
        const docSnap = await getDoc(doc(db, "users", `${chatUser}`));
        if (docSnap.exists()) {
          setChatUser({
            avatar: docSnap.data().avatar,
            username: docSnap.data().username,
            name: docSnap.data().name,
            bio: docSnap.data().bio,
            lastLogin: docSnap.data().lastLogin,
            online: docSnap.data().online,
          });
        }
      }
    };
    return () => {
      unsubscribe();
    };
  }, [db, messageId, currentUser]);

  const backHome = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-start rounded-t-lg bg-green-500 px-5 py-3 text-white">
      <Button
        type="button"
        variant="primary"
        size="icon"
        onClick={backHome}
        className="mr-5"
      >
        <MoveLeft />
      </Button>
      <Image
        src={chatUser?.avatar || "https://placehold.co/400"}
        alt={chatUser?.username || "placehold"}
        height={100}
        width={100}
        unoptimized
        className="mr-10 h-12 w-12 rounded-full object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold capitalize">{chatUser?.name}</h3>
        <h4 className="my-2 text-sm font-bold">{chatUser?.username}</h4>
        <p className="my-2 text-sm font-light">{chatUser?.bio}</p>
      </div>
      <div className="ml-auto">
        {chatUser?.online ? (
          <Power className="text-green-500" />
        ) : (
          <PowerOff className="text-red-500" />
        )}
        <p className="my-2 text-sm">
          Last Login:{" "}
          {chatUser?.lastLogin?.toDate().toDateString() || "not login"}
        </p>
        <p className="my-2 text-sm">
          Last Message: {chat?.lastMessage?.toDate().toDateString()}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;

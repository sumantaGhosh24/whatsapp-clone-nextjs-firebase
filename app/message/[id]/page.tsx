"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";

import ChatHeader from "@/components/chat-header";
import ChatInput from "@/components/chat-input";
import ChatMessage from "@/components/chat-message";
import {firebaseApp} from "@/firebase";

interface MessageProps {
  params: {id: string};
}

interface ChatType {
  id: string;
  timestamp: any;
  lastMessage: any;
  users: string[];
}

export default function Message({params}: MessageProps) {
  const [user, setUser] = useState({
    userId: "",
    name: "",
    username: "",
    email: "",
    bio: "",
    avatar: "",
  });
  const [chat, setChat] = useState<ChatType>();

  const router = useRouter();

  const auth = getAuth();
  const db = getFirestore(firebaseApp);

  const messageId = params.id;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const docSnap = await getDoc(doc(db, "users", authUser.uid));

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser({
            userId: authUser.uid,
            name: userData.name,
            username: userData.username,
            email: authUser.email || "",
            bio: userData.bio,
            avatar: userData.avatar,
          });
        } else {
          setUser({
            userId: authUser.uid,
            name: "",
            username: "",
            email: "",
            bio: "",
            avatar: "",
          });
          router.push("/profile");
        }
      } else {
        setUser({
          userId: "",
          name: "",
          username: "",
          email: "",
          bio: "",
          avatar: "",
        });
        router.push("/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = async () => {
      const docSnap = await getDoc(doc(db, "chats", `${messageId}`));
      setChat({
        id: docSnap.id,
        timestamp: docSnap.data()?.timestamp,
        lastMessage: docSnap.data()?.lastMessage,
        users: docSnap.data()?.users,
      });
    };
    return () => {
      unsubscribe();
    };
  }, [db, messageId, router, user.userId]);

  if (typeof chat?.users === "undefined") {
    return "Loading...";
  }
  if (typeof messageId === "undefined") {
    return "Loading...";
  }
  if (chat.users[0] !== user.userId && chat.users[1] !== user.userId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-4/6 rounded-md p-8 text-center shadow-md">
          <h1 className="mb-4 text-4xl font-semibold">
            Invalid Authentication!
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            Only participants of this chat can access this page.
          </p>
          <Link href="/">
            <p className="text-green-500 hover:underline">
              Go back to the homepage
            </p>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-5">
        <div className="mx-auto max-w-5xl">
          <ChatHeader messageId={String(messageId)} currentUser={user.userId} />
          <ChatMessage
            messageId={String(messageId)}
            currentUser={user.userId}
            chatId={chat.id}
          />
          <ChatInput chat={String(messageId)} user={user.userId} />
        </div>
      </div>
    </>
  );
}

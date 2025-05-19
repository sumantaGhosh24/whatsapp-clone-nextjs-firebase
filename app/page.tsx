"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {onAuthStateChanged} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import {auth, db} from "@/firebase";
import Navbar from "@/components/navbar";
import AddChat from "@/components/add-chat";
import Chat from "@/components/chat";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState({
    userId: "",
    name: "",
    username: "",
    email: "",
    bio: "",
    avatar: "",
  });
  const [chats, setChats] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

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
            email: userData.email,
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
    const userQuery = query(
      collection(db, "chats"),
      where("users", "array-contains", user.userId)
    );
    const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
      const foundChats: any[] = [];
      querySnapshot.forEach((doc) => {
        foundChats.push({id: doc.id, ...doc.data()});
      });
      setChats(foundChats);
    });
    return () => {
      unsubscribe();
    };
  }, [db, user.userId]);

  return (
    <>
      <Navbar id={user.userId} />
      <div className="h-screen">
        <div className="mx-auto max-w-7xl p-4">
          <AddChat
            open={open}
            setOpen={setOpen}
            user={user.userId}
            username={user.username}
          />
          <div className="">
            {chats.length === 0 ? (
              <p className="text-center font-bold text-red-800">
                No chat found.
              </p>
            ) : (
              chats.map((chat) => (
                <Chat key={chat.id} chat={chat} currentUser={user.userId} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

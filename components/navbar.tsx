"use client";

import {useRouter} from "next/navigation";
import Link from "next/link";
import {getAuth, signOut} from "firebase/auth";
import {doc, getFirestore, updateDoc} from "firebase/firestore";
import {toast} from "react-toastify";

import {firebaseApp} from "@/firebase";

const Navbar = ({id}: {id: string}) => {
  const router = useRouter();

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  const handleLogout = async () => {
    try {
      const userDocRef = doc(db, "users", id);
      await updateDoc(userDocRef, {
        online: false,
      });
      await signOut(auth);

      toast.success("Logout Successful!", {toastId: "logout-success"});

      router.push("/login");
    } catch (error: any) {
      toast.error(error.message, {toastId: "logout-error"});
    }
  };

  return (
    <nav className="bg-green-500 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">WhatssappClone</h1>
        <ul className="flex space-x-4">
          <li>
            <Link href="/">
              <p className="text-white">Chat</p>
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <p className="text-white">Profile</p>
            </Link>
          </li>
          <li>
            <Link href="/">
              <button className="text-white" onClick={handleLogout}>
                Logout
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

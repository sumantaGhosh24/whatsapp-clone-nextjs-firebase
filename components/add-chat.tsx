"use state";

import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {MessageSquarePlus} from "lucide-react";
import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import {firebaseApp} from "@/firebase";

import {Button} from "./ui/button";
import FindUser from "./find-user";

interface AddChatProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  user: string;
  username: string;
}

const AddChat = ({open, setOpen, user, username}: AddChatProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const db = getFirestore(firebaseApp);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const usersRef = collection(db, "users");
    const userQuery = query(
      usersRef,
      where("username", "!=", username),
      where("username", ">=", searchQuery),
      limit(4)
    );
    const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
      const foundUsers: any[] = [];
      querySnapshot.forEach((doc) => {
        foundUsers.push({id: doc.id, ...doc.data()});
      });
      setSearchResults(foundUsers);
    });
    return () => {
      unsubscribe();
    };
  }, [searchQuery]);

  return (
    <>
      <button
        className="fixed bottom-14 right-14 rounded-full bg-green-500 p-4 text-white hover:bg-green-600"
        onClick={() => setOpen(true)}
      >
        <MessageSquarePlus />
      </button>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        } bg-black/90 transition-opacity duration-300`}
      >
        <div className="w-3/4 rounded bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold">Search User</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full rounded border border-gray-300 p-2"
                placeholder="Enter username"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </form>
          {searchResults.length < 1 ? (
            <p className="pt-5 text-sm font-bold text-red-700">
              No user found.
            </p>
          ) : (
            searchResults.map((search) => (
              <FindUser
                key={search.id}
                currentUser={user}
                id={search.id}
                avatar={search.avatar}
                bio={search.bio}
                name={search.name}
                username={search.username}
                setOpen={setOpen}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AddChat;

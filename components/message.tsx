import Image from "next/image";

import {decryptWithAES} from "@/lib/encrypt-decrypt";

interface MessageType {
  type: string;
  user: string;
  message: string;
  timestamp: any;
  currentUser: string;
  chatUserAvatar: any;
  chat: string;
}

const Message = ({
  message,
  timestamp,
  type,
  user,
  currentUser,
  chatUserAvatar,
  chat,
}: MessageType) => {
  return (
    <>
      {type === "info" && (
        <div className="my-5 flex items-start justify-center">
          <div className="rounded-lg bg-gray-500 px-4 py-2 text-white">
            <span className="text-xs">
              {timestamp?.toDate().toDateString()}
            </span>{" "}
            <br />
            {decryptWithAES(message, chat)}
          </div>
        </div>
      )}
      {type === "message" &&
        (user === currentUser ? (
          <div className="my-5 flex items-start justify-end">
            <div className="rounded-lg bg-green-500 px-4 py-2 text-white">
              <span className="text-xs">
                {timestamp?.toDate().toDateString()}
              </span>{" "}
              <br />
              {decryptWithAES(message, chat)}
            </div>
          </div>
        ) : (
          <div className="my-5 flex items-start">
            <Image
              height={50}
              width={50}
              unoptimized
              src={chatUserAvatar}
              alt="user"
              className="mr-2 mt-2 h-8 w-8 rounded-full object-cover"
            />
            <div className="rounded-lg bg-gray-400 px-4 py-2 text-white">
              <span className="text-xs">
                {timestamp?.toDate().toDateString()}
              </span>{" "}
              <br />
              {decryptWithAES(message, chat)}
            </div>
          </div>
        ))}
    </>
  );
};

export default Message;

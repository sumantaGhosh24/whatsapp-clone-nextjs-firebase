"use client";

import {useState, useEffect, ChangeEvent} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {onAuthStateChanged} from "firebase/auth";
import {doc, getDoc, serverTimestamp, setDoc} from "firebase/firestore";
import {toast} from "react-toastify";

import {auth, db} from "@/firebase";
import {uploadImage} from "@/storage";
import {ProfileValidation} from "@/lib/validation/user";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {Input} from "./ui/input";
import {Button} from "./ui/button";
import {Textarea} from "./ui/textarea";

const ProfileForm = () => {
  const [user, setUser] = useState({
    userId: "",
    name: "",
    username: "",
    email: "",
    bio: "",
    avatar: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const {userId, name, username, bio, avatar} = user;

  const router = useRouter();

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      avatar,
      bio,
      name,
      username,
    },
    values: {
      avatar,
      bio,
      name,
      username,
    },
  });

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
            email: authUser.email || "",
            bio: "",
            avatar: "",
          });
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

  const onSubmit = async (values: z.infer<typeof ProfileValidation>) => {
    setLoading(true);

    try {
      values.avatar = await uploadImage(files, user.userId);

      await setDoc(doc(db, "users", userId), {
        avatar: values.avatar,
        bio: values.bio,
        name: values.name,
        username: values.username,
        timestamp: serverTimestamp(),
      });

      toast.success("Profile Updated Successful!", {
        toastId: "profile-success",
      });

      router.push("/");
    } catch (error: any) {
      toast.error(error.message, {toastId: "profile-error"});
    } finally {
      setLoading(false);
    }
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));
      if (!file.type.includes("image")) return;
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="avatar"
            render={({field}) => (
              <FormItem className="mb-4 flex items-center gap-4">
                <FormLabel className="flex h-24 w-24 items-center justify-center rounded-full bg-black">
                  {field.value && (
                    <Image
                      src={field.value}
                      alt="profile_icon"
                      width={100}
                      height={100}
                      unoptimized
                      priority
                      className="rounded-full object-cover"
                    />
                  )}
                </FormLabel>
                <FormControl className="flex-1 text-base font-semibold text-gray-200">
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder="Add profile photo"
                    className="cursor-pointer border-none bg-transparent outline-none file:text-green-500"
                    onChange={(e) => handleImage(e, field.onChange)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem className="mb-4">
                <FormLabel className="block text-gray-600">Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="w-full rounded border border-gray-300 p-2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({field}) => (
              <FormItem className="mb-4">
                <FormLabel className="block text-gray-600">Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="w-full rounded border border-gray-300 p-2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({field}) => (
              <FormItem className="mb-4">
                <FormLabel className="block text-gray-600">Bio</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full rounded border border-gray-300 p-2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Processing..." : "Update Profile"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/")}
            className="ml-3"
          >
            Home
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProfileForm;

"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {toast} from "react-toastify";

import {firebaseApp} from "@/firebase";
import {LoginValidation} from "@/lib/validation/user";

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

const LoginForm = () => {
  const router = useRouter();

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        router.push("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginValidation>>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginValidation>) => {
    setLoading(true);

    try {
      const {email, password} = values;

      const response = await signInWithEmailAndPassword(auth, email, password);

      const userDocRef = doc(db, "users", response.user.uid);

      await updateDoc(userDocRef, {
        online: true,
        lastLogin: serverTimestamp(),
      });

      toast.success("Login Successful!", {toastId: "login-success"});

      router.push("/");
    } catch (error: any) {
      toast.error(error.message, {toastId: "login-error"});
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem className="mb-4">
                <FormLabel className="block text-gray-600">
                  Email Address
                </FormLabel>
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
            name="password"
            render={({field}) => (
              <FormItem className="mb-4">
                <FormLabel className="block text-gray-600">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="w-full rounded border border-gray-300 p-2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Processing..." : "Login"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;

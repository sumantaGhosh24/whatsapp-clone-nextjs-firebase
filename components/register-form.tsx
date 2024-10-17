"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {toast} from "react-toastify";

import {firebaseApp} from "@/firebase";
import {RegisterValidation} from "@/lib/validation/user";

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

const RegisterForm = () => {
  const router = useRouter();

  const auth = getAuth(firebaseApp);

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

  const form = useForm<z.infer<typeof RegisterValidation>>({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      email: "",
      password: "",
      cf_password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterValidation>) => {
    setLoading(true);

    try {
      const {email, password} = values;

      await createUserWithEmailAndPassword(auth, email, password);

      toast.success("Register Successful!", {toastId: "register-success"});

      router.push("/");
    } catch (error: any) {
      toast.error(error.message, {toastId: "register-error"});
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
          <FormField
            control={form.control}
            name="cf_password"
            render={({field}) => (
              <FormItem className="mb-4">
                <FormLabel className="block text-gray-600">
                  Confirm Password
                </FormLabel>
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
            {loading ? "Processing..." : "Register"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default RegisterForm;

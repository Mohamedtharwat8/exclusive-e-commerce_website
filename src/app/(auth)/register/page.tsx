"use client";
import login from "@/assets/images/login.jpg";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/schemas/validationSchemas";
import { RegisterPayload } from "@/types/types";
import { handleRegister } from "@/services/registerAPI";
import { useActionState, useEffect, useState } from "react";
import { Eye, EyeOffIcon } from "lucide-react";

// Define proper initial state type
interface FormState {
  success: boolean;
  error: any;
  message: string | null;
}

const initialState: FormState = {
  success: false,
  error: {},
  message: null,
};

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fix 1: Use useActionState correctly
  const [state, formAction, isPending] = useActionState(
    handleRegister,
    initialState
  );

  const form = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
  });

  console.log("formActions", state);

  // Fix 2: Handle form submission properly
  const onSubmit = async (data: RegisterPayload) => {
    setIsSubmitting(true);

    // Create FormData from the form values
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("rePassword", data.rePassword);
    formData.append("phone", data.phone);

    // Call the server action
    formAction(formData);
  };

  // Fix 3: Proper useEffect for handling state changes
  useEffect(() => {
    if (state) {
      if (state.success && state.message) {
        toast.success(state.message, {
          position: "top-center",
        });
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else if (!state.success && state.message) {
        toast.error(state.message, {
          position: "top-center",
        });
      }
    }
  }, [state, router]);

  // Fix 4: Reset submitting state when state changes
  useEffect(() => {
    if (state) {
      setIsSubmitting(false);
    }
  }, [state]);

  return (
    <section className="py-10">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <Image
              src={login}
              alt="login"
              className="w-full h-[37.50rem]"
              width={919}
              height={706}
            />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-4 py-8">
            <h1 className="font-medium text-4xl mb-4 text-center">
              Create new account in Exclusive
            </h1>
            <p className="text-center">Enter your details below</p>
            <Form {...form}>
              {/* Fix 5: Use onSubmit instead of action */}
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="gehad alaa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="example@.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="********"
                            {...field}
                            type={showPassword ? "text" : "password"}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOffIcon size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* repassword  */}
                <FormField
                  control={form.control}
                  name="rePassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="********"
                            {...field}
                            type={showRePassword ? "text" : "password"}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowRePassword(!showRePassword)}
                          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                        >
                          {showRePassword ? (
                            <EyeOffIcon size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="0123456789" {...field} type="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center">
                  <Button
                    type="submit"
                    variant="destructive"
                    className="cursor-pointer"
                    disabled={isSubmitting || isPending}
                  >
                    {isSubmitting || isPending
                      ? "Creating Account..."
                      : "Sign Up"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}

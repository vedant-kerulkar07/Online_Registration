// src/pages/ApplyLeaveForm.jsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";

import z from "zod";

import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";

import { Button } from "@/components/ui/button";

import { motion } from "framer-motion";

import {
  CheckCircle2,
  Mail,
  User,
  Weight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

// Validation
const registrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  contactNumber: z.string().min(10, "Contact number is required"),
  weightCategory: z.string().min(1, "Select weight category"),
  address: z.string().min(1, "Address is required"),
  hand: z.string().min(1, "Select hand"),
});

export default function OnlineResistrationForm() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      weightCategory: "",
      address: "",
      hand: "",
    },
  });

  //  Watch weight
  const weight = form.watch("weightCategory");

  const getAmount = () => {
    if (weight === "75kg+") return 149;
    if (weight) return 149;
    return "";
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);

      const amount = values.weightCategory === "75kg+" ? 149 : 149;

      // ── Step 1: Create Order
      const orderRes = await fetch(
        `${getEnv("VITE_API_URL")}/payment/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            customerName: `${values.firstName} ${values.lastName}`,
            customerEmail: values.email,
            customerPhone: values.contactNumber,
          }),
        }
      );

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        return showToast("error", orderData.message || "Failed to create order");
      }

      const { payment_session_id, order_id } = orderData;

      // ── Store values in sessionStorage (because page will redirect) 

      sessionStorage.setItem("order_id", order_id);
      sessionStorage.setItem("registrationData", JSON.stringify({
        ...values,
        amount: amount,   
      }));

      // ── Step 2: Open Cashfree 
      const { load } = await import("@cashfreepayments/cashfree-js");

      const cashfree = await load({
        mode: getEnv("VITE_NODE_ENV") === "production" ? "production" : "sandbox",
      });

      cashfree.checkout({
        paymentSessionId: payment_session_id,
        redirectTarget: "_self", // page redirects to return_url after payment
      });

    } catch (err) {
      console.error(err);
      showToast("error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white p-3 sm:p-4 md:p-10 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-yellow-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 blur-3xl rounded-full" />

      {/* Logo */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 z-20">
        <img
          src="/logo.jpeg"
          alt="Logo"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-40 md:h-40 rounded-full border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.5)] object-cover"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 mt-20 sm:mt-20 md:mt-10 px-2"
        >
          <h1 className="pb-2 sm:pb-3 text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500 leading-tight">
            Ahilyanagar Armwrestling
          </h1>

          <div className="h-1 w-20 sm:w-24 bg-yellow-500 mx-auto mt-3 sm:mt-4 rounded-full" />

          <p className="text-gray-400 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-medium">
            Official Athlete Registration Portal
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative group"
        >

          {/* Glow Border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>

          <div className="relative bg-slate-900/80 backdrop-blur-xl border border-yellow-500/20 rounded-2xl shadow-2xl overflow-hidden">

            <div className="p-4 sm:p-6 md:p-8">

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 sm:space-y-8"
                >

                  {/* Personal Details */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                      <User size={18} />

                      <h2 className="text-sm font-semibold uppercase tracking-wider">
                        Personal Details
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                      {["firstName", "middleName", "lastName"].map((name) => (
                        <FormField
                          key={name}
                          control={form.control}
                          name={name}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold text-gray-400 uppercase">
                                {name.replace(/([A-Z])/g, " $1").trim()}
                              </FormLabel>

                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={
                                    name.charAt(0).toUpperCase() +
                                    name.slice(1)
                                  }
                                  className="h-11 sm:h-12 bg-transparent border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500/50 focus:ring-yellow-500/20 focus:bg-transparent rounded-lg transition-all text-sm sm:text-base"
                                />
                              </FormControl>

                              <FormMessage className="text-xs text-rose-500" />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </section>

                  {/* Contact Information */}
                  <section className="space-y-4">

                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                      <Mail size={18} />

                      <h2 className="text-sm font-semibold uppercase tracking-wider">
                        Contact Information
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

                      {/* Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-gray-400 uppercase">
                              Email Address
                            </FormLabel>

                            <FormControl>
                              <Input
                                type="email"
                                placeholder="athlete@example.com"
                                {...field}
                                className="h-11 sm:h-12 bg-transparent border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500/50 focus:bg-transparent rounded-lg transition-all text-sm sm:text-base"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Contact Number */}
                      <FormField
                        control={form.control}
                        name="contactNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-gray-400 uppercase">
                              Phone Number
                            </FormLabel>

                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="+91 98765 43210"
                                {...field}
                                className="h-11 sm:h-12 bg-transparent border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500/50 focus:bg-transparent rounded-lg transition-all text-sm sm:text-base"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  {/* Competition Details */}
                  <section className="space-y-4">

                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                      <Weight size={18} />

                      <h2 className="text-sm font-semibold uppercase tracking-wider">
                        Competition Class
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

                      {/* Weight Category */}
                      <FormField
                        control={form.control}
                        name="weightCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-gray-400 uppercase">
                              Weight Category
                            </FormLabel>

                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="h-11 sm:h-12 bg-transparent border-gray-700 text-white focus:ring-yellow-500/20 focus:border-yellow-500/50 rounded-lg text-sm sm:text-base">
                                <SelectValue placeholder="Select your weight" />
                              </SelectTrigger>

                              <SelectContent className="bg-slate-900 text-white border-gray-700">
                                <SelectItem value="Below 60kg">
                                  Below 60kg
                                </SelectItem>

                                <SelectItem value="Below 75kg">
                                  Below 75kg
                                </SelectItem>

                                <SelectItem value="Above 75kg+">
                                  Above 75kg+
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Hand */}
                      <FormField
                        control={form.control}
                        name="hand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-gray-400 uppercase">
                              Primary Hand
                            </FormLabel>

                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="h-11 sm:h-12 bg-transparent border-gray-700 text-white focus:ring-yellow-500/20 focus:border-yellow-500/50 rounded-lg text-sm sm:text-base">
                                <SelectValue placeholder="Select hand" />
                              </SelectTrigger>

                              <SelectContent className="bg-slate-900 text-white border-gray-700">
                                <SelectItem value="Right">
                                  Right Hand
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  {/* Address & Fee */}
                  <section className="pt-4 space-y-4 border-t border-white/5">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-end">

                      {/* Address */}
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-gray-400 uppercase">
                              Residence Address
                            </FormLabel>

                            <FormControl>
                              <Input
                                {...field}
                                placeholder="City, State"
                                className="h-11 sm:h-12 bg-transparent border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500/50 focus:bg-transparent rounded-lg text-sm sm:text-base"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Fee */}
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-yellow-400 uppercase">
                          Registration Fee
                        </FormLabel>

                        <div className="relative">
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-yellow-400 font-bold">
                            ₹
                          </div>

                          <Input
                            value={getAmount()}
                            readOnly
                            className="h-11 sm:h-12 bg-yellow-500/10 border-yellow-500/30 text-yellow-300 font-bold pl-8 rounded-lg cursor-not-allowed text-sm sm:text-base"
                          />
                        </div>
                      </FormItem>
                    </div>
                  </section>

                  {/* Submit Button */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="pt-2 sm:pt-4"
                  >
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 sm:h-14 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black text-sm sm:text-lg uppercase tracking-widest rounded-xl shadow-[0_0_25px_rgba(234,179,8,0.4)] transition-all flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <div className="h-5 w-5 border-2 border-black/30 border-t-black animate-spin rounded-full" />
                      ) : (
                        <>
                          <CheckCircle2 size={20} />
                          Complete Registration
                        </>
                      )}
                    </Button>

                    <p className="text-center text-gray-500 text-[11px] sm:text-xs mt-4 px-2">
                      By clicking register, you agree to the tournament rules
                      and safety guidelines.
                    </p>
                  </motion.div>

                </form>
              </Form>

            </div>
          </div>
        </motion.div>
      </div>
<div className="hidden md:flex fixed bottom-8 right-8 z-50 items-center gap-3 px-5 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold text-sm rounded-full shadow-[0_0_25px_rgba(234,179,8,0.5)]
         animate-bounce cursor-pointer
         hover:scale-105 transition-transform"
  onClick={() => window.open('https://instagram.com/nagar_armwrestling', '_blank')}
>
  {/* Instagram SVG icon */}
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
       viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07
      3.252.148 4.771 1.691 4.919 4.919.058 1.265.069
      1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149
      3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07
      -4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149
      -4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07
      -4.849 0-3.204.013-3.583.07-4.849.149-3.227
      1.664-4.771 4.919-4.919 1.266-.057 1.645-.069
      4.849-.069zM12 0C8.741 0 8.333.014 7.053.072
      2.695.272.273 2.69.073 7.052.014 8.333 0 8.741
      0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618
      6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259
      0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618
      6.979-6.98.059-1.28.073-1.689.073-4.948
      0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617
      -6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0
      5.838a6.162 6.162 0 100 12.324 6.162 6.162 0
      000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406
      -11.845a1.44 1.44 0 100 2.881 1.44 1.44 0
      000-2.881z"/>
  </svg>
  For more updates, follow <span className="underline underline-offset-2">@nagar_armwrestling</span>
</div>

{/* MOBILE: static banner after the form card */}
<div
  className="flex md:hidden items-center justify-center gap-3
           mt-8 px-5 py-4 w-full
           bg-gradient-to-r from-yellow-400 to-amber-500
           text-black font-bold text-sm rounded-2xl
           shadow-[0_0_20px_rgba(234,179,8,0.4)]
           cursor-pointer"
  onClick={() => window.open('https://instagram.com/nagar_armwrestling', '_blank')}
>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
       viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07
      3.252.148 4.771 1.691 4.919 4.919.058 1.265.069
      1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149
      3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07
      -4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149
      -4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07
      -4.849 0-3.204.013-3.583.07-4.849.149-3.227
      1.664-4.771 4.919-4.919 1.266-.057 1.645-.069
      4.849-.069zM12 0C8.741 0 8.333.014 7.053.072
      2.695.272.273 2.69.073 7.052.014 8.333 0 8.741
      0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618
      6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259
      0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618
      6.979-6.98.059-1.28.073-1.689.073-4.948
      0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617
      -6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0
      5.838a6.162 6.162 0 100 12.324 6.162 6.162 0
      000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406
      -11.845a1.44 1.44 0 100 2.881 1.44 1.44 0
      000-2.881z"/>
  </svg>
  For more updates, follow <span className="underline underline-offset-2 ml-1">@nagar_armwrestling</span>
</div>

    </div>
  );
}
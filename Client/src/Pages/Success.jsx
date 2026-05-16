// // src/pages/Success.jsx
// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { CheckCircle2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// const Success = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black px-4">
//        {/* Logo */}
//       <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 z-20">
//         <img
//           src="/logo.jpeg"
//           alt="Logo"
//           className="w-20 h-20 sm:w-24 sm:h-24 md:w-40 md:h-40 rounded-full border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.5)] object-cover"
//         />
//       </div>
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9, y: 40 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-lg"
//       >
//         <Card className="w-full rounded-3xl shadow-2xl bg-slate-900/90 backdrop-blur-xl text-center text-white border border-yellow-500/20 overflow-hidden">
          
//           <CardContent className="flex flex-col items-center space-y-8 py-14 px-8">
            
//             {/* Success Icon */}
//             <div className="relative">
//               <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full" />
              
//               <CheckCircle2 className="relative w-24 h-24 text-yellow-400 animate-bounce" />
//             </div>

//             {/* Title & Subtitle */}
//             <div className="space-y-3">
//               <h2 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">
//                 Registration Successful!
//               </h2>

//               <p className="text-gray-400 text-base leading-relaxed">
//                 Your payment has been completed successfully.
//                 <br />
//                 Welcome to Ahilyanagar Armwrestling Championship.
//               </p>
//             </div>

//             {/* Success Badge */}
//             <div className="px-5 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-semibold tracking-wide">
//               Payment Verified ✓
//             </div>

//             {/* Button */}
//             <Button
//               className="w-full h-12 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold rounded-xl text-lg shadow-[0_0_20px_rgba(234,179,8,0.35)]"
//               onClick={() => navigate("/")}
//             >
//               Back to Home
//             </Button>

//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// };

// export default Success;


// src/pages/Success.jsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getEnv } from "@/helpers/getEnv"; // adjust path

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [verifyStatus, setVerifyStatus] = useState("verifying"); // "verifying" | "success" | "failed"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const order_id =
        searchParams.get("order_id") || sessionStorage.getItem("order_id");
      const registrationData = JSON.parse(
        sessionStorage.getItem("registrationData") || "{}"
      );

      if (!order_id) {
        setVerifyStatus("failed");
        setMessage("Missing order info. Please contact support.");
        return;
      }

      try {
        const verifyRes = await fetch(
          `${getEnv("VITE_API_URL")}/payment/verify`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id, registrationData }),
          }
        );

        const verifyData = await verifyRes.json();

        sessionStorage.removeItem("order_id");
        sessionStorage.removeItem("registrationData");

        if (verifyRes.ok && verifyData.success) {
          setVerifyStatus("success");
          setMessage(verifyData.message || "Registration successful!");
        } else {
          setVerifyStatus("failed");
          setMessage(verifyData.message || "Payment verification failed.");
        }

      } catch (err) {
        console.error(err);
        setVerifyStatus("failed");
        setMessage("Something went wrong during verification.");
      }
    };

    verifyPayment();
  }, []);

  // ── Verifying State ──────────────────────────────────────────────────────────
  if (verifyStatus === "verifying") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black px-4">
        <div className="flex flex-col items-center gap-4 text-white">
          <Loader2 className="w-16 h-16 text-yellow-400 animate-spin" />
          <p className="text-lg font-semibold text-gray-300">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  // ── Failed State ─────────────────────────────────────────────────────────────
  if (verifyStatus === "failed") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="w-full rounded-3xl shadow-2xl bg-slate-900/90 backdrop-blur-xl text-center text-white border border-red-500/20 overflow-hidden">
            <CardContent className="flex flex-col items-center space-y-8 py-14 px-8">

              <XCircle className="w-24 h-24 text-red-400" />

              <div className="space-y-3">
                <h2 className="text-4xl font-extrabold text-red-400">
                  Payment Failed
                </h2>
                <p className="text-gray-400 text-base leading-relaxed">{message}</p>
              </div>

              <Button
                className="w-full h-12 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl text-lg"
                onClick={() => navigate("/")}
              >
                Try Again
              </Button>

            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ── Success State ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black px-4">

      {/* Logo */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 z-20">
        <img
          src="/logo.jpeg"
          alt="Logo"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-40 md:h-40 rounded-full border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.5)] object-cover"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="w-full rounded-3xl shadow-2xl bg-slate-900/90 backdrop-blur-xl text-center text-white border border-yellow-500/20 overflow-hidden">
          <CardContent className="flex flex-col items-center space-y-8 py-14 px-8">

            {/* Success Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full" />
              <CheckCircle2 className="relative w-24 h-24 text-yellow-400 animate-bounce" />
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-3">
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Registration Successful!
              </h2>
              <p className="text-gray-400 text-base leading-relaxed">
                Your payment has been completed successfully.
                <br />
                Welcome to Ahilyanagar Armwrestling Championship.
              </p>
            </div>

            {/* Success Badge */}
            <div className="px-5 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-semibold tracking-wide">
              Payment Verified ✓
            </div>

            {/* Button */}
            <Button
              className="w-full h-12 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold rounded-xl text-lg shadow-[0_0_20px_rgba(234,179,8,0.35)]"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Success;
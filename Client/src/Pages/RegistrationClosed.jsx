import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, MapPin, Calendar, AlertTriangle } from "lucide-react";

export default function RegistrationClosed() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-6">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,160,23,0.18),transparent_60%)]" />

      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500 blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-red-600 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl w-full"
      >
        <Card className="bg-black/90 border-2 border-yellow-500 shadow-[0_0_40px_rgba(212,160,23,0.3)] rounded-3xl overflow-hidden">
          <CardContent className="p-10 md:p-16 text-center">

            {/* Icon */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
              }}
              className="flex justify-center mb-8"
            >
              <div className="w-24 h-24 rounded-full bg-yellow-500/10 border border-yellow-500 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-black uppercase tracking-wide"
            >
              <span className="text-yellow-500">
                Ahilyanagar Arm Wrestling
              </span>
            </motion.h1>

            <h2 className="mt-4 text-2xl md:text-4xl font-extrabold text-white">
              Online Registration Closed
            </h2>

            <div className="flex justify-center mt-6">
              <div className="px-4 py-2 rounded-full border border-red-500 bg-red-500/10 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-300 font-semibold">
                  Online Entries No Longer Accepted
                </span>
              </div>
            </div>

            <p className="mt-8 text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Missed the online registration?
              <span className="text-yellow-500 font-bold">
                {" "}Don't worry!
              </span>
              <br />
              You can still register offline at the venue on
              <span className="text-yellow-500 font-bold">
                {" "}21 June 2026.
              </span>
            </p>

            <div className="grid md:grid-cols-2 gap-5 mt-10">

              <div className="border border-yellow-500/30 rounded-xl p-5 bg-yellow-500/5">
                <Calendar className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-white font-bold text-lg">
                  Tournament Date
                </h3>
                <p className="text-yellow-500 font-extrabold text-2xl">
                  21 June 2026
                </p>
              </div>

              <div className="border border-yellow-500/30 rounded-xl p-5 bg-yellow-500/5">
                <MapPin className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-white font-bold text-lg">
                  Venue
                </h3>
                <p className="text-yellow-500 font-semibold">
                  Being Healthy Gym
                </p>
                <p className="text-gray-400 text-sm">
                  Near Surabhi Hospital,
                  Sambhajinagar Road,
                  Ahilyanagar
                </p>
              </div>

            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mt-10"
            >
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-8 py-6"
              >
                Register Offline at Venue
              </Button>
            </motion.div>

            <p className="mt-8 text-gray-500 uppercase tracking-[4px] font-bold">
              Come • Compete • Conquer
            </p>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
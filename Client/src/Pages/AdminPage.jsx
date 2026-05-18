import { useEffect, useState } from "react";
import { getEnv } from "@/helpers/getEnv";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { motion } from "framer-motion";

import {
  Users,
  IndianRupee,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${getEnv("VITE_API_URL")}/registration/admin`
      );

      const data = await res.json();

      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Total Revenue
  const totalRevenue = users.reduce(
    (acc, user) => acc + Number(user.amount || 0),
    0
  );

  // PDF Download
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text(
      "Ahilyanagar Armwrestling Championship",
      14,
      20
    );

    doc.setFontSize(14);
    doc.text("Registration Report", 14, 30);

    // Table
    autoTable(doc, {
      startY: 40,

      head: [
        [
          "First Name",
          "Last Name",
          "Email",
          "Phone",
          "Weight",
          "Hand",
          "Amount",
          "Payment",
        ],
      ],

      body: users.map((user) => [
        user.firstName,
        user.lastName,
        user.email,
        user.contactNumber,
        user.weightCategory,
        user.hand,
        `₹${user.amount}`,
        user.paymentStatus,
      ]),

      styles: {
        fontSize: 9,
      },

      headStyles: {
        fillColor: [234, 179, 8],
      },
    });

    // Save PDF
    doc.save("registrations-report.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black p-4 md:p-8 text-white">
      
      {/* Logo */}
      {/* <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 z-20">
        <img
          src="/logo.jpeg"
          alt="Logo"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.5)] object-cover"
        />
      </div> */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto "
      >
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>

            <p className="text-gray-400 mt-3 text-lg">
              Ahilyanagar Armwrestling Championship
            </p>
          </div>

          {/* Download Button */}
          <Button
            onClick={downloadPDF}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold rounded-xl h-12 px-6 shadow-[0_0_20px_rgba(234,179,8,0.35)]"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Total Users */}
          <Card className="bg-slate-900/80 border border-yellow-500/20 backdrop-blur-xl rounded-3xl shadow-[0_0_30px_rgba(234,179,8,0.08)]">
            <CardContent className="p-6 flex items-center justify-between">
              
              <div>
                <p className="text-gray-400 text-sm">
                  Total Registrations
                </p>

                <h2 className="text-4xl font-bold text-yellow-400 mt-2">
                  {users.length}
                </h2>
              </div>

              <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                <Users className="w-8 h-8 text-yellow-400" />
              </div>

            </CardContent>
          </Card>

          {/* Revenue */}
          <Card className="bg-slate-900/80 border border-yellow-500/20 backdrop-blur-xl rounded-3xl shadow-[0_0_30px_rgba(234,179,8,0.08)]">
            <CardContent className="p-6 flex items-center justify-between">
              
              <div>
                <p className="text-gray-400 text-sm">
                  Total Revenue
                </p>

                <h2 className="text-4xl font-bold text-yellow-400 mt-2">
                  ₹{totalRevenue}
                </h2>
              </div>

              <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                <IndianRupee className="w-8 h-8 text-yellow-400" />
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card className="bg-slate-900/90 border border-yellow-500/20 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          
          <CardContent className="p-0">
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  
                  <TableHeader>
                    <TableRow className="border-b border-yellow-500/20 bg-yellow-500/10 hover:bg-yellow-500/10">
                      
                      <TableHead className="text-yellow-400 font-bold">
                        First Name
                      </TableHead>

                      <TableHead className="text-yellow-400 font-bold">
                        Last Name
                      </TableHead>

                      <TableHead className="text-yellow-400 font-bold">
                        Email
                      </TableHead>

                      <TableHead className="text-yellow-400 font-bold">
                        Phone
                      </TableHead>

                      <TableHead className="text-yellow-400 font-bold">
                        Weight
                      </TableHead>

                      <TableHead className="text-yellow-400 font-bold">
                        Hand
                      </TableHead>

                      <TableHead className="text-yellow-400 font-bold">
                        Amount
                      </TableHead>

                      <TableHead className="text-yellow-400 font-bold">
                        Payment
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user._id}
                        className="border-b border-slate-800 hover:bg-slate-800/40 transition"
                      >
                        <TableCell className="text-white font-medium">
                          {user.firstName}
                        </TableCell>

                        <TableCell className="text-white">
                          {user.lastName}
                        </TableCell>

                        <TableCell className="text-gray-300">
                          {user.email}
                        </TableCell>

                        <TableCell className="text-gray-300">
                          {user.contactNumber}
                        </TableCell>

                        <TableCell className="text-gray-300">
                          {user.weightCategory}
                        </TableCell>

                        <TableCell className="text-gray-300">
                          {user.hand}
                        </TableCell>

                        <TableCell className="text-yellow-400 font-semibold">
                          ₹{user.amount}
                        </TableCell>

                        <TableCell>
                          <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold">
                            {user.paymentStatus}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminPage;
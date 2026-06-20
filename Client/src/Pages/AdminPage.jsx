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
  Filter,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const WEIGHT_CATEGORIES = [
  "All",
  "Below 60kg",
  "Below 75kg",
  "Above 75kg+",
];

const getNetAmount = (amount) => {
  return (Number(amount) - 3).toFixed(2);
};

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState("All");

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

  // Filtered users based on selected weight category
  const filteredUsers =
    selectedWeight === "All"
      ? users
      : users.filter((user) => user.weightCategory === selectedWeight);

  // Total Revenue of filtered users
  const totalRevenue = filteredUsers.reduce(
    (acc, user) => acc + Number(getNetAmount(user.amount || 0)),
    0
  ).toFixed(2);

  // PDF Download — uses filteredUsers
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Ahilyanagar Armwrestling Championship", 14, 20);

    doc.setFontSize(14);
    doc.text("Registration Report", 14, 30);

    if (selectedWeight !== "All") {
      doc.setFontSize(11);
      doc.setTextColor(150, 120, 0);
      doc.text(`Weight Category: ${selectedWeight}`, 14, 38);
      doc.setTextColor(0, 0, 0);
    }

    autoTable(doc, {
      startY: selectedWeight !== "All" ? 46 : 40,

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

      body: filteredUsers.map((user) => [
        user.firstName,
        user.lastName,
        user.email,
        user.contactNumber,
        user.weightCategory,
        user.hand,
        `₹${getNetAmount(user.amount)}`,
        user.paymentStatus,
      ]),

      styles: {
        fontSize: 9,
      },

      headStyles: {
        fillColor: [234, 179, 8],
      },
    });

    const fileName =
      selectedWeight === "All"
        ? "registrations-report.pdf"
        : `registrations-${selectedWeight.replace(/[^a-z0-9]/gi, "_")}.pdf`;

    doc.save(fileName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black p-4 md:p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
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
            {selectedWeight !== "All" && (
              <span className="ml-2 text-xs bg-black/20 px-2 py-0.5 rounded-full">
                {selectedWeight}
              </span>
            )}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Total Users */}
          <Card className="bg-slate-900/80 border border-yellow-500/20 backdrop-blur-xl rounded-3xl shadow-[0_0_30px_rgba(234,179,8,0.08)]">
            <CardContent className="p-6 flex items-center justify-between">

              <div>
                <p className="text-gray-400 text-sm">
                  {selectedWeight === "All"
                    ? "Total Registrations"
                    : `Registrations · ${selectedWeight}`}
                </p>

                <h2 className="text-4xl font-bold text-yellow-400 mt-2">
                  {filteredUsers.length}
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
                  {selectedWeight === "All"
                    ? "Total Revenue"
                    : `Revenue · ${selectedWeight}`}
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

        {/* Weight Category Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 text-gray-400 text-sm">
            <Filter className="w-4 h-4" />
            <span className="font-medium uppercase tracking-wider">
              Filter by Weight Category
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {WEIGHT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedWeight(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200
                  ${selectedWeight === cat
                    ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-transparent shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                    : "bg-slate-900/60 text-gray-300 border-yellow-500/20 hover:border-yellow-500/50 hover:text-yellow-400"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table Card */}
        <Card className="bg-slate-900/90 border border-yellow-500/20 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">

          <CardContent className="p-0">

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Users className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-lg font-medium">No registrations found</p>
                <p className="text-sm mt-1">
                  No athletes in the{" "}
                  <span className="text-yellow-500">{selectedWeight}</span>{" "}
                  category yet.
                </p>
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
                    {filteredUsers.map((user) => (
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
                          ₹{getNetAmount(user.amount)}
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
"use client";
import { Button } from "@/components/ui/button";
import React, { useContext, useState, useEffect } from "react";
import axios from "axios"; // ✅ Fixed axios import
import { Loader2Icon, Save } from "lucide-react";
import { UserSubscription } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import moment from "moment";
import { UserSubscriptionContext } from "@/app/(context)/UserSubscriptionContext";

// ✅ Define window.Razorpay type for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

function Billing() {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { userSubscription, setUserSubscription } = useContext(UserSubscriptionContext);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  const createSubscription = async () => {
    setLoading(true);
    try {
      const resp = await axios.post("/api/create-subscription", {});
      console.log(resp.data);
      onPayment(resp.data.id);
    } catch (error) {
      console.error("Error creating subscription:", error);
      alert("Failed to create subscription. Please try again.");
      setLoading(false);
    }
  };

  const onPayment = async (subId: string) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK is not loaded. Please refresh and try again.");
      setLoading(false);
      return;
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      alert("Razorpay Key is missing. Check your environment variables.");
      setLoading(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id: subId,
      name: "AI Content Generator",
      description: "Monthly Subscription", // ✅ Fixed incorrect key
      handler: async (resp: any) => {
        console.log("Payment Response:", resp);
        if (resp?.razorpay_payment_id) {
          await saveSubscription(resp.razorpay_payment_id);
        }
        setLoading(false);
      },
      theme: {
        color: "#3399cc",
      },
    };

    // ✅ No TypeScript error: Razorpay script loads dynamically
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const saveSubscription = async (paymentId: string) => {
    try {
      const result = await db.insert(UserSubscription).values({
        email: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
        active: true,
        paymenId: paymentId,
        joinDate: moment().format("DD/MM/YYYY"),
      });

      console.log("Subscription Saved:", result);
      if (result) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving subscription:", error);
      alert("Failed to save subscription. Please contact support.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-5xl px-4">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-8">
          Upgrade With Monthly Plan
        </h1>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {/* Free Plan */}
          <div className="w-full md:w-1/3 bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Free</h3>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">0$</h2>
            <p className="text-sm text-gray-500 mb-4">/month</p>
            <ul className="list-none mb-6 text-gray-700">
              <li className="mb-2">✓ 10,000 Words/Month</li>
              <li className="mb-2">✓ 50+ Content Templates</li>
              <li className="mb-2">✓ Unlimited Download & Copy</li>
              <li className="mb-2">✓ 1 Month of History</li>
            </ul>
            <button className="px-6 py-3 bg-gray-800 text-white rounded-md font-medium w-full">
              Currently Active Plan
            </button>
          </div>

          {/* Monthly Plan */}
          <div className="w-full md:w-1/3 bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Monthly</h3>
            <h2 className="text-4xl font-bold text-blue-600 mb-4">9.99$</h2>
            <p className="text-sm text-gray-500 mb-4">/month</p>
            <ul className="list-none mb-6 text-gray-700">
              <li className="mb-2">
                ✓ <span className="text-blue-600">1,00,000 Words/Month</span>
              </li>
              <li className="mb-2">✓ 50+ Template Access</li>
              <li className="mb-2">✓ Unlimited Download & Copy</li>
              <li className="mb-2">✓ 1 Year of History</li>
            </ul>
            <button
              disabled={loading}
              onClick={() => createSubscription()}
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-md font-medium w-full flex gap-2 items-center justify-center"
            >
              {loading && <Loader2Icon className="animate-spin" />}
              {userSubscription ? "Active Plan" : "Get Started"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Billing;

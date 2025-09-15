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
        color: "#059669",
      },
    };

    // ✅ No TypeScript error: Razorpay script loads dynamically
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const saveSubscription = async (paymentId: string) => {
    if (!user || !user.primaryEmailAddress) {
      console.error("User or email not found");
      alert("User information is missing.");
      return;
    }

    try {
      const result = await db.insert(UserSubscription).values({
        email: user.primaryEmailAddress.emailAddress, // ✅ Ensure field matches schema
        userName: user.fullName || null, // Handle undefined case
        active: true,
        paymentId: paymentId,
        joinDate: new Date(), // ✅ Store as Date, avoid moment() string
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
    <div className="min-h-screen flex items-center justify-center p-6" style={{backgroundColor: '#EDF2F4'}}>
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Upgrade With Monthly Plan
          </h1>
          <p className="text-xl text-gray-600">Choose the plan that works for you</p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {/* Free Plan */}
          <div className="w-full md:w-1/3 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-8 text-center">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium mb-3">Starter</span>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">Free</h3>
              <div className="flex items-center justify-center mb-2">
                <span className="text-4xl font-semibold text-gray-900">$0</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
            </div>
            <ul className="list-none mb-8 text-gray-600 space-y-3">
              <li className="flex items-center justify-center">✓ <span className="font-semibold text-gray-700 ml-1">10,000 Credits/Month</span></li>
              <li className="flex items-center justify-center">✓ 50+ Content Templates</li>
              <li className="flex items-center justify-center">✓ Unlimited Download & Copy</li>
              <li className="flex items-center justify-center">✓ 1 Month of History</li>
            </ul>
            <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium w-full transition-all duration-200">
              Currently Active Plan
            </button>
          </div>

          {/* Monthly Plan */}
          <div className="w-full md:w-1/3 bg-white border-2 border-teal-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-8 text-center relative">
            {/* Popular badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-teal-600 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-sm">Most Popular</span>
            </div>
            
            <div className="pt-4">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-teal-50 text-teal-600 rounded-lg text-sm font-medium mb-3">Professional</span>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">Monthly</h3>
                <div className="flex items-center justify-center mb-2">
                  <span className="text-4xl font-semibold text-teal-600">$9.99</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
              </div>
              <ul className="list-none mb-8 text-gray-600 space-y-3">
                <li className="flex items-center justify-center">
                  ✓ <span className="text-teal-600 ml-1 font-medium">1,00,000 Words/Month</span>
                </li>
                <li className="flex items-center justify-center">✓ 500+ Images/Month</li>
                <li className="flex items-center justify-center">✓ 50+ Template Access</li>
                <li className="flex items-center justify-center">✓ Unlimited Download & Copy</li>
                <li className="flex items-center justify-center">✓ 1 Year of History</li>
              </ul>
              <button
                disabled={loading}
                onClick={() => createSubscription()}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white rounded-xl font-medium w-full flex gap-2 items-center justify-center transition-all duration-200"
              >
                {loading && <Loader2Icon className="animate-spin" />}
                {userSubscription ? "Active Plan" : "Get Started"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Billing;

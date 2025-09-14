"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { AIOutput, UserSubscription } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import React, { useContext, useEffect, useState } from "react";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { UserSubscriptionContext } from "@/app/(context)/UserSubscriptionContext";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";

function UsageTrack() {
  const { user } = useUser();
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);
  const { userSubscription, setUserSubscription } = useContext(UserSubscriptionContext);
  const { updateCreditUsage } = useContext(UpdateCreditUsageContext);
  const [maxWords, setMaxWords] = useState<number>(10000);

  useEffect(() => {
    if (!user) return;

    // Fetch data only when user exists
    Promise.all([GetData(), IsUserSubscribe()]);
  }, [user]);

  useEffect(() => {
    if (user && updateCreditUsage) {
      GetData();
    }
  }, [updateCreditUsage, user]);

  const GetData = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      console.warn("❗ User email is undefined, skipping DB query.");
      return;
    }

    try {
      const result: { aiResponse: string | null }[] = await db
        .select()
        .from(AIOutput)
        .where(eq(AIOutput.createdBy, email)); // ✅ email is now guaranteed to be a string

      GetTotalUsage(result || []);
    } catch (error) {
      console.error("❌ Error fetching AI output history:", error);
    }
  };


  const IsUserSubscribe = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;

    try {
      const result = await db
        .select()
        .from(UserSubscription)
        .where(eq(UserSubscription.email, email));

      if (result.length > 0) {
        setUserSubscription(true);
        setMaxWords(100000);
      }
    } catch (error) {
      console.error("❌ Error checking subscription:", error);
    }
  };

  const GetTotalUsage = (result: { aiResponse: string | null }[]) => {
    const total = result.reduce((sum, item) => sum + (item.aiResponse?.length || 0), 0);
    setTotalUsage(total);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-sm">Credits</h3>
          <div className="text-xs text-gray-500 font-medium">
            {Math.min(totalUsage, maxWords)}/{maxWords}
          </div>
        </div>
        
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div
            className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, (totalUsage / maxWords) * 100))}%` }}
          ></div>
        </div>
        
        <p className="text-xs text-gray-600">
          {maxWords - Math.min(totalUsage, maxWords)} credits remaining
        </p>
      </div>
      
      <Button 
        variant="default" 
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-xl font-medium shadow-sm hover:shadow-md transition-all"
      >
        ✨ Upgrade Plan
      </Button>
    </div>
  );
}

export default UsageTrack;

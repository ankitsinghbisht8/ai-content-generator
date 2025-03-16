"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { AIOutput, UserSubscription } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import React, { useContext, useEffect, useState } from "react";
import { HISTORY } from "../history/page";
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
    if (!email) return; // Ensure email is always valid

    try {
      const result: HISTORY[] = await db
        .select()
        .from(AIOutput)
        .where(eq(AIOutput.createdBy, email));

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

  const GetTotalUsage = (result: HISTORY[]) => {
    const total = result.reduce((sum, item) => sum + (item.aiResponse?.length || 0), 0);
    setTotalUsage(total);
  };

  return (
    <div className="m-5">
      <div className="bg-primary text-white p-3 rounded-lg">
        <h2>Credits</h2>
        <div className="h-2 bg-[#9991f9] w-full rounded-full mt-3">
          <div
            className="h-2 bg-white rounded-full"
            style={{ width: `${(totalUsage / maxWords) * 100}%` }}
          ></div>
        </div>
        <h2 className="text-sm my-2">{totalUsage}/{maxWords} credits used</h2>
      </div>
      <Button variant="secondary" className="w-full my-3 text-primary">
        Upgrade
      </Button>
    </div>
  );
}

export default UsageTrack;

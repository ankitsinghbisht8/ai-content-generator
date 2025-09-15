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
import { useRouter } from "next/navigation";

function UsageTrack() {
  const { user } = useUser();
  const router = useRouter();
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
      const result: { aiResponse: string | null; formData: string; templateSlug: string }[] = await db
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
        setMaxWords(1000000);
      }
    } catch (error) {
      console.error("❌ Error checking subscription:", error);
    }
  };

  // Estimate token count from words (~0.75 words per token per user's mapping)
  const estimateTokensFromText = (text: string): number => {
    const words = (text || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    // tokens ≈ words / 0.75
    return Math.max(0, Math.round(words / 0.75));
  };

  // Credits for text: 200 tokens -> 10 credits, 1000 -> 50, 2000 -> 100 => linear: credits = tokens / 20
  const calculateTextCredits = (text: string): number => {
    const tokens = estimateTokensFromText(text || "");
    return Math.floor(tokens / 20);
  };

  // Parse WxH like "1024x1024" into numbers
  const parseResolution = (size?: string): { width: number; height: number } => {
    if (!size || typeof size !== "string") return { width: 1024, height: 1024 };
    const m = size.match(/^(\d+)x(\d+)$/);
    if (!m) return { width: 1024, height: 1024 };
    return { width: parseInt(m[1], 10) || 1024, height: parseInt(m[2], 10) || 1024 };
  };

  // Credits for images: credits = 1000 * (w*h)/(1024*1024) per image
  const calculateImageCredits = (count: number, size?: string): number => {
    const { width, height } = parseResolution(size);
    const base = 1000; // for 1024x1024
    const perImage = Math.round((base * (width * height)) / (1024 * 1024));
    return Math.max(0, perImage * Math.max(0, count));
  };

  // Count images stored as newline-separated data URLs in aiResponse
  const countImagesFromResponse = (resp?: string | null): number => {
    if (!resp) return 0;
    const lines = resp.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    // Heuristic: data URLs start with "data:image/"
    const imageLines = lines.filter((l) => l.startsWith("data:image/"));
    return imageLines.length || 0;
  };

  const safeParseJson = (s?: string): any => {
    if (!s) return null;
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  };

  const GetTotalUsage = (
    result: { aiResponse: string | null; formData: string; templateSlug: string }[]
  ) => {
    const totalCredits = result.reduce((sum, item) => {
      const form = safeParseJson(item.formData) || {};
      const isImageFlow = typeof form?.size === "string" || countImagesFromResponse(item.aiResponse) > 0;
      if (isImageFlow) {
        const size: string | undefined = typeof form?.size === "string" ? form.size : undefined;
        const count = countImagesFromResponse(item.aiResponse);
        return sum + calculateImageCredits(count, size);
      }
      // Text flow
      return sum + calculateTextCredits(item.aiResponse || "");
    }, 0);
    setTotalUsage(totalCredits);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white text-sm">Credits</h3>
          <div className="text-xs text-gray-300 font-medium">
            {Math.min(totalUsage, maxWords).toLocaleString()}/{maxWords.toLocaleString()}
          </div>
        </div>
        
        <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-2">
          <div
            className="h-2 bg-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, (totalUsage / maxWords) * 100))}%` }}
          ></div>
        </div>
        
        <p className="text-xs text-gray-300">
          {(maxWords - Math.min(totalUsage, maxWords)).toLocaleString()} credits remaining
        </p>
      </div>
      
      {!userSubscription && (
        <Button 
          variant="default" 
          className="w-full bg-teal-600 hover:bg-teal-700 text-white border-0 rounded-xl font-medium shadow-sm hover:shadow-md transition-all hover:scale-105"
          onClick={() => router.push('/dashboard/billing')}
        >
          ✨ Upgrade Plan
        </Button>
      )}
    </div>
  );
}

export default UsageTrack;

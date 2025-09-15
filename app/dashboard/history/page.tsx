import React from 'react';
import { AIOutput } from '@/utils/schema';
import { currentUser } from '@clerk/nextjs/server';
import { SignedOut, SignIn } from '@clerk/nextjs';
import { db } from '@/utils/db';
import { desc, eq } from 'drizzle-orm';
import HistoryClient, { HISTORY } from './_components/HistoryClient';

const HistoryPage = async () => {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full p-8 border border-gray-200 rounded-2xl bg-white shadow-lg text-center space-y-6">
          <div className="text-xl font-semibold text-gray-900">Please sign in to view your history</div>
          <SignedOut>
            <SignIn />
          </SignedOut>
        </div>
      </div>
    );
  }

  try {
    const email = (user as any)?.primaryEmailAddress?.emailAddress || (user as any)?.emailAddresses?.[0]?.emailAddress || '';
    if (!email) {
      return <div className="text-red-500 text-center mt-5">No email found for the current user</div>;
    }
    const results: HISTORY[] = await db
      .select({
        id: AIOutput.id,
        formData: AIOutput.formData,
        aiResponse: AIOutput.aiResponse,
        templateSlug: AIOutput.templateSlug,
        createdBy: AIOutput.createdBy,
        createdAt: AIOutput.createdAt,
      })
      .from(AIOutput)
      .where(eq(AIOutput.createdBy, email))
      .orderBy(desc(AIOutput.createdAt))
      .limit(20);

    // console.log("Fetched data:", results);

    return (
      <div className="min-h-screen p-6" style={{backgroundColor: '#EDF2F4'}}>
        <HistoryClient data={results} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return (
      <div className="text-red-600 text-center mt-5">
        ⚠️ An error occurred while loading your history. Please try again later.
      </div>
    );
  }
};

export default HistoryPage;

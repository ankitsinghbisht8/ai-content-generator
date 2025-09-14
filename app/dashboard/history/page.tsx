import React from 'react';
import { AIOutput } from '@/utils/schema';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/utils/db';
import { desc, eq } from 'drizzle-orm';
import HistoryClient, { HISTORY } from './_components/HistoryClient';

const HistoryPage = async () => {
  const user = await currentUser();
  if (!user) {
    return <div className="text-red-500 text-center mt-5">No user found</div>;
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
      .orderBy(desc(AIOutput.createdAt));

    // console.log("Fetched data:", results);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
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

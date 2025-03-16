import Templates from '@/app/(data)/Templates'; // Assuming Templates are stored in (data)
import React, { useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AIOutput } from '@/utils/schema';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/utils/db';
import { desc, eq } from 'drizzle-orm';

// Define the HISTORY interface
export interface HISTORY {
  id: number;
  formData: string;
  aiResponse: string | null;
  templateSlug: string;
  createdBy: string | null;
  createdAt: string | null;
}

// 🎯 Optimized Client Component
const HistoryClientComponent = ({ data }: { data: HISTORY[] }) => {
  // ✅ Memoized Template Lookup for Efficiency
  const templateMap = useMemo(() => {
    return Templates.reduce((acc, template) => {
      acc[template.slug] = template;
      return acc;
    }, {} as Record<string, { slug: string; name: string; icon: string }>);
  }, []);

  if (!data || data.length === 0) {
    return <div className="text-center text-gray-600 mt-4">No History Available!</div>;
  }

  return (
    <div className="p-4">
      <header className="flex justify-between items-center bg-gray-100 p-4 border-b border-gray-300">
        <h1 className="text-xl font-semibold">History</h1>
      </header>
      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">Template</th>
              <th className="border px-4 py-2">AI Response</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Words</th>
              <th className="border px-4 py-2">Copy</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const template = templateMap[item.templateSlug]; // O(1) Lookup
              return (
                <tr key={item.id} className="border">
                  <td className="border px-4 py-2 flex items-center">
                    {template && (
                      <>
                        <Image src={template.icon} alt={template.name} width={50} height={50} />
                        <span className="ml-2">{template.name}</span>
                      </>
                    )}
                  </td>
                  <td className="border px-4 py-2 max-w-xs truncate">{item.aiResponse || ''}</td>
                  <td className="border px-4 py-2">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                  </td>
                  <td className="border px-4 py-2">{item.aiResponse?.split(' ')?.length || 0}</td>
                  <td className="border px-4 py-2">
                    <Button
                      onClick={() => navigator.clipboard.writeText(item.aiResponse || '')}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Copy
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 🚀 Optimized Server Component Logic
const HistoryPage = async () => {
  const user = await currentUser();
  if (!user) {
    return <div className="text-red-500 text-center mt-5">No user found</div>;
  }

  try {
    const results = await db
      .select({
        id: AIOutput.id,
        formData: AIOutput.formData,
        aiResponse: AIOutput.aiResponse,
        templateSlug: AIOutput.templateSlug,
        createdBy: AIOutput.createdBy,
        createdAt: AIOutput.createdAt,
      })
      .from(AIOutput)
      .where(eq(AIOutput.createdBy, user.id))
      .orderBy(desc(AIOutput.createdAt));

    console.log("Fetched data:", results);

    return <HistoryClientComponent data={results} />;
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

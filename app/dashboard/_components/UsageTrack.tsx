"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db';
import { AIOutput, UserSubscription } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm'; // Replace 'some-module' with the actual module name
import { currentUser } from '@clerk/nextjs/server'
import React, { use, useContext, useEffect, useState } from 'react'
import { HISTORY } from '../history/page'; // Ensure this path is correct
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext';
import { UserSubscriptionContext } from '@/app/(context)/UserSubscriptionContext';
import { UpdateCreditUsageContext } from '@/app/(context)/UpdateCreditUsageContext';
    
function UsageTrack() {
    const {user}=useUser();  
    const {totalUsage,setTotalUsage}=useContext(TotalUsageContext);
    const {userSubscription, setUserSubscription}=useContext(UserSubscriptionContext);
    const[maxWords,setmaxWords]=useState<number>(10000);
    const {updateCreditUsage,setupdateCreditUsage}=useContext(UpdateCreditUsageContext);


    useEffect(()=>{
        user&&GetData();
        user&&IsUserSubscribe();
    },[user]);

    useEffect(()=>{
      user&&GetData();
    },[updateCreditUsage&&user]);

    const GetData=async()=>{
        {/* @ts-ignore */}
        const result:HISTORY[]=await db.select().from(AIOutput)
    .where(eq(AIOutput.createdBy,user?.primaryEmailAddress?.emailAddress))

    GetTotalUsage(result);
    }

    const IsUserSubscribe=async ()=>{
      const result=await db.select().from(UserSubscription).where(eq(UserSubscription.email,user?.primaryEmailAddress?.emailAddress));
      if(result){
        setUserSubscription(true);
        setmaxWords(100000);
      }
    }

    const GetTotalUsage=(result:HISTORY[])=>{
        let total:number=0;
        result.forEach(element =>{
            total=total+Number(element.aiResponse?.length)
        });
        setTotalUsage(total);
        console.log(total);
    }
  return (
    <div className='m-5'>
      <div className='bg-primary text-white p-3 rounded-lg'>
        <h2>Credits</h2>
        <div className='h-2 bg-[#9991f9] w-full rounded-full mt-3'>
            <div className='h-2 bg-white rounded-full'
            style={{width:(totalUsage/maxWords)*100+'%'}}>

            </div>
        </div>
        <h2 className='text-sm my-2'>{totalUsage}/{maxWords} credits used</h2>
      </div>
      <Button variant={'secondary'} className='w-full my-3 text-primary'>Upgrade</Button>
    </div>
  )
}

export default UsageTrack

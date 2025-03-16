"use client"
import React, { useContext, useState } from 'react'
import FormSection from '../_components/FormSection'
import OutputSection from '../_components/OutputSection'
import Templates from '@/app/(data)/Templates'
import { TEMPLATE } from '../../_components/TemplateListSection'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { chatSession } from '@/utils/AiModal'
import { db } from '@/utils/db'
import { AIOutput } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext'
import { useRouter } from 'next/navigation'
import { UserSubscriptionContext } from '@/app/(context)/UserSubscriptionContext'
import { UpdateCreditUsageContext } from '@/app/(context)/UpdateCreditUsageContext'

interface PROPS{
    params:{
        'template-slug':string
    }
    
}
const CreateNewContent = (props:PROPS) => {
    const selectedTemplate:TEMPLATE|undefined=Templates?.find((item)=>item.slug==props.params['template-slug']);
    const[loading,setLoading]=useState(false);
    const [aiOutput,setAiOutput]=useState<string>('');
    const {user}=useUser();
    const router=useRouter();
    const {totalUsage,setTotalUsage}=useContext (TotalUsageContext);
    const {userSubscription, setUserSubscription}=useContext(UserSubscriptionContext);

    const {updateCreditUsage,setUpdateCreditUsage}=useContext(UpdateCreditUsageContext);
  /**
   * use this function to generate AI content
   * @param formData 
   * @returns 
   */
    const GenerateAIContent=async(formData:any)=>{
       if(totalUsage>=10000&&!userSubscription){
        return alert('You have reached the maximum usage limit of 10000 requests per month. Please upgrade your plan to continue using the service');
        router.push('/dashboard/billing');
       }


      setLoading(true);
      const SelectedPrompt=selectedTemplate?.aiPrompt;
      const FinalAiPrompt=JSON.stringify(formData)+","+SelectedPrompt;
      const result=await chatSession.sendMessage(FinalAiPrompt);

  
      setAiOutput(result?.response.text());
      await SaveInDb(formData,selectedTemplate?.slug,result?.response.text())
      setLoading(false);

      setUpdateCreditUsage(Date.now());


    }
      const SaveInDb=async(formData:any,slug:any,aiResp:string)=>{
        const result=await db.insert(AIOutput).values({
          formData:formData,
          templateSlug:slug,
          aiResponse:aiResp,
          createdBy:user?.primaryEmailAddress?.emailAddress,
          createdAt:moment().format('DD/MM/YYYY'),

        });
        console.log(result);
      }


  return (
    <div className='p-5'>
      <Link href={"/dashboard"}>
        <Button><ArrowLeft/>Back</Button>
        </Link>
    
    <div className='grid grid-cols-1 md:grid-cols-3 gap-5 py-5'>

      {/* FormSection */}
        <FormSection selectedTemplate={selectedTemplate}
        userFormInput={(v:any)=>GenerateAIContent(v)} loading={loading}/>

        {/* OutputSection */}

        <div className='col-span-2'>
        <OutputSection aiOutput={aiOutput}/>
        </div>
        </div>
      
      

    </div>
  )
}

export default CreateNewContent

import Templates from '@/app/(data)/Templates'
import React, { useEffect, useState } from 'react'
import TemplateCard from './TemplateCard'
export interface TEMPLATE{
    
    name:string,
    desc:string,
    icon:string,
    category:string,
    slug: string,
    aiPrompt:string,
    form?:FORM[],
    promptTemplate?: string
}
export interface FORM{
    label:string,
    field:string,
    name:string,
    required?:boolean,
    options?: { label: string; value: string }[]
}
const TemplateListSection = ({userSearchInput}:any) => {

        const [templateList,setTemplateList]=useState(Templates)
    useEffect(()=>{
        
        if(userSearchInput){
            const filterData=Templates.filter(item=>
                item.name.toLowerCase().includes(userSearchInput.toLowerCase())
            );
            setTemplateList(filterData);
        }
        else{
            setTemplateList(Templates)
        }
    },[userSearchInput])
  return (
    <div className='px-6 pb-12 max-w-7xl mx-auto'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {templateList.map((item:TEMPLATE,index:number)=>(
            <TemplateCard key={index} {...item}/>
        ))}
      </div>
    </div>
  )
}

export default TemplateListSection

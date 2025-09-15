"use client"
import React, { useEffect, useState } from 'react'
import { TEMPLATE } from '../../_components/TemplateListSection';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';

interface PROPS{
    selectedTemplate?:TEMPLATE;
    userFormInput:any,
    loading:boolean,
}
const FormSection = ({selectedTemplate,userFormInput,loading}:PROPS) => {

    const[formData,setFormData]=useState<any>({});
    const[promptTemplateValue,setPromptTemplateValue]=useState<string>('');
    
    const handleInputChange=(event:any)=>{
        const{name,value}=event.target;
        setFormData({...formData,[name]:value})
    }
    useEffect(()=>{
        if(selectedTemplate?.promptTemplate){
            // Initialize from template placeholders with empty defaults
            setPromptTemplateValue(selectedTemplate.promptTemplate)
        } else {
            setPromptTemplateValue('')
        }
    },[selectedTemplate?.promptTemplate])

    const onSubmit=(e:any)=>{
        e.preventDefault();
        if(selectedTemplate?.promptTemplate){
            // Replace {{placeholders}} in editable prompt template with form data or blank
            const source = promptTemplateValue || selectedTemplate.promptTemplate;
            const filled = source.replace(/\{\{(.*?)\}\}/g, (_: any, key: string)=>{
                const k = String(key).trim();
                return (formData?.[k] ?? '').toString();
            });
            userFormInput({ ...formData, promptTemplate: filled });
        }else{
            userFormInput(formData)
        }

    }
  return (
    <div className='p-6 bg-white shadow-lg border border-gray-200 rounded-2xl'>
        <div className='flex items-center gap-3 mb-6'>
            {/* @ts-ignore */}
            <Image src={selectedTemplate?.icon} alt='icon' width={70} height={70} />
            <div>
                <h2 className='font-bold text-2xl text-gray-900'>{selectedTemplate?.name}</h2>
                <p className='text-gray-500 text-sm'>{selectedTemplate?.desc}</p>
            </div>
        </div>

        <form className='mt-6' onSubmit={onSubmit}>

            {selectedTemplate?.promptTemplate && (
                <div className='my-2 flex flex-col gap-2 mb-7'>
                    <label className='font-bold'>Prompt Template (editable)</label>
                    <Textarea value={promptTemplateValue} onChange={(e)=>{
                        const tmpl = e.target.value;
                        setPromptTemplateValue(tmpl);
                        // Ensure formData has keys referenced by the template
                        const keys = Array.from(tmpl.matchAll(/\{\{(.*?)\}\}/g)).map(m=>String(m[1]).trim());
                        const next = { ...formData };
                        keys.forEach(k=>{ if(next[k]===undefined) next[k]=''; });
                        setFormData(next);
                    }}/>
                    <p className='text-xs text-gray-500'>Use placeholders like {'{{idea}}'}, {'{{style}}'}, {'{{mood}}'}, {'{{artist}}'}, {'{{negative}}'}</p>
                </div>
            )}

            {selectedTemplate?.form?.map((item,index)=>(
                <div className='my-2 flex flex-col gap-2 mb-7'>
                    <label className='font-bold'>{item.label}</label>
                    {item.field =='input'?
                    <Input name={item.name} required={item?.required}
                    onChange={handleInputChange}/> :item.field=='textarea'?<Textarea name={item.name} required={item?.required}
                    onChange={handleInputChange} />: item.field=='select' && item.options ? (
                        <select name={item.name} onChange={handleInputChange} className='border rounded p-2'>
                            {item.options.map((opt)=> (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    ): null}
                </div>
            ))}
            <Button type='submit' className='w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:scale-105'
            disabled={loading}>
                {loading && <Loader2Icon className='animate-spin'/>}
                Generate Content</Button>


        </form>
    </div>
  )
}

export default FormSection

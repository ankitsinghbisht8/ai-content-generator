import React, { useEffect, useState, useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/react-editor';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface Props {
  aiOutput: string;
}

const OutputSection = ({ aiOutput }: Props) => {
  const editorRef: any = useRef();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const editorInstance = editorRef.current.getInstance();
    editorInstance.setMarkdown(aiOutput);
  }, [aiOutput]);

  const handleCopy = () => {
    const editorInstance = editorRef.current.getInstance();
    const markdownContent = editorInstance.getMarkdown(); // Get Markdown content
    navigator.clipboard.writeText(markdownContent); // Copy to clipboard

    setCopied(true); // Set copied state to true
    setTimeout(() => setCopied(false), 3000); // Revert back after 3 seconds
  };

  return (
    <div className='bg-white shadow-lg border rounded-lg'>
      <div className='flex justify-between items-center p-5'>
        <h2 className='font-medium text-lg'>Your Result</h2>
        <Button className='flex gap-2' onClick={handleCopy}>
          {copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <Editor
        ref={editorRef}
        initialValue="Your result will appear here!"
        initialEditType="wysiwyg"
        height="600px"
        useCommandShortcut={true}
        onChange={() => console.log(editorRef.current.getInstance().getMarkdown())}
      />
    </div>
  );
};

export default OutputSection;

import React, { useEffect, useState, useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/react-editor';
import { Button } from '@/components/ui/button';
import { Copy, Check, Eye, Download, X } from 'lucide-react';

interface Props {
  aiOutput?: string;
  images?: string[];
  loading?: boolean;
  onRefine?: (newPrompt: string) => Promise<void> | void;
  forceImageUI?: boolean;
  emptyStateMessage?: string;
}

const OutputSection = ({ aiOutput = '', images = [], loading = false, onRefine, forceImageUI = false, emptyStateMessage }: Props) => {
  const editorRef: any = useRef();
  const [copied, setCopied] = useState(false);

  // Image preview modal state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [refinePrompt, setRefinePrompt] = useState<string>('');

  useEffect(() => {
    if (editorRef.current && !images?.length) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setMarkdown(aiOutput || '');
    }
  }, [aiOutput, images]);

  const handleCopy = () => {
    const editorInstance = editorRef.current.getInstance();
    const markdownContent = editorInstance.getMarkdown();
    navigator.clipboard.writeText(markdownContent);

    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement('a');
    const mime = (url.split(';')[0].split(':')[1]) || 'image/png';
    const ext = mime.includes('jpeg') ? 'jpg' : (mime.split('/')[1] || 'png');
    link.href = url;
    link.download = `generated_image_${index + 1}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If images exist, render image cards UI
  if (forceImageUI || (images && images.length > 0)) {
    return (
      <div className='shadow-lg border rounded-lg' style={{backgroundColor: '#F6F4F0'}}>
        <div className='flex flex-col gap-4 p-5'>
          <div className='flex flex-col md:flex-row gap-3 md:items-center md:justify-between'>
            <h2 className='font-medium text-lg'>Generated Images</h2>
            {onRefine && (
              <div className='flex w-full md:w-auto gap-2'>
                <input
                  type='text'
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  placeholder='Refine prompt and regenerate...'
                  className='flex-1 md:w-96 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40'
                />
                <Button disabled={loading || !refinePrompt.trim()} onClick={() => onRefine(refinePrompt.trim())}>Regenerate</Button>
              </div>
            )}
          </div>

          {images.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {images.map((url, idx) => (
                <div key={idx} className='border rounded-lg overflow-hidden shadow-sm' style={{backgroundColor: '#F6F4F0'}}>
                  <div className='aspect-square overflow-hidden bg-muted'>
                    <img src={url} alt={`generated-${idx + 1}`} className='w-full h-full object-cover' />
                  </div>
                  <div className='flex items-center justify-between p-3'>
                    <div className='text-sm text-muted-foreground'>Image {idx + 1}</div>
                    <div className='flex gap-2'>
                      <Button variant='outline' size='sm' onClick={() => setPreviewUrl(url)}>
                        <Eye className='w-4 h-4 mr-1' /> Preview
                      </Button>
                      <Button size='sm' onClick={() => handleDownload(url, idx)}>
                        <Download className='w-4 h-4 mr-1' /> Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='border rounded-lg p-8 text-center text-muted-foreground bg-muted/20'>
              {emptyStateMessage || 'No images yet. Enter a prompt to generate.'}
            </div>
          )}
        </div>

        {previewUrl && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'>
            <div className='relative max-w-5xl w-full'>
              <button className='absolute -top-3 -right-3 rounded-full p-2 shadow' style={{backgroundColor: '#F6F4F0'}} onClick={() => setPreviewUrl(null)}>
                <X className='w-5 h-5' />
              </button>
              <img src={previewUrl} alt='preview' className='w-full h-auto rounded-lg shadow-lg' />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default RTE for text outputs
  return (
    <div className='shadow-lg border rounded-lg' style={{backgroundColor: '#F6F4F0'}}>
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

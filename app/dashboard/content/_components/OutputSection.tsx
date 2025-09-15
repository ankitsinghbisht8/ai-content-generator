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

  // Close preview on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewUrl(null);
      }
    };
    if (previewUrl) {
      window.addEventListener('keydown', onKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [previewUrl]);

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
      <div className='bg-white shadow-lg border border-gray-200 rounded-2xl'>
        <div className='flex flex-col gap-6 md:gap-8 p-4 md:p-8 overflow-x-hidden'>
          <div className='flex flex-col md:flex-row gap-3 md:items-center md:justify-between'>
            <h2 className='font-medium text-lg'>Generated Images</h2>
            {onRefine && (
              <div className='flex w-full md:w-auto gap-2'>
                <input
                  type='text'
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  placeholder='Refine prompt...'
                  className='flex-1 md:w-88 border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/40'
                />
                <Button disabled={loading || !refinePrompt.trim()} onClick={() => onRefine(refinePrompt.trim())} className='bg-emerald-600 hover:bg-emerald-700'>Regenerate</Button>
              </div>
            )}
          </div>

          {images.length > 0 ? (
  <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 max-w-full'>
        {images.map((url, idx) => (
          <div
            key={idx}
            className='bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 p-4 md:p-6 min-w-0'
          >
            <div className='aspect-square overflow-hidden bg-gray-50 rounded-lg md:rounded-xl mb-4 md:mb-6'>
              <img
                src={url}
                alt={`generated-${idx + 1}`}
                className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
              />
            </div>

            {/* ✅ Fixed footer row */}
            <div className='w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3'>
              <div className='text-sm font-medium text-gray-700 text-center md:text-left break-words'>
                Image {idx + 1}
              </div>
              <div className='flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-end gap-2 w-full md:w-auto max-w-full'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPreviewUrl(url)}
                  className='border-gray-300 hover:bg-gray-50 text-gray-700 w-full sm:w-auto shrink-0 whitespace-nowrap'
                >
                  <Eye className='w-4 h-4 mr-1' /> Preview
                </Button>
                <Button
                  size='sm'
                  onClick={() => handleDownload(url, idx)}
                  className='bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto shrink-0 whitespace-nowrap'
                >
                  <Download className='w-4 h-4 mr-1.5' /> Download
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
          <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-auto'
            onClick={(e) => { if (e.target === e.currentTarget) setPreviewUrl(null); }}
          >
            <div className='relative max-w-6xl w-full'>
              <button
                aria-label='Close preview'
                className='absolute top-4 right-4 bg-white/90 rounded-full p-2.5 shadow hover:bg-white'
                onClick={() => setPreviewUrl(null)}
              >
                <X className='w-5 h-5' />
              </button>
              <img
                src={previewUrl}
                alt='preview'
                className='w-auto max-w-full max-h-[85vh] mx-auto h-auto rounded-lg shadow-lg object-contain'
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default RTE for text outputs
  return (
    <div className='bg-white shadow-lg border border-gray-200 rounded-2xl'>
      <div className='flex justify-between items-center p-6'>
        <h2 className='font-medium text-lg'>Your Result</h2>
        <Button className='flex gap-2 bg-emerald-600 hover:bg-emerald-700' onClick={handleCopy}>
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

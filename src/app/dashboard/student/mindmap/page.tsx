'use client';

import { useEffect } from 'react';
import { generateMindMap } from '@/lib/mindmap';

export default function MindMapPage({ params }: { params: { topic: string } }) {
  const topic = params.topic || "photosynthesis"; 

  useEffect(() => {
    if (typeof window !== 'undefined' && topic) {
        generateMindMap(
            topic.replace(/-/g, ' '),
            'Basic CBSE science concept for grade 8'
        );
    }
  }, [topic]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {topic.replace(/-/g, ' ')}
      </h1>
      
      <div 
        id="mindmap-container" 
        className="border rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800"
        style={{ height: '500px' }}
      />
      
      <p className="text-sm text-muted-foreground mt-4">
        This is a basic, client-side generated mind map that works offline.
      </p>
    </div>
  );
}

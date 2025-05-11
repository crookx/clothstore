import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const RichTextEditor = dynamic<RichTextEditorProps>(() => import('@/components/ui/rich-text-editor'), {
    ssr: false
});

interface Page {
    id: string;
    title: string;
    slug: string;
    content: string;
    isPublished: boolean;
    meta: {
        description: string;
        keywords: string;
    };
}

export default function PageEditor() {
  return <div>Page Editor Component</div>;
}
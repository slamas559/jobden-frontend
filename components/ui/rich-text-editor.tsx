// components/ui/rich-text-editor.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  disabled = false,
  error,
  label,
  required = false,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    };
    setEditorLoaded(true);
  }, []);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div
        className={cn(
          'min-h-[300px] rounded-md border border-input bg-background',
          error && 'border-destructive',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {editorLoaded ? (
          <CKEditor
            editor={ClassicEditor}
            data={value}
            disabled={disabled}
            config={{
              placeholder,
              toolbar: [
                'heading',
                '|',
                'bold',
                'italic',
                'underline',
                'link',
                '|',
                'bulletedList',
                'numberedList',
                '|',
                'blockQuote',
                'insertTable',
                '|',
                'undo',
                'redo',
              ],
              heading: {
                options: [
                  { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                  { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                  { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                  { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                ],
              },
              link: {
                decorators: {
                  openInNewTab: {
                    mode: 'manual',
                    label: 'Open in a new tab',
                    attributes: {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    },
                  },
                },
              },
              table: {
                contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
              },
            }}
            onChange={(event: any, editor: any) => {
              const data = editor.getData();
              onChange(data);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Loading editor...
          </div>
        )}
      </div>
      
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

// Add custom CSS for CKEditor styling
// You'll need to add this to your global CSS file
export const ckeditorStyles = `
/* CKEditor 5 Custom Styles */
.ck-editor__editable {
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
}

.ck-editor__editable:not(.ck-editor__nested-editable) {
  border-radius: 0 0 0.375rem 0.375rem;
}

.ck.ck-editor__main>.ck-editor__editable:not(.ck-focused) {
  border-color: hsl(var(--input));
}

.ck.ck-editor__main>.ck-editor__editable.ck-focused {
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 3px hsl(var(--ring) / 0.5);
}

.ck.ck-toolbar {
  border-color: hsl(var(--input));
  background-color: hsl(var(--background));
  border-radius: 0.375rem 0.375rem 0 0;
}

.ck.ck-toolbar .ck-toolbar__items {
  background-color: hsl(var(--background));
}

.ck.ck-button:not(.ck-disabled):hover {
  background-color: hsl(var(--accent));
}

.ck.ck-button.ck-on {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

/* Dark mode support */
.dark .ck.ck-editor__editable {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

.dark .ck.ck-toolbar {
  background-color: hsl(var(--background));
  border-color: hsl(var(--border));
}

.dark .ck.ck-button:not(.ck-disabled):hover {
  background-color: hsl(var(--accent));
}

/* Content styling inside editor */
.ck-content {
  font-family: var(--font-sans);
}

.ck-content h1 {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
}

.ck-content h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.75em 0;
}

.ck-content h3 {
  font-size: 1.17em;
  font-weight: bold;
  margin: 0.83em 0;
}

.ck-content p {
  margin: 1em 0;
}

.ck-content ul,
.ck-content ol {
  margin: 1em 0;
  padding-left: 40px;
}

.ck-content blockquote {
  border-left: 4px solid hsl(var(--border));
  padding-left: 1em;
  margin: 1em 0;
  font-style: italic;
}

.ck-content a {
  color: hsl(var(--primary));
  text-decoration: underline;
}

.ck-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.ck-content table td,
.ck-content table th {
  border: 1px solid hsl(var(--border));
  padding: 0.4em;
}

.ck-content table th {
  background-color: hsl(var(--muted));
  font-weight: bold;
}
`;
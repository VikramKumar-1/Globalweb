'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, Heading1, Heading2, Heading3, Type, 
  List, ListOrdered, Link2, Quote, LayoutGrid, CheckCircle, 
  HelpCircle, MessageSquare, Unlink, Undo, Redo, Trash2
} from 'lucide-react';

interface ContentEditorProps {
  content: string;
  setContent: (val: string) => void;
  placeholder?: string;
}

function wrapLocationTags(html: string): string {
  if (!html) return '';
  // Avoid duplicate nesting of the location-tag spans
  let clean = html.replace(/<span class="location-tag"[^>]*>\{\s*location\s*\}<\/span>/gi, '{location}');
  
  // Wrap any raw {location} in our styled span
  return clean.replace(/\{\s*location\s*\}/gi, 
    `<span class="location-tag" style="color: #16a34a; background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 2px 6px; border-radius: 6px; font-weight: 800; font-family: monospace; display: inline-block; margin: 0 2px;" contenteditable="false">{location}</span>`
  );
}

export default function ContentEditor({ content, setContent, placeholder }: ContentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelection = useRef<Range | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize content once on mount or when content is first loaded
  useEffect(() => {
    setIsMounted(true);
    if (editorRef.current && content) {
      const wrapped = wrapLocationTags(content);
      if (editorRef.current.innerHTML !== wrapped) {
        editorRef.current.innerHTML = wrapped;
      }
    }
  }, []); // Only run once on mount

  // Listen for external updates if the form loads data asynchronously
  useEffect(() => {
    if (isMounted && editorRef.current && content !== undefined) {
      const wrapped = wrapLocationTags(content);
      if (editorRef.current.innerHTML !== wrapped) {
        // Only update if we aren't the ones who triggered the change (prevent cursor jump)
        if (document.activeElement !== editorRef.current) {
          editorRef.current.innerHTML = wrapped;
        }
      }
    }
  }, [content, isMounted]);

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleBlur = () => {
    if (editorRef.current) {
      const currentHTML = editorRef.current.innerHTML;
      const wrapped = wrapLocationTags(currentHTML);
      if (currentHTML !== wrapped) {
        editorRef.current.innerHTML = wrapped;
      }
      setContent(wrapped);
    }
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (savedSelection.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedSelection.current);
    }
  };

  const executeCommand = (command: string, arg?: string) => {
    restoreSelection();
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    saveSelection();
    handleInput();
  };

  const applyInlineStyle = (styleProperty: string, value: string) => {
    restoreSelection();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (range.collapsed) {
        return;
      }
      const span = document.createElement('span');
      span.style.setProperty(styleProperty, value);
      try {
        span.appendChild(range.extractContents());
        range.insertNode(span);
        handleInput();
      } catch (e) {
        console.error('Failed to apply inline style', e);
      }
    }
  };

  const setTextColor = (color: string) => {
    if (color === 'default') {
      executeCommand('removeFormat');
    } else {
      executeCommand('foreColor', color);
    }
  };

  const handleLink = () => {
    const url = prompt('Enter the link URL (e.g. https://google.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const removeCurrentLayoutBlock = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let node: Node | null = selection.anchorNode;
      // Walk up the DOM tree from the cursor selection to find the closest injected-layout block
      while (node && node !== editorRef.current) {
        if (node instanceof HTMLElement && node.classList.contains('injected-layout')) {
          node.remove();
          handleInput();
          return;
        }
        node = node.parentNode;
      }
    }
  };

  // HTML templates insertion using execCommand insertHTML
  const insertTemplate = (templateName: string) => {
    let html = '';
    switch (templateName) {
      case 'grid':
        html = `<br><div class="injected-layout grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
  <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
    <h3 class="text-lg font-black text-gray-900 font-lexend mb-2">Column One Headline</h3>
    <p class="text-gray-600 text-xs">Insert descriptions and features of the first key point here.</p>
  </div>
  <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
    <h3 class="text-lg font-black text-gray-900 font-lexend mb-2">Column Two Headline</h3>
    <p class="text-gray-600 text-xs">Insert descriptions and features of the second key point here.</p>
  </div>
</div><br>`;
        break;
      case 'checklist':
        html = `<br><ul class="injected-layout space-y-4 my-6">
  <li class="flex items-start gap-3">
    <strong class="text-[#1a8b4c] text-base">✔</strong>
    <div>
      <h4 class="font-bold text-gray-900 text-sm">Key Benefit Title</h4>
      <p class="text-gray-500 text-xs mt-0.5">Write details about what the customer gets with this benefit.</p>
    </div>
  </li>
  <li class="flex items-start gap-3">
    <strong class="text-[#1a8b4c] text-base">✔</strong>
    <div>
      <h4 class="font-bold text-gray-900 text-sm">Another Premium Feature</h4>
      <p class="text-gray-500 text-xs mt-0.5">Details and specifications on how this feature helps them succeed.</p>
    </div>
  </li>
</ul><br>`;
        break;
      case 'quote':
        html = `<br><div class="injected-layout p-8 bg-gray-50 border-l-4 border-[#1a8b4c] rounded-r-3xl my-6">
  <p class="text-gray-600 italic text-sm">"Insert client review, recommendation, testimonial quote or an important statement here."</p>
  <span class="text-xs font-black text-gray-900 uppercase tracking-widest mt-3 block">- Brand name / Client Name</span>
</div><br>`;
        break;
      case 'faq':
        html = `<br><div class="injected-layout space-y-4 my-8">
  <details class="bg-white border border-gray-200/80 rounded-2xl p-5 cursor-pointer shadow-sm group">
    <summary class="font-black text-gray-900 uppercase text-[11px] tracking-wider select-none flex items-center justify-between">
      Frequently Asked Question 1?
      <span class="text-gray-400 group-hover:text-gray-600 font-bold">+</span>
    </summary>
    <p class="text-gray-500 text-xs mt-3 leading-relaxed">Detailed answering paragraph explaining this frequently asked question.</p>
  </details>
</div><br>`;
        break;
      case 'callout':
        html = `<br><div class="injected-layout p-6 bg-green-50/50 border border-green-100 rounded-3xl my-6 flex items-center gap-4">
  <div class="text-2xl">💡</div>
  <div>
    <h4 class="font-bold text-[#1a8b4c] text-xs uppercase tracking-wider">Expert Pro Tip</h4>
    <p class="text-gray-600 text-xs mt-1">Insert helpful warnings, tips, guidelines or industry highlights here.</p>
  </div>
</div><br>`;
        break;
      default:
        return;
    }
    executeCommand('insertHTML', html);
  };

  const ToolbarButton = ({ 
    icon: Icon, 
    title, 
    onClick 
  }: { 
    icon: any, 
    title: string, 
    onClick: () => void 
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // crucial to prevent losing focus on editor while clicking buttons
        onClick();
      }}
      className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
      title={title}
    >
      <Icon size={15} />
    </button>
  );

  return (
    <div className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
      
      {/* WYSIWYG Formatting Toolbar */}
      <div className="flex flex-wrap gap-1 bg-gray-900 border-b border-gray-800 px-3 py-2.5">
        
        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-800 pr-1.5 mr-1.5">
          <ToolbarButton icon={Heading1} title="Heading 1" onClick={() => executeCommand('formatBlock', '<h1>')} />
          <ToolbarButton icon={Heading2} title="Heading 2" onClick={() => executeCommand('formatBlock', '<h2>')} />
          <ToolbarButton icon={Heading3} title="Heading 3" onClick={() => executeCommand('formatBlock', '<h3>')} />
          <ToolbarButton icon={Type} title="Paragraph" onClick={() => executeCommand('formatBlock', '<p>')} />
        </div>

        {/* Text Styles */}
        <div className="flex items-center gap-1 border-r border-gray-800 pr-1.5 mr-1.5">
          <ToolbarButton icon={Bold} title="Bold" onClick={() => executeCommand('bold')} />
          <ToolbarButton icon={Italic} title="Italic" onClick={() => executeCommand('italic')} />
          <ToolbarButton icon={Underline} title="Underline" onClick={() => executeCommand('underline')} />
        </div>

        {/* Lists & Links */}
        <div className="flex items-center gap-1 border-r border-gray-800 pr-1.5 mr-1.5">
          <ToolbarButton icon={List} title="Bullet List" onClick={() => executeCommand('insertUnorderedList')} />
          <ToolbarButton icon={ListOrdered} title="Numbered List" onClick={() => executeCommand('insertOrderedList')} />
          <ToolbarButton icon={Quote} title="Quote Block" onClick={() => executeCommand('formatBlock', '<blockquote>')} />
          <ToolbarButton icon={Link2} title="Add Link" onClick={handleLink} />
          <ToolbarButton icon={Unlink} title="Remove Link" onClick={() => executeCommand('unlink')} />
        </div>

        {/* History Controls */}
        <div className="flex items-center gap-1 border-r border-gray-800 pr-1.5 mr-1.5">
          <ToolbarButton icon={Undo} title="Undo (Ctrl+Z)" onClick={() => executeCommand('undo')} />
          <ToolbarButton icon={Redo} title="Redo (Ctrl+Y)" onClick={() => executeCommand('redo')} />
        </div>

        {/* Text Customization Dropdowns */}
        <div className="flex items-center gap-2 border-r border-gray-800 pr-1.5 mr-1.5">
          {/* Text Color */}
          <select
            onChange={(e) => {
              setTextColor(e.target.value);
              e.target.value = '';
            }}
            defaultValue=""
            className="bg-gray-850 border border-gray-800 rounded px-1.5 py-1 text-[10px] font-black text-gray-400 hover:text-white hover:border-gray-700 bg-gray-900 transition-colors cursor-pointer outline-none"
            title="Text Color"
          >
            <option value="" disabled>Color</option>
            <option value="default" className="text-gray-900 bg-white">Default</option>
            <option value="#1a8b4c" className="text-[#1a8b4c] font-bold bg-white">Green</option>
            <option value="#111827" className="text-gray-900 bg-white">Dark Grey</option>
            <option value="#ef4444" className="text-red-500 bg-white">Red</option>
            <option value="#3b82f6" className="text-blue-500 bg-white">Blue</option>
            <option value="#f97316" className="text-orange-500 bg-white">Orange</option>
            <option value="#a855f7" className="text-purple-500 bg-white">Purple</option>
          </select>

          {/* Font Size */}
          <select
            onChange={(e) => {
              applyInlineStyle('font-size', e.target.value);
              e.target.value = '';
            }}
            defaultValue=""
            className="bg-gray-850 border border-gray-800 rounded px-1.5 py-1 text-[10px] font-black text-gray-400 hover:text-white hover:border-gray-700 bg-gray-900 transition-colors cursor-pointer outline-none"
            title="Font Size"
          >
            <option value="" disabled>Size</option>
            <option value="12px" className="bg-white text-gray-900">Small (12px)</option>
            <option value="15px" className="bg-white text-gray-900">Normal (15px)</option>
            <option value="18px" className="bg-white text-gray-900 font-semibold">Large (18px)</option>
            <option value="24px" className="bg-white text-gray-900 font-bold">X-Large (24px)</option>
            <option value="32px" className="bg-white text-gray-900 font-extrabold">Huge (32px)</option>
          </select>

          {/* Font Style/Family */}
          <select
            onChange={(e) => {
              applyInlineStyle('font-family', e.target.value);
              e.target.value = '';
            }}
            defaultValue=""
            className="bg-gray-850 border border-gray-800 rounded px-1.5 py-1 text-[10px] font-black text-gray-400 hover:text-white hover:border-gray-700 bg-gray-900 transition-colors cursor-pointer outline-none"
            title="Font Family"
          >
            <option value="" disabled>Font</option>
            <option value="'Outfit', sans-serif" className="bg-white text-gray-900 font-sans">Outfit (Sans)</option>
            <option value="Georgia, serif" className="bg-white text-gray-900 font-serif">Georgia (Serif)</option>
            <option value="monospace" className="bg-white text-gray-900 font-mono">Code (Mono)</option>
          </select>
        </div>

        {/* Advanced Layout Templates */}
        <div className="flex flex-wrap items-center gap-1.5 ml-auto">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1 hidden xl:inline select-none">
            Inject Layout:
          </span>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); insertTemplate('grid'); }}
            className="px-2 py-1 bg-gray-800 hover:bg-[#1a8b4c] text-gray-300 hover:text-white rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all"
            title="Insert 2-column grid"
          >
            <LayoutGrid size={11} /> Grid
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); insertTemplate('checklist'); }}
            className="px-2 py-1 bg-gray-800 hover:bg-[#1a8b4c] text-gray-300 hover:text-white rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all hidden sm:flex"
            title="Insert checklist block"
          >
            <CheckCircle size={11} /> Check
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); insertTemplate('quote'); }}
            className="px-2 py-1 bg-gray-800 hover:bg-[#1a8b4c] text-gray-300 hover:text-white rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all hidden lg:flex"
            title="Insert testimonial block"
          >
            <MessageSquare size={11} /> Quote
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); insertTemplate('faq'); }}
            className="px-2 py-1 bg-gray-800 hover:bg-[#1a8b4c] text-gray-300 hover:text-white rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all"
            title="Insert FAQ accordion"
          >
            <HelpCircle size={11} /> FAQ
          </button>

          {/* Remove Layout Block Button */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); removeCurrentLayoutBlock(); }}
            className="px-2.5 py-1 bg-red-950 hover:bg-red-800 border border-red-900 text-red-200 hover:text-white rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all"
            title="Delete the layout block container under your cursor"
          >
            <Trash2 size={11} /> Remove Layout
          </button>
        </div>
      </div>

      {/* Editor Main Canvas (WYSIWYG) */}
      <div 
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={() => { handleBlur(); saveSelection(); }}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onMouseLeave={saveSelection}
        className="w-full min-h-[400px] max-h-[800px] overflow-y-auto px-8 py-8 focus:outline-none bg-white text-gray-800 text-sm md:text-base leading-relaxed font-sans"
        data-placeholder={placeholder || "Start typing your content here visually..."}
        style={{ minHeight: '400px' }}
      >
        {/* React ref handles content injection */}
      </div>

      {/* Helper CSS for placeholder empty state and injected layout outlines */}
      <style dangerouslySetInnerHTML={{__html: `
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block; 
        }
        [contenteditable] {
          word-break: break-word;
        }
        [contenteditable] p {
          margin-bottom: 12px !important;
        }
        [contenteditable] ul {
          list-style-type: disc !important;
          padding-left: 24px !important;
          margin-bottom: 16px !important;
        }
        [contenteditable] ol {
          list-style-type: decimal !important;
          padding-left: 24px !important;
          margin-bottom: 16px !important;
        }
        [contenteditable] li {
          margin-bottom: 4px !important;
          display: list-item !important;
        }
        [contenteditable] h1 {
          font-size: 28px !important;
          font-weight: 900 !important;
          color: #111827 !important;
          margin-top: 32px !important;
          margin-bottom: 16px !important;
        }
        [contenteditable] h2 {
          font-size: 22px !important;
          font-weight: 800 !important;
          color: #111827 !important;
          margin-top: 24px !important;
          margin-bottom: 12px !important;
        }
        [contenteditable] h3 {
          font-size: 18px !important;
          font-weight: 700 !important;
          color: #1a8b4c !important;
          margin-top: 20px !important;
          margin-bottom: 8px !important;
        }
        [contenteditable] blockquote {
          border-left: 4px solid #1a8b4c !important;
          padding-left: 16px !important;
          font-style: italic !important;
          color: #6b7280 !important;
          margin-bottom: 16px !important;
          margin-top: 16px !important;
        }
        [contenteditable] a {
          color: #2563eb !important;
          text-decoration: underline !important;
        }
        /* Ensure details tags in editable area are visually clear */
        [contenteditable] details {
          border: 1px dashed #e5e7eb !important;
          padding: 10px !important;
        }
        
        /* User-Friendly Injected Layout styling and selections */
        [contenteditable] .injected-layout {
          position: relative;
          transition: all 0.2s ease;
        }
        [contenteditable] .injected-layout:hover {
          outline: 2px dashed #1a8b4c !important;
          outline-offset: 4px;
        }
        [contenteditable] .injected-layout:focus-within {
          outline: 2px dashed #1a8b4c !important;
          outline-offset: 4px;
        }

        /* Location Tag Highlight Style */
        .location-tag {
          font-weight: 850;
          color: #16a34a !important;
          background-color: #f0fdf4 !important;
          border: 1px solid #bbf7d0 !important;
          padding: 2px 6px !important;
          border-radius: 6px !important;
          font-family: monospace !important;
          display: inline-block !important;
          margin: 0 2px !important;
          user-select: all !important;
        }
      `}} />

    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Link2, Unlink, 
  Paintbrush, Undo, Redo, Code, Eye,
  ChevronDown, Palette, Type, HelpCircle
} from 'lucide-react';

interface RichTextInlineEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  singleLine?: boolean;
}

export default function RichTextInlineEditor({
  value,
  onChange,
  placeholder,
  singleLine = false,
}: RichTextInlineEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const savedSelection = useRef<Range | null>(null);
  
  const [isFocused, setIsFocused] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [activeHeading, setActiveHeading] = useState('Paragraph');
  
  // Dropdown states
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showHighlightDropdown, setShowHighlightDropdown] = useState(false);

  // Set initial content on mount
  useEffect(() => {
    if (editorRef.current && !isHtmlMode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, []);

  // Update content dynamically if updated externally (but not when user is typing to avoid cursor jumping)
  useEffect(() => {
    if (!isHtmlMode) {
      if (editorRef.current && value !== undefined) {
        if (editorRef.current.innerHTML !== value) {
          if (document.activeElement !== editorRef.current) {
            editorRef.current.innerHTML = value || '';
          }
        }
      }
    }
  }, [value, isHtmlMode]);

  // Sync cursor/heading states when selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      if (document.activeElement === editorRef.current) {
        detectHeading();
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [isHtmlMode]);

  const handleInput = () => {
    if (isHtmlMode) {
      if (textareaRef.current) {
        onChange(textareaRef.current.value);
      }
    } else {
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
        detectHeading();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (singleLine && e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedSelection.current = range;
      }
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
    if (isHtmlMode) return;
    restoreSelection();
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    saveSelection();
    handleInput();
  };

  const detectHeading = () => {
    if (isHtmlMode || !editorRef.current) return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      let node = range.commonAncestorContainer;
      
      // Traverse up to find tag name
      while (node && node !== editorRef.current) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = (node as Element).tagName.toUpperCase();
          if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE'].includes(tagName)) {
            setActiveHeading(tagName === 'BLOCKQUOTE' ? 'Quote' : tagName);
            return;
          }
        }
        node = node.parentNode!;
      }
    }
    setActiveHeading('Paragraph');
  };

  // Advanced formatting helpers
  const applyHeading = (headingTag: string) => {
    executeCommand('formatBlock', headingTag === 'Paragraph' ? '<p>' : `<${headingTag}>`);
    setShowHeadingDropdown(false);
  };

  const toggleGreenHighlight = () => {
    restoreSelection();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (range.collapsed) return;
      if (!editorRef.current || !editorRef.current.contains(range.commonAncestorContainer)) return;

      const span = document.createElement('span');
      span.className = 'text-[#1a8b4c] font-black';
      
      try {
        span.appendChild(range.extractContents());
        range.insertNode(span);
        handleInput();
      } catch (e) {
        console.error('Failed to apply green text highlight', e);
      }
    }
  };

  const applyTextColor = (color: string) => {
    executeCommand('foreColor', color);
    setShowColorDropdown(false);
  };

  const applyTextHighlight = (color: string) => {
    executeCommand('hiliteColor', color);
    setShowHighlightDropdown(false);
  };

  const handleLink = () => {
    const url = prompt('Enter link URL (e.g., https://example.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const handleClearFormat = () => {
    restoreSelection();
    document.execCommand('removeFormat', false);
    
    // Clear custom styling wrappers inside range
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed && editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        const container = document.createElement('div');
        container.appendChild(range.cloneContents());
        const cleanedText = container.textContent || '';
        range.deleteContents();
        range.insertNode(document.createTextNode(cleanedText));
      }
    }
    
    editorRef.current?.focus();
    saveSelection();
    handleInput();
  };

  const toggleHtmlMode = () => {
    if (isHtmlMode) {
      // Transitioning back to rich visual editor
      const tempContent = textareaRef.current?.value || '';
      setIsHtmlMode(false);
      
      // Delay slightly to wait for React to swap input fields
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = tempContent;
          onChange(tempContent);
        }
      }, 50);
    } else {
      // Transitioning to raw html mode
      const tempContent = editorRef.current?.innerHTML || '';
      setIsHtmlMode(true);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.value = tempContent;
          onChange(tempContent);
        }
      }, 50);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.editor-dropdown-container')) {
        setShowHeadingDropdown(false);
        setShowColorDropdown(false);
        setShowHighlightDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const ToolbarButton = ({
    icon: Icon,
    title,
    onClick,
    isActive = false,
    disabled = false
  }: {
    icon: any;
    title: string;
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`p-1.5 rounded transition-all flex items-center justify-center ${
        disabled ? 'opacity-30 cursor-not-allowed' : ''
      } ${
        isActive 
          ? 'bg-[#1a8b4c] text-white' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
      title={title}
    >
      <Icon size={14} />
    </button>
  );

  return (
    <div className={`flex flex-col border rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-200 ${
      isFocused ? 'border-[#1a8b4c] ring-2 ring-green-100' : 'border-gray-200'
    }`}>
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 bg-gray-950 px-2 py-1.5 border-b border-gray-900 select-none">
        
        {/* Style actions */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton icon={Bold} title="Bold" onClick={() => executeCommand('bold')} disabled={isHtmlMode} />
          <ToolbarButton icon={Italic} title="Italic" onClick={() => executeCommand('italic')} disabled={isHtmlMode} />
          <ToolbarButton icon={Underline} title="Underline" onClick={() => executeCommand('underline')} disabled={isHtmlMode} />
          <ToolbarButton icon={Strikethrough} title="Strikethrough" onClick={() => executeCommand('strikeThrough')} disabled={isHtmlMode} />
        </div>

        <div className="w-[1px] h-4 bg-gray-800 mx-0.5" />

        {/* Headings & Text formats (Non-singleline only) */}
        {!singleLine && (
          <>
            <div className="relative editor-dropdown-container">
              <button
                type="button"
                disabled={isHtmlMode}
                onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
                className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-colors flex items-center gap-1 min-w-[90px] justify-between disabled:opacity-30"
              >
                <span>{activeHeading}</span>
                <ChevronDown size={12} className="opacity-65" />
              </button>

              {showHeadingDropdown && (
                <div className="absolute left-0 mt-1 z-30 min-w-[130px] rounded-lg bg-gray-900 border border-gray-800 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="flex flex-col p-1">
                    {['Paragraph', 'H1', 'H2', 'H3', 'H4', 'Quote'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => applyHeading(tag)}
                        className={`w-full text-left px-2.5 py-1.5 text-xs font-medium rounded hover:bg-gray-800 hover:text-white transition-colors ${
                          (tag === 'Paragraph' && activeHeading === 'Paragraph') || (tag === activeHeading)
                            ? 'text-[#1a8b4c] bg-gray-800/40' 
                            : 'text-gray-400'
                        }`}
                      >
                        {tag === 'Paragraph' ? 'Body Paragraph' : tag === 'Quote' ? 'Blockquote' : `Heading ${tag.replace('H', '')}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-[1px] h-4 bg-gray-800 mx-0.5" />

            {/* Alignments */}
            <div className="flex items-center gap-0.5">
              <ToolbarButton icon={AlignLeft} title="Align Left" onClick={() => executeCommand('justifyLeft')} disabled={isHtmlMode} />
              <ToolbarButton icon={AlignCenter} title="Align Center" onClick={() => executeCommand('justifyCenter')} disabled={isHtmlMode} />
              <ToolbarButton icon={AlignRight} title="Align Right" onClick={() => executeCommand('justifyRight')} disabled={isHtmlMode} />
              <ToolbarButton icon={AlignJustify} title="Align Justify" onClick={() => executeCommand('justifyFull')} disabled={isHtmlMode} />
            </div>

            <div className="w-[1px] h-4 bg-gray-800 mx-0.5" />

            {/* Lists */}
            <div className="flex items-center gap-0.5">
              <ToolbarButton icon={List} title="Bullet List" onClick={() => executeCommand('insertUnorderedList')} disabled={isHtmlMode} />
              <ToolbarButton icon={ListOrdered} title="Numbered List" onClick={() => executeCommand('insertOrderedList')} disabled={isHtmlMode} />
            </div>

            <div className="w-[1px] h-4 bg-gray-800 mx-0.5" />
          </>
        )}

        {/* Colors & Highlights */}
        <div className="flex items-center gap-1 select-none">
          {/* Brand Green Highlight */}
          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleGreenHighlight();
            }}
            className="px-2 py-0.5 rounded text-[10px] font-black text-[#1a8b4c] border border-[#1a8b4c]/30 bg-green-950/20 hover:bg-[#1a8b4c] hover:text-white transition-all flex items-center gap-1 disabled:opacity-30 disabled:hover:bg-green-950/20 disabled:hover:text-[#1a8b4c]"
            title="Format text in Brand Green"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a8b4c]" />
            Green Text
          </button>

          {/* Text Color Picker */}
          {!singleLine && (
            <div className="relative editor-dropdown-container">
              <button
                type="button"
                disabled={isHtmlMode}
                onClick={() => setShowColorDropdown(!showColorDropdown)}
                className="p-1.5 bg-gray-900 border border-gray-800 hover:bg-gray-800 hover:border-gray-700 text-gray-400 hover:text-white rounded transition-colors flex items-center justify-center disabled:opacity-30"
                title="Text Color"
              >
                <Palette size={14} />
              </button>

              {showColorDropdown && (
                <div className="absolute left-0 mt-1 z-30 p-2.5 rounded-xl bg-gray-950 border border-gray-800 shadow-2xl animate-in fade-in duration-100 min-w-[140px]">
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Text Color</div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {['#000000', '#4b5563', '#9ca3af', '#ef4444', '#f97316', '#eab308', '#22c55e', '#1a8b4c', '#3b82f6', '#8b5cf6'].map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => applyTextColor(hex)}
                        className="w-5 h-5 rounded-md border border-gray-800 hover:scale-110 active:scale-95 transition-all shadow-sm"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => applyTextColor('#000000')}
                    className="w-full text-center mt-2.5 px-2 py-1 border border-gray-800 hover:bg-gray-800 text-[10px] font-semibold text-gray-300 rounded-md transition-colors"
                  >
                    Reset Color
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Highlight Background Color */}
          {!singleLine && (
            <div className="relative editor-dropdown-container">
              <button
                type="button"
                disabled={isHtmlMode}
                onClick={() => setShowHighlightDropdown(!showHighlightDropdown)}
                className="p-1.5 bg-gray-900 border border-gray-800 hover:bg-gray-800 hover:border-gray-700 text-gray-400 hover:text-white rounded transition-colors flex items-center justify-center disabled:opacity-30"
                title="Highlight Color"
              >
                <span className="relative flex items-center justify-center">
                  <Type size={14} />
                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                </span>
              </button>

              {showHighlightDropdown && (
                <div className="absolute left-0 mt-1 z-30 p-2.5 rounded-xl bg-gray-950 border border-gray-800 shadow-2xl animate-in fade-in duration-100 min-w-[140px]">
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Highlight Color</div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa', '#ffffff'].map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => applyTextHighlight(hex)}
                        className="w-5 h-5 rounded-md border border-gray-800 hover:scale-110 active:scale-95 transition-all shadow-sm"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => applyTextHighlight('transparent')}
                    className="w-full text-center mt-2.5 px-2 py-1 border border-gray-800 hover:bg-gray-800 text-[10px] font-semibold text-gray-300 rounded-md transition-colors"
                  >
                    Clear Highlight
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-[1px] h-4 bg-gray-800 mx-0.5" />

        {/* Links */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton icon={Link2} title="Insert Link" onClick={handleLink} disabled={isHtmlMode} />
          <ToolbarButton icon={Unlink} title="Remove Link" onClick={() => executeCommand('unlink')} disabled={isHtmlMode} />
        </div>

        <div className="w-[1px] h-4 bg-gray-800 mx-0.5" />

        {/* Formatting cleaner */}
        <ToolbarButton icon={Paintbrush} title="Clear Formatting" onClick={handleClearFormat} disabled={isHtmlMode} />

        <div className="w-[1px] h-4 bg-gray-800 mx-0.5" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton icon={Undo} title="Undo" onClick={() => executeCommand('undo')} disabled={isHtmlMode} />
          <ToolbarButton icon={Redo} title="Redo" onClick={() => executeCommand('redo')} disabled={isHtmlMode} />
        </div>

        {/* Mode Toggle: Visual / HTML Source Code */}
        {!singleLine && (
          <button
            type="button"
            onClick={toggleHtmlMode}
            className={`ml-auto px-2 py-1 rounded text-[10px] font-black border uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              isHtmlMode 
                ? 'bg-amber-600 text-white border-amber-700 shadow-md' 
                : 'text-gray-400 border-gray-800 bg-gray-900 hover:bg-gray-800 hover:text-white'
            }`}
            title={isHtmlMode ? "Switch to Visual Editor" : "View HTML Source Code"}
          >
            {isHtmlMode ? <Eye size={12} /> : <Code size={12} />}
            <span>{isHtmlMode ? 'Visual' : 'HTML Code'}</span>
          </button>
        )}
      </div>

      {/* Editor Content Area */}
      <div className="relative flex-1 bg-white min-h-[350px] flex flex-col">
        {!isHtmlMode ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              saveSelection();
              handleInput();
            }}
            onMouseUp={saveSelection}
            onKeyUp={saveSelection}
            className={`w-full flex-1 px-5 py-4 bg-white text-gray-800 focus:outline-none font-medium text-[14px] leading-relaxed overflow-y-auto select-text min-h-[350px] outline-none border-0 ${
              singleLine ? 'whitespace-nowrap overflow-x-auto min-h-[46px]' : ''
            }`}
            data-placeholder={placeholder || 'Type here...'}
          />
        ) : (
          <textarea
            ref={textareaRef}
            onChange={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full flex-1 p-5 bg-gray-900 text-gray-200 font-mono text-xs leading-relaxed focus:outline-none min-h-[350px] border-0 outline-none resize-y selection:bg-gray-800"
            placeholder="<html> Enter raw code here..."
          />
        )}
      </div>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
        [contenteditable] a {
          color: #1a8b4c !important;
          text-decoration: underline !important;
          font-weight: 700;
        }
        [contenteditable] strong {
          font-weight: 800 !important;
        }
        [contenteditable] em {
          font-style: italic !important;
        }
        [contenteditable] blockquote {
          border-left: 4px solid #1a8b4c;
          padding-left: 1rem;
          margin-left: 0;
          color: #4b5563;
          font-style: italic;
          background-color: #f3f4f6;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
          border-radius: 0 4px 4px 0;
        }
        [contenteditable] ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        [contenteditable] ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        [contenteditable] h1 {
          font-size: 1.875rem;
          font-weight: 800;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.25;
        }
        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          line-height: 1.35;
        }
        [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        [contenteditable] h4 {
          font-size: 1.125rem;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
      `}} />
    </div>
  );
}

"use client";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faListUl,
  faListOl,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "本文を入力してください...",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    "#000000",
    "#333333",
    "#E67E22",
    "#2C3E50",
    "#DC3545",
    "#28A745",
    "#007BFF",
    "#6F42C1",
  ];

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const formatBlock = (tag: string) => {
    execCommand("formatBlock", tag);
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const applyColor = (color: string) => {
    execCommand("foreColor", color);
    setShowColorPicker(false);
  };

  // 初回レンダリング時のみコンテンツをセット
  const handleRef = (node: HTMLDivElement | null) => {
    if (node && node !== editorRef.current) {
      editorRef.current = node;
      if (value && node.innerHTML !== value) {
        node.innerHTML = value;
      }
    }
  };

  return (
    <div className="rounded-lg border border-[#CED4DA]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[#E5E5E5] bg-[#F5F7FA] p-2">
        {/* Text Style */}
        <div className="flex gap-1 border-r border-[#E5E5E5] pr-2">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand("bold");
            }}
            className="flex h-8 w-8 items-center justify-center rounded text-[#2C3E50] transition-colors hover:bg-white"
            title="太字"
          >
            <FontAwesomeIcon icon={faBold} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand("italic");
            }}
            className="flex h-8 w-8 items-center justify-center rounded text-[#2C3E50] transition-colors hover:bg-white"
            title="斜体"
          >
            <FontAwesomeIcon icon={faItalic} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand("underline");
            }}
            className="flex h-8 w-8 items-center justify-center rounded text-[#2C3E50] transition-colors hover:bg-white"
            title="下線"
          >
            <FontAwesomeIcon icon={faUnderline} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand("strikeThrough");
            }}
            className="flex h-8 w-8 items-center justify-center rounded text-[#2C3E50] transition-colors hover:bg-white"
            title="取り消し線"
          >
            <FontAwesomeIcon icon={faStrikethrough} />
          </button>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-[#E5E5E5] pr-2">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              formatBlock("h1");
            }}
            className="flex h-8 w-8 items-center justify-center rounded text-[#2C3E50] transition-colors hover:bg-white"
            title="見出し1"
          >
            H1
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              formatBlock("h2");
            }}
            className="flex h-8 w-8 items-center justify-center rounded text-[#2C3E50] transition-colors hover:bg-white"
            title="見出し2"
          >
            H2
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              formatBlock("h3");
            }}
            className="flex h-8 w-8 items-center justify-center rounded text-[#2C3E50] transition-colors hover:bg-white"
            title="見出し3"
          >
            H3
          </button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-[#E5E5E5] pr-2">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand("insertUnorderedList");
            }}
            className="flex h-8 w-8 items-center justify-center rounded text-[#2C3E50] transition-colors hover:bg-white"
            title="箇条書き"
          >
            <FontAwesomeIcon icon={faListUl} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand("insertOrderedList");
            }}
            className="flex h-8 w-8 items-center justify-center rounded text-[#2C3E50] transition-colors hover:bg-white"
            title="番号付きリスト"
          >
            <FontAwesomeIcon icon={faListOl} />
          </button>
        </div>

        {/* Color Picker */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setShowColorPicker(!showColorPicker);
            }}
            className="flex h-8 w-8 items-center justify-center rounded text-[#2C3E50] transition-colors hover:bg-white"
            title="文字色"
          >
            <FontAwesomeIcon icon={faPalette} />
          </button>
          {showColorPicker && (
            <div className="absolute left-0 top-full z-10 mt-1 grid grid-cols-4 gap-2 rounded border border-[#E5E5E5] bg-white p-2 shadow-lg">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyColor(color);
                  }}
                  className="h-6 w-6 rounded border border-[#E5E5E5] transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div
        ref={handleRef}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        className="min-h-[300px] p-4 text-[#333333] leading-[1.8] focus:outline-none"
        data-placeholder={placeholder}
        style={{
          fontSize: '16px',
        }}
      />

      <style jsx>{`
        [contentEditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #7f8c8d;
          pointer-events: none;
        }
        [contentEditable] :global(h1) {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        [contentEditable] :global(h2) {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        [contentEditable] :global(h3) {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        [contentEditable] :global(ul),
        [contentEditable] :global(ol) {
          margin: 1em 0;
          padding-left: 2em;
        }
        [contentEditable] :global(li) {
          margin: 0.5em 0;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;

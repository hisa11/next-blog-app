"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Markdownで本文を入力してください...",
}) => {
  return (
    <div className="flex h-[600px] gap-4">
      {/* Editor Pane */}
      <div className="flex w-1/2 flex-col">
        <div className="mb-2 rounded-t-lg bg-[#F5F7FA] px-4 py-2 text-sm font-medium text-[#2C3E50]">
          Markdown編集
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="form-textarea min-h-0 flex-1 resize-none rounded-b-lg rounded-t-none font-mono text-sm leading-[1.6]"
        />
      </div>

      {/* Preview Pane */}
      <div className="flex w-1/2 flex-col">
        <div className="mb-2 rounded-t-lg bg-[#F5F7FA] px-4 py-2 text-sm font-medium text-[#2C3E50]">
          プレビュー
        </div>
        <div className="flex-1 overflow-y-auto rounded-lg rounded-t-none border border-[#CED4DA] bg-white p-4">
          <div className="article-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {value || "*プレビューがここに表示されます*"}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;

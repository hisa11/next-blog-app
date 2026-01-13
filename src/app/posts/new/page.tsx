"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPaperPlane,
  faTimes,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import RichTextEditor from "@/app/_components/RichTextEditor";
import MarkdownEditor from "@/app/_components/MarkdownEditor";

type Category = {
  id: string;
  name: string;
};

const NewPostPage: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageURL, setCoverImageURL] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("カテゴリの取得に失敗しました", error);
      }
    };
    fetchCategories();
  }, []);

  const addTag = (raw: string) => {
    const name = raw.replace(/^#/, "").trim();
    if (!name) return;
    setTags((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setInputValue("");
  };

  const removeTag = (name: string) => {
    setTags((prev) => prev.filter((t) => t !== name));
  };

  useEffect(() => {
    if (!inputValue) {
      setSuggestions([]);
      return;
    }
    const q = inputValue.replace(/^#/, "").toLowerCase();
    setSuggestions(
      categories
        .filter(
          (c) => c.name.toLowerCase().includes(q) && !tags.includes(c.name)
        )
        .slice(0, 8)
    );
  }, [inputValue, categories, tags]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          coverImageURL,
          categoryNames: tags,
        }),
      });

      if (response.ok) {
        alert("投稿を作成しました");
        router.push("/");
      } else {
        const error = await response.json();
        alert(`エラー: ${error.error}`);
      }
    } catch (error) {
      console.error("投稿の作成に失敗しました", error);
      alert("投稿の作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-[60px]">
      <div className="container mx-auto max-w-[720px] px-4">
        {/* Back Link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#7F8C8D] transition-colors hover:text-[#E67E22]"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          一覧に戻る
        </Link>

        {/* Page Title */}
        <h1 className="mb-10 text-[32px] font-bold text-[#2C3E50]">新規投稿</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div className="form-group">
            <label className="form-label">タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="記事のタイトルを入力"
              className="form-input"
            />
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">タグ（例: #たまご）</label>

            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t} className="tag">
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="tag-remove"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag Input */}
            <div className="relative">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "," || e.key === " ") {
                    e.preventDefault();
                    if (inputValue.trim()) addTag(inputValue);
                  }
                }}
                placeholder="#タグ名 を入力して Enter"
                className="form-input"
              />

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <ul className="suggestions">
                  {suggestions.map((s) => (
                    <li key={s.id} onClick={() => addTag(s.name)}>
                      #{s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="mt-2 text-xs text-[#7F8C8D]">
              存在しないタグを入力すると、自動的に作成されます
            </p>
          </div>

          {/* Cover Image URL */}
          <div className="form-group">
            <label className="form-label">カバー画像URL</label>
            <input
              type="url"
              value={coverImageURL}
              onChange={(e) => setCoverImageURL(e.target.value)}
              required
              placeholder="https://example.com/image.jpg"
              className="form-input"
            />
            {/* Preview */}
            {coverImageURL && (
              <div className="mt-4 overflow-hidden rounded-lg border border-[#E5E5E5]">
                <img
                  src={coverImageURL}
                  alt="プレビュー"
                  className="aspect-video w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="form-group">
            <div className="mb-3 flex items-center justify-between">
              <label className="form-label mb-0">本文</label>
              <button
                type="button"
                onClick={() => setIsMarkdownMode(!isMarkdownMode)}
                className="flex items-center gap-2 rounded-md bg-[#F5F7FA] px-4 py-2 text-sm font-medium text-[#2C3E50] transition-colors hover:bg-[#E5E5E5]"
              >
                <FontAwesomeIcon
                  icon={isMarkdownMode ? faToggleOn : faToggleOff}
                  className={isMarkdownMode ? "text-[#E67E22]" : ""}
                />
                {isMarkdownMode ? "Markdownモード" : "リッチテキストモード"}
              </button>
            </div>

            {isMarkdownMode ? (
              <MarkdownEditor
                value={content}
                onChange={setContent}
                placeholder="Markdownで記事の内容を入力してください..."
              />
            ) : (
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="記事の内容を入力してください..."
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 sm:flex-none"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
              {loading ? "作成中..." : "投稿する"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="btn-secondary"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewPostPage;

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave, faTimes, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import RichTextEditor from "@/app/_components/RichTextEditor";
import MarkdownEditor from "@/app/_components/MarkdownEditor";

type Category = { id: string; name: string };
type PostCategory = { category: Category };
type Post = { id: string; title: string; content: string; coverImageURL: string; categories: PostCategory[] };
type Params = { id: string };

const AdminEditPostPage: React.FC<{ params: Promise<Params> }> = ({ params }) => {
    const router = useRouter();
    const [postId, setPostId] = useState<string>("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [coverImageURL, setCoverImageURL] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isMarkdownMode, setIsMarkdownMode] = useState(false);

    useEffect(() => {
        params.then((p) => setPostId(p.id));
    }, [params]);

    useEffect(() => {
        if (!postId) return;

        const fetchData = async () => {
            try {
                const categoriesResponse = await fetch("/api/categories");
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);

                const postResponse = await fetch(`/api/posts/${postId}`);
                if (postResponse.ok) {
                    const postData: Post = await postResponse.json();
                    setTitle(postData.title);
                    setContent(postData.content);
                    setCoverImageURL(postData.coverImageURL);
                    setTags(postData.categories.map((pc) => pc.category.name));
                } else {
                    alert("投稿が見つかりませんでした");
                    router.push("/admin/posts");
                }
            } catch (error) {
                console.error("データの取得に失敗しました", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [postId, router]);

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
                .filter((c) => c.name.toLowerCase().includes(q) && !tags.includes(c.name))
                .slice(0, 8),
        );
    }, [inputValue, categories, tags]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch(`/api/admin/posts/${postId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, coverImageURL, categoryNames: tags }),
            });

            if (response.ok) {
                alert("投稿を更新しました");
                router.push(`/admin/posts`);
            } else {
                const error = await response.json();
                alert(`エラー: ${error.error}`);
            }
        } catch (error) {
            console.error("投稿の更新に失敗しました", error);
            alert("投稿の更新に失敗しました");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[300px] sm:min-h-[400px] items-center justify-center px-4">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-4 border-[#E67E22] border-t-transparent"></div>
                    <p className="text-sm sm:text-base text-[#7F8C8D]">読み込み中...</p>
                </div>
            </div>
        );
    }

    return (
        <section className="py-6 sm:py-10 md:py-[60px]">
            <div className="container mx-auto max-w-[720px] px-3 sm:px-4">
                <Link href={`/admin/posts`} className="mb-6 sm:mb-8 inline-flex items-center gap-2 text-xs sm:text-sm text-[#7F8C8D] hover:text-[#E67E22] transition-colors">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-xs" /> 一覧に戻る
                </Link>

                <h1 className="mb-6 sm:mb-10 text-xl sm:text-2xl md:text-[32px] font-bold text-[#2C3E50]">投稿を編集（管理）</h1>

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    <div className="form-group">
                        <label className="form-label">タイトル</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="記事のタイトルを入力" className="form-input" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">タグ（例: #たまご）</label>

                        {tags.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-1.5 sm:gap-2">
                                {tags.map((t) => (
                                    <span key={t} className="tag">
                                        <span>#{t}</span>
                                        <button type="button" onClick={() => removeTag(t)} className="tag-remove">
                                            <FontAwesomeIcon icon={faTimes} className="text-xs" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="relative">
                            <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === "," || e.key === " ") { e.preventDefault(); if (inputValue.trim()) addTag(inputValue); } }} placeholder="#タグ名 を入力して Enter" className="form-input" />

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
                        <p className="mt-2 text-xs text-[#7F8C8D]">存在しないタグを入力すると、自動的に作成されます</p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">カバー画像URL</label>
                        <input type="url" value={coverImageURL} onChange={(e) => setCoverImageURL(e.target.value)} required placeholder="https://example.com/image.jpg" className="form-input" />
                        {coverImageURL && (
                            <div className="mt-3 sm:mt-4 overflow-hidden rounded-lg border border-[#E5E5E5]">
                                <img src={coverImageURL} alt="プレビュー" className="aspect-video w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <label className="form-label mb-0">本文</label>
                            <button type="button" onClick={() => setIsMarkdownMode(!isMarkdownMode)} className="flex items-center gap-1.5 sm:gap-2 rounded-md bg-[#F5F7FA] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#2C3E50] transition-colors hover:bg-[#E5E5E5]">
                                <FontAwesomeIcon icon={isMarkdownMode ? faToggleOn : faToggleOff} className={`text-sm ${isMarkdownMode ? "text-[#E67E22]" : ""}`} />
                                {isMarkdownMode ? "Markdownモード" : "リッチテキストモード"}
                            </button>
                        </div>

                        {isMarkdownMode ? (
                            <MarkdownEditor value={content} onChange={setContent} placeholder="Markdownで記事の内容を入力してください..." />
                        ) : (
                            <RichTextEditor value={content} onChange={setContent} placeholder="記事の内容を入力してください..." />
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2 sm:pt-4">
                        <button type="submit" disabled={submitting} className="btn-primary flex-1 sm:flex-none justify-center">
                            <FontAwesomeIcon icon={faSave} className="mr-2 text-sm" />
                            {submitting ? "更新中..." : "更新する"}
                        </button>
                        <button type="button" onClick={() => router.push(`/admin/posts`)} className="btn-secondary flex-1 sm:flex-none justify-center">キャンセル</button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AdminEditPostPage;

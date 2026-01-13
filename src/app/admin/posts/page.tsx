"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type Category = { id: string; name: string };
type PostCategory = { category: Category };
type Post = { id: string; title: string; createdAt: string; categories: PostCategory[] };

const AdminPostsPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/posts");
            const data = await res.json();
            setPosts(data);
        } catch (e) {
            console.error(e);
            alert("投稿の取得に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("投稿を削除しますか？この操作は元に戻せません。")) return;
        try {
            const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
            if (res.ok) {
                alert("投稿を削除しました");
                fetchPosts();
            } else {
                const err = await res.json();
                alert(`エラー: ${err.error}`);
            }
        } catch (e) {
            console.error(e);
            alert("削除に失敗しました");
        }
    };

    if (loading) return <p className="p-8">読み込み中...</p>;

    return (
        <section className="py-6 sm:py-10 md:py-[40px]">
            <div className="container mx-auto px-3 sm:px-4">
                <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h1 className="text-xl sm:text-2xl font-bold">投稿管理</h1>
                    <Link href="/" className="btn-secondary inline-flex items-center gap-2 text-sm sm:text-base">
                        <FontAwesomeIcon icon={faArrowLeft} className="text-sm" /> <span className="hidden sm:inline">ホーム</span><span className="sm:hidden">戻る</span>
                    </Link>
                </div>

                {/* デスクトップ: テーブル表示 */}
                <div className="hidden lg:block overflow-x-auto rounded-lg border">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100 text-left text-sm text-gray-600">
                            <tr>
                                <th className="px-4 py-3">タイトル</th>
                                <th className="px-4 py-3">カテゴリ</th>
                                <th className="px-4 py-3">作成日</th>
                                <th className="px-4 py-3">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((p) => (
                                <tr key={p.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{p.title}</td>
                                    <td className="px-4 py-3 text-sm">
                                        {p.categories.map((c) => (
                                            <span key={c.category.id} className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs mr-1 mb-1">#{c.category.name}</span>
                                        ))}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(p.createdAt).toLocaleDateString('ja-JP')}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link href={`/admin/posts/${p.id}`} className="btn-tertiary inline-flex items-center gap-1.5 text-sm">
                                                <FontAwesomeIcon icon={faEdit} className="text-xs" /> 編集
                                            </Link>
                                            <button onClick={() => handleDelete(p.id)} className="btn-danger inline-flex items-center gap-1.5 text-sm">
                                                <FontAwesomeIcon icon={faTrash} className="text-xs" /> 削除
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* モバイル/タブレット: カード表示 */}
                <div className="lg:hidden space-y-4">
                    {posts.map((p) => (
                        <div key={p.id} className="bg-white border rounded-lg p-4 sm:p-5 shadow-sm">
                            <div className="mb-3">
                                <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2">{p.title}</h3>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {p.categories.map((c) => (
                                        <span key={c.category.id} className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">#{c.category.name}</span>
                                    ))}
                                </div>
                                <p className="text-xs sm:text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString('ja-JP')}</p>
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/admin/posts/${p.id}`} className="btn-tertiary flex-1 justify-center inline-flex items-center gap-1.5 text-sm">
                                    <FontAwesomeIcon icon={faEdit} className="text-xs" /> 編集
                                </Link>
                                <button onClick={() => handleDelete(p.id)} className="btn-danger flex-1 justify-center inline-flex items-center gap-1.5 text-sm">
                                    <FontAwesomeIcon icon={faTrash} className="text-xs" /> 削除
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AdminPostsPage;

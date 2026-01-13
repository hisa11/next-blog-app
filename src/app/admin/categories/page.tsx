"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type Category = {
    id: string;
    name: string;
    createdAt: string;
};

const AdminCategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data);
        } catch (e) {
            console.error(e);
            alert("カテゴリの取得に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("カテゴリを削除しますか？この操作は元に戻せません。")) return;
        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
            if (res.ok) {
                alert("カテゴリを削除しました");
                fetchCategories();
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
                    <h1 className="text-xl sm:text-2xl font-bold">カテゴリ管理</h1>
                    <Link href="/" className="btn-secondary inline-flex items-center gap-2 text-sm sm:text-base">
                        <FontAwesomeIcon icon={faArrowLeft} className="text-sm" /> <span className="hidden sm:inline">ホーム</span><span className="sm:hidden">戻る</span>
                    </Link>
                </div>

                {/* デスクトップ: テーブル表示 */}
                <div className="hidden md:block overflow-x-auto rounded-lg border">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100 text-left text-sm text-gray-600">
                            <tr>
                                <th className="px-4 py-3">名前</th>
                                <th className="px-4 py-3">作成日</th>
                                <th className="px-4 py-3">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((c) => (
                                <tr key={c.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{c.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(c.createdAt).toLocaleDateString('ja-JP')}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link href={`/admin/categories/${c.id}`} className="btn-tertiary inline-flex items-center gap-1.5 text-sm">
                                                <FontAwesomeIcon icon={faEdit} className="text-xs" /> 編集
                                            </Link>
                                            <button onClick={() => handleDelete(c.id)} className="btn-danger inline-flex items-center gap-1.5 text-sm">
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
                <div className="md:hidden space-y-3">
                    {categories.map((c) => (
                        <div key={c.id} className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1">{c.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString('ja-JP')}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/admin/categories/${c.id}`} className="btn-tertiary flex-1 justify-center inline-flex items-center gap-1.5 text-sm">
                                    <FontAwesomeIcon icon={faEdit} className="text-xs" /> 編集
                                </Link>
                                <button onClick={() => handleDelete(c.id)} className="btn-danger flex-1 justify-center inline-flex items-center gap-1.5 text-sm">
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

export default AdminCategoriesPage;

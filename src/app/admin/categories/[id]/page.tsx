"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type Category = { id: string; name: string; createdAt: string };
type Params = { id: string };

const AdminCategoryEditPage: React.FC<{ params: Promise<Params> }> = ({ params }) => {
    const [id, setId] = useState<string>("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        params.then((p) => setId(p.id));
    }, [params]);

    useEffect(() => {
        if (!id) return;
        const fetchCategory = async () => {
            try {
                const res = await fetch("/api/categories");
                const data: Category[] = await res.json();
                const c = data.find((x) => x.id === id);
                if (!c) {
                    alert("カテゴリが見つかりませんでした");
                    router.push("/admin/categories");
                    return;
                }
                setName(c.name);
            } catch (e) {
                console.error(e);
                alert("カテゴリの取得に失敗しました");
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id, router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            if (res.ok) {
                alert("カテゴリを更新しました");
                router.push("/admin/categories");
            } else {
                const err = await res.json();
                alert(`エラー: ${err.error}`);
            }
        } catch (e) {
            console.error(e);
            alert("更新に失敗しました");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("カテゴリを削除しますか？この操作は元に戻せません。")) return;
        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
            if (res.ok) {
                alert("カテゴリを削除しました");
                router.push("/admin/categories");
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
            <div className="container mx-auto px-3 sm:px-4 max-w-[720px]">
                <Link href="/admin/categories" className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-xs" /> 一覧に戻る
                </Link>

                <h1 className="mb-6 sm:mb-8 text-xl sm:text-2xl font-bold">カテゴリを編集</h1>

                <form onSubmit={handleSave} className="space-y-5 sm:space-y-6">
                    <div>
                        <label className="form-label">名前</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="form-input" required />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                        <button type="submit" disabled={saving} className="btn-primary flex-1 sm:flex-none justify-center inline-flex items-center gap-2">
                            <FontAwesomeIcon icon={faSave} className="text-sm" /> {saving ? "更新中..." : "更新"}
                        </button>
                        <button type="button" onClick={handleDelete} className="btn-danger flex-1 sm:flex-none justify-center inline-flex items-center gap-2">
                            <FontAwesomeIcon icon={faTrash} className="text-sm" /> 削除
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AdminCategoryEditPage;

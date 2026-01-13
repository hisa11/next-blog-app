"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarAlt,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

type Category = {
  id: string;
  name: string;
};

type PostCategory = {
  category: Category;
};

type Post = {
  id: string;
  title: string;
  content: string;
  coverImageURL: string;
  createdAt: string;
  categories: PostCategory[];
};

type Params = {
  id: string;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const PostDetailPage: React.FC<{ params: Promise<Params> }> = ({ params }) => {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [postId, setPostId] = useState<string>("");

  useEffect(() => {
    params.then((p) => setPostId(p.id));
  }, [params]);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          alert("投稿が見つかりませんでした");
          router.push("/");
        }
      } catch (error) {
        console.error("投稿の取得に失敗しました", error);
        alert("投稿の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, router]);

  const handleDelete = async () => {
    if (!confirm("この投稿を削除しますか？")) return;

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("投稿を削除しました");
        router.push("/");
      } else {
        alert("削除に失敗しました");
      }
    } catch (error) {
      console.error("削除に失敗しました", error);
      alert("削除に失敗しました");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#E67E22] border-t-transparent"></div>
          <p className="text-[#7F8C8D]">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-[#7F8C8D]">投稿が見つかりません</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section with Cover Image */}
      <section className="relative">
        <div className="aspect-[21/9] w-full overflow-hidden bg-[#F5F7FA]">
          <img
            src={post.coverImageURL}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Article Content */}
      <article className="py-[60px]">
        <div className="container mx-auto max-w-[1100px] px-4">
          <div className="flex flex-col gap-10 lg:flex-row">
            {/* Main Content - 70% */}
            <div className="flex-1 lg:max-w-[720px]">
              {/* Back Link */}
              <Link
                href="/"
                className="mb-8 inline-flex items-center gap-2 text-sm text-[#7F8C8D] transition-colors hover:text-[#E67E22]"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                一覧に戻る
              </Link>

              {/* Article Header */}
              <header className="mb-10">
                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.categories.map((pc) => (
                    <span
                      key={pc.category.id}
                      className="rounded bg-[#F5F7FA] px-3 py-1 text-sm font-medium text-[#2C3E50]"
                    >
                      #{pc.category.name}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="mb-4 text-[32px] font-bold leading-tight text-[#2C3E50]">
                  {post.title}
                </h1>

                {/* Meta */}
                <div className="flex items-center text-sm text-[#7F8C8D]">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  {formatDate(post.createdAt)}
                </div>
              </header>

              {/* Article Body */}
              <div
                className="article-content prose prose-lg max-w-none text-[#333] leading-[1.8] tracking-[0.05em]"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Actions */}
              <div className="mt-12 flex gap-4 border-t border-[#E5E5E5] pt-8">
                <Link href={`/posts/${postId}/edit`} className="btn-primary">
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  編集する
                </Link>
                <button onClick={handleDelete} className="btn-danger">
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  削除する
                </button>
              </div>
            </div>

            {/* Sidebar - 30% */}
            <aside className="w-full lg:w-[320px]">
              {/* Profile Card */}
              <div className="rounded-lg border border-[#E5E5E5] bg-white p-6 text-center">
                <div className="mx-auto mb-4 h-[100px] w-[100px] overflow-hidden rounded-full border-4 border-[#F5F7FA]">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=blog"
                    alt="Author"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#2C3E50]">
                  Blog Author
                </h3>
                <p className="text-sm text-[#7F8C8D]">
                  シンプルで美しいデザインを追求するブログ運営者です。
                </p>
              </div>

              {/* Categories */}
              <div className="mt-6 rounded-lg border border-[#E5E5E5] bg-white p-6">
                <h3 className="mb-4 text-lg font-bold text-[#2C3E50]">
                  このブログのタグ
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((pc) => (
                    <span
                      key={pc.category.id}
                      className="rounded bg-[#F5F7FA] px-3 py-1 text-sm text-[#2C3E50]"
                    >
                      #{pc.category.name}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
};

export default PostDetailPage;

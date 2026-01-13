"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faPlus } from "@fortawesome/free-solid-svg-icons";

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("投稿の取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#E67E22] border-t-transparent mx-auto"></div>
          <p className="text-[#7F8C8D]">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#F5F7FA] py-[60px]">
        <div className="container mx-auto max-w-[1200px] px-4 text-center">
          <h1 className="mb-4 text-[32px] font-bold text-[#2C3E50]">
            Clean Blog
          </h1>
          <p className="mx-auto max-w-[600px] text-[#7F8C8D]">
            シンプルで美しいデザインと、優れた読み心地を追求したブログプラットフォーム。
            あなたのアイデアを、世界に届けましょう。
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-[80px]">
        <div className="container mx-auto max-w-[1100px] px-4">
          {/* Header */}
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-[24px] font-bold text-[#2C3E50]">最新の投稿</h2>
            <Link href="/posts/new" className="btn-primary">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              新規投稿
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#CED4DA] bg-[#F5F7FA] py-20 text-center">
              <p className="mb-4 text-lg text-[#7F8C8D]">
                まだ投稿がありません
              </p>
              <Link href="/posts/new" className="btn-primary">
                最初の投稿を作成する
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="card group block"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={post.coverImageURL}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Tags */}
                    <div className="mb-3 flex flex-wrap gap-2">
                      {post.categories.slice(0, 3).map((pc) => (
                        <span
                          key={pc.category.id}
                          className="rounded bg-[#F5F7FA] px-2 py-1 text-xs font-medium text-[#2C3E50]"
                        >
                          #{pc.category.name}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 text-lg font-bold leading-snug text-[#2C3E50] transition-colors group-hover:text-[#E67E22]">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p
                      className="mb-4 line-clamp-2 text-sm text-[#7F8C8D]"
                      dangerouslySetInnerHTML={{
                        __html: post.content.replace(/<[^>]*>/g, ""),
                      }}
                    />

                    {/* Meta */}
                    <div className="flex items-center text-xs text-[#7F8C8D]">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;

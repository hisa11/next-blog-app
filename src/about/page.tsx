"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faCode, faPenNib } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#F5F7FA] py-[60px]">
        <div className="container mx-auto max-w-[1200px] px-4 text-center">
          <h1 className="mb-4 text-[32px] font-bold text-[#2C3E50]">About</h1>
          <p className="mx-auto max-w-[600px] text-[#7F8C8D]">
            このブログについて、そして運営者について紹介します。
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-[80px]">
        <div className="container mx-auto max-w-[720px] px-4">
          {/* Profile Card */}
          <div className="mb-12 rounded-lg border border-[#E5E5E5] bg-white p-8 text-center">
            {/* Avatar */}
            <div className="mx-auto mb-6 h-[150px] w-[150px] overflow-hidden rounded-full border-4 border-[#F5F7FA]">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=blog"
                alt="Author"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Name */}
            <h2 className="mb-2 text-2xl font-bold text-[#2C3E50]">
              Blog Author
            </h2>
            <p className="mb-6 text-[#7F8C8D]">Web Developer & Writer</p>

            {/* Social Links */}
            <div className="flex justify-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F7FA] text-[#2C3E50] transition-all hover:bg-[#E67E22] hover:text-white"
              >
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F7FA] text-[#2C3E50] transition-all hover:bg-[#E67E22] hover:text-white"
              >
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>
              <a
                href="mailto:hello@example.com"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F7FA] text-[#2C3E50] transition-all hover:bg-[#E67E22] hover:text-white"
              >
                <FontAwesomeIcon icon={faEnvelope} size="lg" />
              </a>
            </div>
          </div>

          {/* About Content */}
          <div className="article-content">
            <h2>このブログについて</h2>
            <p>
              Clean Blogは、シンプルで美しいデザインと優れた読み心地を追求したブログプラットフォームです。
              記事の読みやすさを最優先に設計されており、余計な装飾を排除したクリーンなデザインが特徴です。
            </p>

            <h2>デザイン哲学</h2>
            <p>
              私たちは「Less is More」の精神を大切にしています。
              色数を最小限に抑え、余白を効果的に活用することで、
              コンテンツが主役となるデザインを実現しました。
            </p>

            <h2>技術スタック</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-[#E5E5E5] p-6 text-center">
                <FontAwesomeIcon
                  icon={faCode}
                  className="mb-3 text-3xl text-[#E67E22]"
                />
                <h3 className="font-bold text-[#2C3E50]">Next.js</h3>
                <p className="mt-2 text-sm text-[#7F8C8D]">
                  Reactベースのフレームワーク
                </p>
              </div>
              <div className="rounded-lg border border-[#E5E5E5] p-6 text-center">
                <FontAwesomeIcon
                  icon={faPenNib}
                  className="mb-3 text-3xl text-[#E67E22]"
                />
                <h3 className="font-bold text-[#2C3E50]">Tailwind CSS</h3>
                <p className="mt-2 text-sm text-[#7F8C8D]">
                  ユーティリティファーストCSS
                </p>
              </div>
              <div className="rounded-lg border border-[#E5E5E5] p-6 text-center">
                <FontAwesomeIcon
                  icon={faCode}
                  className="mb-3 text-3xl text-[#E67E22]"
                />
                <h3 className="font-bold text-[#2C3E50]">Prisma</h3>
                <p className="mt-2 text-sm text-[#7F8C8D]">
                  型安全なデータベースORM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;

"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenNib } from "@fortawesome/free-solid-svg-icons";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 h-[80px] border-b border-[#E5E5E5] bg-white">
      <div className="container mx-auto flex h-full max-w-[1200px] items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-[#2C3E50] transition-colors hover:text-[#E67E22]"
        >
          <FontAwesomeIcon icon={faPenNib} className="text-[#E67E22]" />
          <span>Clean Blog</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-[15px] font-medium text-[#333] transition-colors hover:text-[#E67E22]"
          >
            ホーム
          </Link>
          <Link
            href="/posts/new"
            className="text-[15px] font-medium text-[#333] transition-colors hover:text-[#E67E22]"
          >
            新規投稿
          </Link>
          <Link
            href="/about"
            className="text-[15px] font-medium text-[#333] transition-colors hover:text-[#E67E22]"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

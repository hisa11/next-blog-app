import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

type Params = {
  id: string;
};

// [GET] /api/posts/[id] 投稿記事（単体）を取得
export const GET = async (
  req: NextRequest,
  context: { params: Promise<Params> },
) => {
  try {
    const { id } = await context.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "投稿記事が見つかりませんでした" },
        { status: 404 },
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の取得に失敗しました" },
      { status: 500 },
    );
  }
};

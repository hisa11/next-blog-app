import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// [POST] /api/admin/posts 投稿記事を追加
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { title, content, coverImageURL, categoryIds, categoryNames } = body;

    // バリデーション
    if (!title || !content || !coverImageURL) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています" },
        { status: 400 },
      );
    }

    // カテゴリ名が渡された場合は、存在しなければ作成してIDを取得
    let categoryCreates: { categoryId: string }[] = [];

    if (Array.isArray(categoryNames) && categoryNames.length > 0) {
      const cats = await Promise.all(
        categoryNames.map(async (rawName: string) => {
          const name = String(rawName).replace(/^#/, "").trim();
          if (!name) return null;
          // upsert を使ってなければ作成
          const c = await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
          });
          return c;
        }),
      );
      categoryCreates = cats.filter((c): c is NonNullable<typeof c> => c !== null).map((c) => ({ categoryId: c.id }));
    } else if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      categoryCreates = categoryIds.map((categoryId: string) => ({ categoryId }));
    }

    // 投稿記事を作成
    const post = await prisma.post.create({
      data: {
        title,
        content,
        coverImageURL,
        categories: {
          create: categoryCreates,
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の作成に失敗しました" },
      { status: 500 },
    );
  }
};

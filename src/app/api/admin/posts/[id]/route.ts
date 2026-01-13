import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

type Params = {
  id: string;
};

// [PUT] /api/admin/posts/[id] 投稿記事の内容を更新
export const PUT = async (
  req: NextRequest,
  context: { params: Promise<Params> },
) => {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { title, content, coverImageURL, categoryIds, categoryNames } = body;

    // 既存の投稿記事を確認
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "投稿記事が見つかりませんでした" },
        { status: 404 },
      );
    }

    // カテゴリが渡されたら既存の関連を削除
    if ((Array.isArray(categoryIds) && categoryIds.length > 0) || (Array.isArray(categoryNames) && categoryNames.length > 0)) {
      await prisma.postCategory.deleteMany({
        where: { postId: id },
      });
    }

    // categoryNames が渡された場合は存在しなければ作成してIDを取得
    let categoryCreates: { categoryId: string }[] | undefined = undefined;
    if (Array.isArray(categoryNames) && categoryNames.length > 0) {
      const cats = await Promise.all(
        categoryNames.map(async (rawName: string) => {
          const name = String(rawName).replace(/^#/, "").trim();
          if (!name) return null;
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

    // 投稿記事を更新
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: title ?? existingPost.title,
        content: content ?? existingPost.content,
        coverImageURL: coverImageURL ?? existingPost.coverImageURL,
        categories: categoryCreates
          ? {
              create: categoryCreates,
            }
          : undefined,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の更新に失敗しました" },
      { status: 500 },
    );
  }
};

// [DELETE] /api/admin/posts/[id] 投稿記事を削除
export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<Params> },
) => {
  try {
    const { id } = await context.params;

    // 既存の投稿記事を確認
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "投稿記事が見つかりませんでした" },
        { status: 404 },
      );
    }

    // 投稿記事を削除（PostCategoryは自動的にカスケード削除される）
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: "投稿記事を削除しました" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の削除に失敗しました" },
      { status: 500 },
    );
  }
};

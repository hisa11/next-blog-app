import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

type Params = {
  id: string;
};

// [PUT] /api/admin/categories/[id] カテゴリの名前を変更
export const PUT = async (
  req: NextRequest,
  context: { params: Promise<Params> },
) => {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { name } = body;

    // バリデーション
    if (!name) {
      return NextResponse.json(
        { error: "カテゴリ名が必須です" },
        { status: 400 },
      );
    }

    // 既存のカテゴリを確認
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "カテゴリが見つかりませんでした" },
        { status: 404 },
      );
    }

    // カテゴリを更新
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "カテゴリの更新に失敗しました" },
      { status: 500 },
    );
  }
};

// [DELETE] /api/admin/categories/[id] カテゴリを削除
export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<Params> },
) => {
  try {
    const { id } = await context.params;

    // 既存のカテゴリを確認
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "カテゴリが見つかりませんでした" },
        { status: 404 },
      );
    }

    // カテゴリを削除（PostCategoryは自動的にカスケード削除される）
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "カテゴリを削除しました" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "カテゴリの削除に失敗しました" },
      { status: 500 },
    );
  }
};

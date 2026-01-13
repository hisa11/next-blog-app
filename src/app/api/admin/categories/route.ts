import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// [POST] /api/admin/categories カテゴリーを追加
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name } = body;

    // バリデーション
    if (!name) {
      return NextResponse.json(
        { error: "カテゴリ名が必須です" },
        { status: 400 },
      );
    }

    // カテゴリを作成
    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "カテゴリの作成に失敗しました" },
      { status: 500 },
    );
  }
};

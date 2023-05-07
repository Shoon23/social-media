import { prisma } from "@/lib/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { iMySession } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const commentId = req.query.deleteId as string;

    if (!commentId) {
      return res.status(400).json({
        message: "Missing ID",
      });
    }

    try {
      await prisma.$transaction([
        prisma.commentLike.deleteMany({
          where: { commentId },
        }),
        prisma.comment.delete({
          where: {
            commentId,
          },
        }),
      ]);

      res.status(204).json({});
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  } else {
    res.status(405).json({
      messag: "Method Not Allowed",
    });
  }
}

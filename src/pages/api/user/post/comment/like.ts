import { prisma } from "@/lib/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { iMySession } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, commentId, isLiked } = req.body;
    const session = await getServerSession(req, res, authOptions);
    const user = session?.user as iMySession;
    console.log(req.body);
    if (!userId || !commentId || isLiked === null) {
      return res.status(400).json({
        message: "Missing Fields",
      });
    }

    if (user.id !== userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      if (isLiked) {
        const userLike = await prisma.commentLike.findFirst({
          where: {
            userId,
            commentId,
          },
        });
        await prisma.commentLike.delete({
          where: {
            commentLikeId: userLike?.commentLikeId,
          },
        });
        return res.status(204).json({
          message: "Succesfully Deleted",
        });
      }

      const addLike = await prisma.commentLike.create({
        data: {
          userId,
          commentId,
        },
      });
      res.status(201).json(addLike);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  } else {
    res.status(405).json({
      message: "Method Not Allowed",
    });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { iMySession } from "@/types";
import { prisma } from "@/lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    const sessionUserId = (session?.user as iMySession)?.id ?? null;
    const { postId, userId, isLiked } = req.body;

    if (!postId || !userId || isLiked === "") {
      return res.status(400).json({
        message: "Missing Fields",
      });
    }

    if (sessionUserId !== userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      if (isLiked) {
        const userLike = await prisma.postLike.findFirst({
          where: {
            postId,
            userId,
          },
        });

        await prisma.postLike.delete({
          where: {
            postLikeId: userLike?.postLikeId,
          },
        });
        return res.status(204).json({
          message: "Succesfully Deleted",
        });
      }
      const addLike = await prisma.postLike.create({
        data: {
          postId,
          userId,
        },
      });
      res.status(201).json(addLike);
    } catch (error) {
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

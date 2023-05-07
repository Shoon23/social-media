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
    const session = await getServerSession(req, res, authOptions);
    const sessionUserId = (session?.user as iMySession)?.id ?? null;
    const { postId, userId, description } = req.body;
    if (!postId || !userId || !description) {
      console.log(req.body);
      return res.status(400).json({
        message: "Missing Fields",
      });
    }

    if (sessionUserId !== userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const createComment = await prisma.comment.create({
        data: {
          description,
          postId,
          userId,
          userLike: { create: [] },
        },
        include: {
          user: {
            select: {
              avatar: true,
              firstName: true,
              lastName: true,
              userId: true,
            },
          },
          userLike: true,
        },
      });
      console.log(createComment);
      res.status(201).json(createComment);
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

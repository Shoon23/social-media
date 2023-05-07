import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { iMySession } from "@/types";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { postId, userId, description } = req.body;
    const session = await getServerSession(req, res, authOptions);
    const user = session?.user as iMySession;

    if (!postId || !userId || !description) {
      return res.status(400).json({
        message: "Missing Fields",
      });
    }
    if (user.id !== userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const updatePost = await prisma.post.update({
        where: {
          postId,
        },
        data: {
          description,
        },
      });
      res.status(201).json(updatePost);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  } else {
    res.status(405).json({
      message: "Method not allowed",
    });
  }
}

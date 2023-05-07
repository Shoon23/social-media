import { prisma } from "@/lib/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { iMySession } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const session = await getServerSession(req, res, authOptions);
    const user = session?.user as iMySession;
    const { userId, commentId, description } = req.body;

    if (user.id !== userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!userId || !commentId || !description) {
      return res.status(400).json({
        message: "Missing Fields",
      });
    }

    try {
      const updateComment = await prisma.comment.update({
        where: {
          commentId,
        },
        data: {
          description,
        },
      });

      res.status(200).json(updateComment);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  } else {
    res.status(405).json({
      message: "Method Not Allowed",
    });
  }
}

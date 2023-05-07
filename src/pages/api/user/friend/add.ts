import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { iMySession } from "@/types";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, friendId } = req.body;
    const session = await getServerSession(req, res, authOptions);
    const user = session?.user as iMySession;
    if (!userId || !friendId) {
      return res.status(400).json({
        message: "Missing Field",
      });
    }

    if (user.id !== userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const addFriend = await prisma.friend.create({
        data: {
          userId,
          friendId,
        },
      });

      res.status(201).json(addFriend);
    } catch (error) {
      res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  } else {
    res.status(405).json({
      message: "Method not allowed",
    });
  }
}

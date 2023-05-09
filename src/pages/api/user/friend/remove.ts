import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const friendId = req.query.friendId as string;
    const userId = req.query.userId as string;
    if (!friendId || !userId) {
      return res.status(400).json({
        message: "Missing Fields",
      });
    }
    try {
      const removeFriend = await prisma.friend.deleteMany({
        where: {
          OR: [
            { AND: [{ userId }, { friendId }] },
            { AND: [{ userId: friendId }, { friendId: userId }] },
          ],
        },
      });

      res.status(204).json(removeFriend);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.status(405).json({
      message: "Method not allowed",
    });
  }
}

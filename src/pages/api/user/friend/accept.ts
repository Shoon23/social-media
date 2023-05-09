import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { iMySession } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, friendId } = req.body;
    const friendRequestId = req.body.friendRequestId ?? "";
    const session = await getServerSession(req, res, authOptions);
    const user = session?.user as iMySession;
    if (!userId || !friendId) {
      res.status(400).json({
        message: "Missing fields",
      });
    }

    if (user.id !== userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const acceptFriend = await prisma.friend.create({
        data: {
          userId,
          friendId,
        },
        select: {
          id: true,
          friend: {
            select: {
              userId: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      });

      await prisma.$transaction([
        prisma.friend.create({
          data: {
            userId: friendId,
            friendId: userId,
          },
        }),
        prisma.friendRequest.deleteMany({
          where: {
            OR: [
              { id: friendRequestId },
              { AND: [{ receiverId: userId, senderId: friendId }] },
              { AND: [{ receiverId: friendId, senderId: userId }] },
            ],
          },
        }),
      ]);

      res.status(201).json(acceptFriend);
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

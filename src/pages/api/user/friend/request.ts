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
    const { senderId, receiverId } = req.body;
    const session = await getServerSession(req, res, authOptions);
    const user = session?.user as iMySession;

    if (!senderId || !receiverId) {
      return res.status(400).json({
        message: "Missing Field",
      });
    }

    if (user.id !== senderId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const addFriend = await prisma.friendRequest.create({
        data: {
          senderId,
          receiverId,
        },
      });
      console.log(addFriend);
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

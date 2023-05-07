import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { iMySession } from "@/types";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const userId = req.query.userId as string;
    const session = await getServerSession(req, res, authOptions);
    const user = session?.user as iMySession;

    if (!userId) {
      return res.status(400).json({
        message: "Missing Id",
      });
    }

    if (userId !== user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const getFriends = await prisma.friend.findMany({
        where: {
          userId,
        },
      });

      res.status(200).json(getFriends);
    } catch (error) {
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

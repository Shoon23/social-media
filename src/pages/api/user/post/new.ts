import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { iMySession } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    const sessionUserId = (session?.user as iMySession)?.id ?? null;

    const { description, userId, imageUrl } = req.body;

    if ((!description && !imageUrl) || !userId) {
      return res.status(400).json({
        message: "Missing Fields",
      });
    }
    if (sessionUserId !== userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log(description);

    const createPost = await prisma.post.create({
      data: {
        description,
        userId,
        image: imageUrl,
        comments: {
          create: [],
        },

        userLikes: {
          create: [],
        },
      },
    });

    res.status(201).json(createPost);
  } else {
    res.status(405).json({
      message: "Method Not Allowed",
    });
  }
}

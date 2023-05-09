import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const friendRequestId = req.query.friendRequestId as string;

    if (!friendRequestId) {
      return res.status(400).json({
        message: "Missing Query String",
      });
    }

    try {
      const deleteRequest = await prisma.friendRequest.delete({
        where: {
          id: friendRequestId,
        },
      });
      res.status(204).json(deleteRequest);
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  } else {
    res.status(405).json({ message: "Method not allowed " });
  }
}

import deleteImage from "@/lib/cloudinary/deleteImage";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const postId = req.query.postId as string;
    const publicId = req.query.publicId as string;

    if (!postId) {
      console.log("yoo");
      return res.status(400).json({
        message: "Missing Id",
      });
    }

    try {
      await prisma.$transaction([
        prisma.postLike.deleteMany({
          where: {
            postId,
          },
        }),
        prisma.commentLike.deleteMany({
          where: {
            comment: {
              postId,
            },
          },
        }),
        prisma.comment.deleteMany({
          where: {
            postId,
          },
        }),
        prisma.post.delete({
          where: {
            postId,
          },
        }),
      ]);
      publicId && (await deleteImage(publicId));

      res.status(200).json({});
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  } else {
    res.status(405).json({
      message: "Method Not Allowed",
    });
  }
}

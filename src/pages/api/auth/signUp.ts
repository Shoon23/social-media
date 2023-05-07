import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { firstName, lastName, email, plainPassword } = req.body;

  if (!firstName || !lastName || !email || !plainPassword) {
    return res.status(400).send("Missing Fields");
  }

  if (req.method === "POST") {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return res.status(409).json({
        message: "User Already Registered",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(plainPassword, salt);
    const createUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashPassword,
        friends: { create: [] },
        commentLikes: { create: [] },
        postLikes: { create: [] },
        posts: { create: [] },
        comments: { create: [] },
      },
    });
    const { password, ...other } = createUser;
    res.status(201).json(other);
  } else {
    return res.status(405).json({
      message: "HTTP method error",
    });
  }
}

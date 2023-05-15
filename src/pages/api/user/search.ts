import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { searchKey, userId } = req.query;
  } else {
    res.status(405).json({
      message: "Method not allowed",
    });
  }
}

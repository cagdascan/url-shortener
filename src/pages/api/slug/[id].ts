import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

const getLongUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const { id } = query;

  // TODO: better id validation
  const alias = typeof id == "string" ? id : "";
  const data = await prisma.url.findFirst({
    where: { alias },
  });
  res.status(200).json(data);
};

export default getLongUrl;

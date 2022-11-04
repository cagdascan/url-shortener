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
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ error: "Not found" });
  }
};

export default getLongUrl;

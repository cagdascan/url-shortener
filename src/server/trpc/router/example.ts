import { z } from "zod";
import { prisma } from "../../../server/db/client";

import { router, publicProcedure } from "../trpc";
import ShortUniqueId from "short-unique-id";

export const exampleRouter = router({
  shorten: publicProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ input: { url } }) => {
      const uid = new ShortUniqueId({ length: 5 });
      const id = uid();
      const { alias } = await prisma.url.create({
        data: {
          url,
          alias: id,
        },
      });
      return {
        shortened: alias,
      };
    }),
});

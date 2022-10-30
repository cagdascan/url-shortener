import { type NextPage } from "next";
import { useState } from "react";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [alias, setAlias] = useState("");

  const shorten = trpc.example.shorten.useMutation({
    onSuccess: (data) => {
      setAlias(data.shortened);
    },
  });

  const handleClick = () => {
    shorten.mutate({ url: "https://trpc.io" });
  };

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center bg-slate-900 pt-6 text-2xl text-slate-300">
      <div>Shorten your links</div>
      <div>Create and monitor your links. It’s secure, fast and free.</div>
      <div className="mt-4 flex w-1/4 flex-col">
        <input
          type="text"
          id="alias"
          className="mb-2 bg-white text-slate-900"
        />
        <input
          type="text"
          id="url"
          className="mb-2 bg-white text-slate-900"
          value={alias}
        />
        <button
          type="button"
          className="bg-indigo-600 text-white"
          onClick={handleClick}
        >
          Shorten
        </button>
      </div>
    </div>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery();

//   const { data: sessionData } = useSession();

//   return (
//     <div className="flex flex-col items-center justify-center gap-2">
//       {sessionData && (
//         <p className="text-2xl text-blue-500">
//           Logged in as {sessionData?.user?.name}
//         </p>
//       )}
//       {secretMessage && (
//         <p className="text-2xl text-blue-500">{secretMessage}</p>
//       )}
//       <button
//         className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
//         onClick={sessionData ? () => signOut() : () => signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };

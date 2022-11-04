import { type NextPage } from "next";
import { useState } from "react";

import type { FormikHelpers } from "formik";
import { Field, Form, Formik } from "formik";
import type { CreateRequest, CreateRequestErrors } from "../../types/url.types";
import { copyTextToClipboard } from "../../utils/copyToClipboard";
import { trpc } from "../../utils/trpc";
import cx from "classnames";

const initialFormValues: CreateRequest = {
  longUrl: "",
  customAlias: "",
  expireAt: "",
};

const validateFunction = (values: CreateRequest) => {
  const errors: CreateRequestErrors = {};
  if (!values.longUrl) {
    errors.longUrl = "Required";
  }
  console.log(errors);
  return errors;
};

const REDIRECT_HOST = `${process.env.NEXT_PUBLIC_HOST}/u`;

const Home: NextPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const shorten = trpc.example.shorten.useMutation();

  const handleShortenAnother = (resetForm: () => void) => {
    setSubmitted(false);
    resetForm();
  };

  const handleCopy = (value: string) => {
    let timer = 0;
    if (!timer) {
      copyTextToClipboard(value);
      setCopied(true);
      timer = window.setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };

  const handleLaunch = (value: string) => {
    window.open(value, "_blank");
  };

  const handleSubmit = (
    values: CreateRequest,
    { setSubmitting, setFieldValue }: FormikHelpers<CreateRequest>
  ) => {
    setError("");
    shorten.mutate(values, {
      onError: (error) => {
        setError(error.message);
      },
      onSuccess: (data) => {
        setFieldValue("longUrl", `${REDIRECT_HOST}/${data.shortened}`);
        setFieldValue("customAlias", data.shortened);
        setSubmitted(true);
        // TODO: is this needed?
        // addAlias({
        //   alias: response.alias,
        //   createdAt: new Date().toISOString(),
        //   longUrl: values.longUrl,
        // });
      },
      onSettled: () => {
        setSubmitting(false);
      },
    });
  };

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center bg-slate-900 pt-6 text-2xl text-slate-300">
      <div>Shorten your links</div>
      <div>Create and monitor your links. It’s secure, fast and free.</div>
      <div className="mt-4 flex max-w-2xl flex-col">
        <Formik
          initialValues={initialFormValues}
          validate={validateFunction}
          onSubmit={handleSubmit}
          validateOnBlur
        >
          {({ values, isSubmitting, isValid, resetForm, dirty, errors }) => (
            <Form>
              <div className="mb-2 flex">
                <Field
                  name="longUrl"
                  placeholder="Type or paste your link"
                  maxLength={2000}
                  disabled={submitted}
                  className={cx(
                    { "!border-red-600": errors.longUrl },
                    "text-slate-300, w-full rounded-md border-2 border-slate-800 bg-slate-800 p-2"
                  )}
                />
              </div>
              <div className="mb-2 flex flex-row gap-2">
                <div className="w-1/2">
                  <Field
                    name="customAlias"
                    placeholder="alias"
                    disabled={submitted}
                    maxLength={128}
                    className="w-full rounded-md bg-slate-800 p-2 text-slate-300"
                  />
                </div>
                <div className="w-1/2">
                  <Field
                    name="expireTime"
                    type="date"
                    placeholder="expiry date"
                    disabled={submitted}
                    className="h-12 w-full rounded-md bg-slate-800 p-2 text-slate-300"
                  />
                </div>
              </div>

              {!submitted ? (
                <div>
                  <button
                    className="w-full cursor-pointer rounded-md bg-indigo-700 p-2 text-slate-300 hover:bg-indigo-800 disabled:cursor-default disabled:bg-indigo-400"
                    type="submit"
                    disabled={isSubmitting || (!isValid && !dirty)}
                  >
                    {isSubmitting ? "..." : "Shorten"}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="flex w-1/2 gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleLaunch(values.longUrl);
                      }}
                      className="w-full cursor-pointer rounded-md bg-blue-400 p-2 text-slate-300"
                    >
                      launch
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleCopy(values.longUrl);
                      }}
                      className="w-full cursor-pointer rounded-md bg-green-600 p-2 text-slate-300"
                    >
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="flex w-1/2">
                    <button
                      onClick={() => handleShortenAnother(resetForm)}
                      className="w-full cursor-pointer rounded-md bg-indigo-700 p-2 text-slate-300"
                    >
                      Shorten another
                    </button>
                  </div>
                </div>
              )}
              <div>{error}</div>
            </Form>
          )}
        </Formik>
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

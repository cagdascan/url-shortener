import { type NextPage } from "next";
import { useState } from "react";

import { trpc } from "../utils/trpc";
import { Field, Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import type { DateFromISOStringC } from "io-ts-types/lib/DateFromISOString";
import { copyTextToClipboard } from "../utils/copyToClipboard";

interface CreateRequest {
  longUrl: string;
  customAlias?: string;
  expireAt?: DateFromISOStringC;
}
interface CreateRequestErrors {
  longUrl?: string;
  customAlias?: string;
  expireAt?: DateFromISOStringC;
}

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

const REDIRECT_HOST = "https://host";

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

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center bg-slate-900 pt-6 text-2xl text-slate-300">
      <div>Shorten your links</div>
      <div>Create and monitor your links. It’s secure, fast and free.</div>
      <div className="mt-4 flex w-1/4 flex-col">
        <Formik
          initialValues={initialFormValues}
          validate={validateFunction}
          onSubmit={(
            values: CreateRequest,
            {
              setSubmitting,
              setFieldValue,
            }: // setErrors,
            FormikHelpers<CreateRequest>
          ) => {
            console.log("xxx");
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
          }}
        >
          {({ values, isSubmitting, isValid, resetForm, dirty }) => (
            <Form>
              <div>
                <Field
                  name="longUrl"
                  placeholder="Type or paste your link"
                  maxLength={2000}
                  disabled={submitted}
                />
              </div>
              <div>
                <div>
                  <Field
                    name="customAlias"
                    placeholder="alias"
                    disabled={submitted}
                    maxLength={128}
                  />
                </div>
                <div>
                  <Field
                    name="expireTime"
                    type="date"
                    placeholder="expiry date"
                    disabled={submitted}
                  />
                </div>
              </div>
              {!submitted ? (
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || (!isValid && !dirty)}
                  >
                    {isSubmitting ? "..." : "Shorten"}
                  </button>
                </div>
              ) : (
                <div>
                  <div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleLaunch(values.longUrl);
                      }}
                    >
                      launch
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleCopy(values.longUrl);
                      }}
                    >
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div>
                    <button onClick={() => handleShortenAnother(resetForm)}>
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

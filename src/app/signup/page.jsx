import { Suspense } from "react";
import SignInClient from "./SignInClient";
import SignUpform from "./SignUpform";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpform></SignUpform>
    </Suspense>
  );
}
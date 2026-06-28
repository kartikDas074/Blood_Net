import { Suspense } from "react";
import SignUpform from "./SignUpform";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpform></SignUpform>
    </Suspense>
  );
}
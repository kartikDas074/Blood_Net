import { Suspense } from "react";
import SignInform from "./SignInform";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInform></SignInform>
    </Suspense>
  );
}
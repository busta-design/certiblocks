import Link from "next/link";
import { SignUp } from "~~/components/forms/sign-up/SignUp";

const RegistroPage = () => {
  return (
    <div className="flex w-full justify-center items-center p-4">
      <Link href="/" className="absolute top-4 left-4 btn btn-sm btn-outline btn-primary">
        ← Inicio
      </Link>
      <SignUp />
    </div>
  );
};

export default RegistroPage;

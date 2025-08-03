"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const SignIn = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/usuarios/961fdf6a-0d50-470a-a580-7b15108f7f08");
  };

  const disabled = !email || password.length < 5;

  return (
    <form onSubmit={onSubmit} className="flex flex-col space-y-4">
      <label className="floating-label">
        <span>Correo electronico</span>
        <input
          type="email"
          placeholder="mail@site.com"
          className="input w-full"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <label className="floating-label">
        <span>Contrasena</span>
        <input
          type="password"
          placeholder="******"
          className="input w-full"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </label>

      <button className="btn btn-primary" disabled={disabled}>
        Ingresar
      </button>
      <Link href="/auth/registro" className="btn">
        Registrate
      </Link>
    </form>
  );
};

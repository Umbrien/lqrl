"use client";

import { useMemo, useState } from "react";
import { useApiLoginHandler, useApiRegisterHandler } from "@/dist/kubb";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { Toggle } from "@/components/ui/toggle";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordsUnmatched, setPasswordsUnmatched] = useState(false);

  const router = useRouter();

  const { login: storeLogin } = useAuthStore();

  const basicAuth = useMemo(() => {
    return Buffer.from(`${username}:${password}`).toString("base64");
  }, [username, password]);

  const login = useApiLoginHandler({
    mutation: {
      onSuccess: (data) => {
        storeLogin({
          username,
          accessToken: data.result.access_token,
          refreshToken: data.result.refresh_token,
        });
        router.push("/");
      },
      onError: (error) => {
        console.log("login error", error);
      },
    },
    client: {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    },
  });

  const register = useApiRegisterHandler({
    mutation: {
      onSuccess: () => {
        login.mutate({} as unknown as void);
      },
      onError: (error) => {
        console.log("register error", error);
      },
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== passwordConfirm) {
      setPasswordsUnmatched(true);
      return;
    }
    setPasswordsUnmatched(false);
    register.mutate({ data: { username, pwd: password } });
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center p-12 md:p-24">
      <h1 className="text-4xl font-bold">Реєстрація</h1>
      <p className="mt-4 text-lg text-primary-600">Створення нового акаунту</p>
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col items-center gap-4"
      >
        <input
          type="text"
          placeholder="Імʼя користувача"
          className="rounded-md border border-primary-300 px-4 py-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="flex items-center gap-2 pl-[3.125rem]">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Пароль"
            className="rounded-md border border-primary-300 px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Toggle
            aria-label="Показати поточний пароль"
            pressed={showPassword}
            onPressedChange={(p) => setShowPassword(p)}
          >
            {showPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </Toggle>
        </div>
        <div className="flex items-center gap-2 pl-[3.125rem]">
          <input
            name="passwordConfirm"
            type={showPasswordConfirm ? "text" : "password"}
            placeholder="Підтвердження паролю"
            className="rounded-md border border-primary-300 px-4 py-2"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <Toggle
            aria-label="Показати підтвердження паролю"
            pressed={showPasswordConfirm}
            onPressedChange={(p) => setShowPasswordConfirm(p)}
          >
            {showPasswordConfirm ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </Toggle>
        </div>
        <button
          type="submit"
          className="rounded-md bg-primary-500 px-4 py-2 text-white"
        >
          Зареєструватися
        </button>
        {passwordsUnmatched && (
          <div className="text-red-500">Паролі не співпадають</div>
        )}
        {register.isError && (
          <div className="text-red-500">Помилка реєстрації</div>
        )}
        <Link href="/login" className="text-primary-600">
          Вхід
        </Link>
      </form>
    </div>
  );
}

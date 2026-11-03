import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <div className="w-full max-w-sm rounded-[28px] bg-paper p-8">
        <p className="eyebrow">Studio</p>
        <h1 className="display mt-2 text-4xl">Owner sign in</h1>
        <LoginForm />
      </div>
    </div>
  );
}

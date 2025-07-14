import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Hello World</h1>
      <p className="text-2xl">
        Go to Login Page
        <Link href="/login" className="text-blue-500">Login</Link>
      </p>
    </div>
  );
}

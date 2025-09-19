import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="text-6xl font-extrabold text-blue-900 mb-4">404</div>
      <div className="text-xl font-semibold text-blue-700 mb-2">
        Page Not Found
      </div>
      <div className="text-base text-blue-600 mb-6 text-center max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
        <br />
        If you need help, visit our{" "}
        <Link href="/user-guide" className="underline text-cyan-700">
          Customer Help Guide
        </Link>
        .
      </div>
      <Link
        href="/dashboard"
        className="px-5 py-2 rounded bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

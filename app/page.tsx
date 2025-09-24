import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans">
      <ul>
        <li>
          <Link href="/auth/login">Login</Link>
        </li>
        <li>
          <Link href="/projects">Projects</Link>
        </li>
        <li>
          <Link href={`/projects/${Date.now()}`}>Individual project</Link>
        </li>
      </ul>
    </div>
  );
}

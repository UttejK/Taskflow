import Link from "next/link";
import Image from "next/image";
import { PROJECTS } from "@/lib/data";
import { ProjectItem } from "@/lib/types";

type Props = {
  params: { id: string };
};

function isLocalImage(url?: string) {
  if (!url) return false;
  try {
    // treat absolute paths starting with / as local (served by Next)
    return url.startsWith("/");
  } catch {
    return false;
  }
}

function formatMeta(meta?: string) {
  if (!meta) return "—";
  return meta;
}

export default function ProjectPage({ params }: Props) {
  const { id } = params;
  const project: ProjectItem | undefined = PROJECTS.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-semibold">Project not found</h2>
          <p className="mb-4 text-sm text-slate-500">
            We couldn&apos;t find a project with id{" "}
            <code className="rounded-md bg-slate-100 px-1 py-[2px]">{id}</code>.
          </p>
          <Link
            href="/projects"
            className="inline-block rounded-md bg-slate-800 px-4 py-2 text-sm text-white hover:opacity-95"
          >
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold leading-snug">
            {project.title}
          </h1>
          {project.description ? (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {project.description}
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-500 italic">
              No description provided.
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/projects"
            className="rounded-md border px-3 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ← Back
          </Link>
          <div className="rounded-md border px-3 py-1 text-sm text-slate-700 dark:text-slate-300">
            ID: <span className="font-mono text-xs">{project.id}</span>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="mb-6 w-full overflow-hidden rounded-md border bg-slate-50">
        {project.image ? (
          isLocalImage(project.image) ? (
            // use next/image for local/asset images
            <div className="relative h-72 w-full">
              <Image
                src={project.image}
                alt={project.title || "project image"}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            </div>
          ) : (
            // external or arbitrary URLs: use <img/> so unknown hosts don't break
            // this keeps user-added URLs working reliably
            // add loading="lazy" to avoid blocking
            <img
              src={project.image}
              alt={project.title || "project image"}
              className="h-72 w-full object-cover"
              loading="lazy"
            />
          )
        ) : (
          <div className="flex h-40 items-center justify-center p-6 text-sm text-slate-500">
            No image provided
          </div>
        )}
      </div>

      {/* Meta and details */}
      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <h3 className="mb-2 text-sm font-medium text-slate-700">Details</h3>
          {project.description ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {project.description}
            </p>
          ) : (
            <p className="text-sm text-slate-500 italic">
              No additional details.
            </p>
          )}
        </div>

        <div className="rounded-md border bg-white p-4">
          <h4 className="mb-2 text-xs font-semibold text-slate-600">Meta</h4>
          <div className="text-sm text-slate-700">
            {formatMeta(project.meta)}
          </div>
        </div>
      </section>

      {/* Extra: actions area (edit/delete placeholders) */}
      <div className="flex gap-2">
        <Link
          href={`/projects/${project.id}/edit`}
          className="rounded-md border px-3 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Edit
        </Link>
      </div>
    </main>
  );
}

/* Optional: generateMetadata for better SEO (uncomment if you want)
export async function generateMetadata({ params }: Props) {
  const { id } = params;
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.description ?? undefined,
    openGraph: {
      title: project.title,
      description: project.description ?? undefined,
      images: project.image ? [project.image] : undefined,
    },
  };
}
*/

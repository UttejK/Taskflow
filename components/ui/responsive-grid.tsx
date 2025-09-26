"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

// Next.js-friendly Responsive Grid component using Tailwind + shadcn/ui.
// - This is a client component (uses framer-motion and interactive UI).
// - `cn` (classNames) from lib/utils is used to merge column + gap classes.

type ResponsiveGridProps = {
  items: ProjectItem[];
  /** Tailwind grid column classes for responsive breakpoints. */
  columnsClassName?: string;
  gapClassName?: string;
  /** Optional render override for each item */
  renderItem?: (item: ProjectItem) => ReactNode;
};

const DEFAULT_COLUMNS =
  "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";
const DEFAULT_GAP = "gap-4 md:gap-6";

export default function ResponsiveGrid({
  items,
  columnsClassName = DEFAULT_COLUMNS,
  gapClassName = DEFAULT_GAP,
  renderItem,
}: ResponsiveGridProps) {
  // Use `cn` to merge the grid classes reliably.
  const gridClass = cn("grid", columnsClassName, gapClassName);

  return (
    <div>
      <div className={gridClass} role="list">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="animate-appear"
            role="listitem"
          >
            {renderItem ? (
              renderItem(item)
            ) : (
              <Card className="h-full">
                {item.image && (
                  <div className="h-40 w-full overflow-hidden rounded-t-md bg-slate-100">
                    <div
                      className="h-full w-full bg-center bg-cover"
                      style={{ backgroundImage: `url(${item.image})` }}
                      aria-hidden
                    />
                  </div>
                )}
                <CardHeader className="pt-4">
                  <CardTitle className="text-sm">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                  {item.meta && (
                    <div className="mt-3 text-xs text-muted-foreground">
                      {item.meta}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-muted p-8 text-center">
          <p className="text-sm text-muted-foreground">No items to display.</p>
        </div>
      )}
    </div>
  );
}

/*
  NOTES:
  - Make sure this file lives under `app/` or `components/` and is imported into a client-side page.
  - `cn` here is expected at `@/lib/utils` (common Next.js alias). If your project uses a different path, update the import.
  - If you prefer `next/image`, swap the image block with an <Image/> component — keep in mind Image requires fixed sizes or fill layout.
  - For very long lists consider virtualization (react-window) to keep performance good.
  - To remove Framer Motion, delete imports and the motion wrapper and use a simple <div>.

  Example usage (app/page.tsx):

  "use client";
  import ResponsiveGrid from "@/components/ResponsiveGrid";

  const sample = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    title: `Item ${i + 1}`,
    description: "Short description",
    image: `https://picsum.photos/seed/${i}/600/400`,
    meta: "Meta info",
  }));

  export default function Page() {
    return <ResponsiveGrid items={sample} />;
  }
*/

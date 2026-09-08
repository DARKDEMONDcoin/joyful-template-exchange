/** صفحة معاينة مؤقتة لمراجعة شكل ردود نور بنفس تنسيق المحادثة (تُحذف بعد المراجعة). */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Markdown } from "@/components/app/Markdown";

export const Route = createFileRoute("/__nour-preview")({
  component: NourPreview,
  head: () => ({
    meta: [{ title: "معاينة ردود نور" }],
  }),
});

type Item = { id: string; ok: boolean; output: string };

function NourPreview() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    fetch("/nour-outputs.json")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {items.map((it) => (
          <section key={it.id} className="space-y-3">
            <h2 className="font-display text-sm font-black text-muted-foreground">{it.id}</h2>
            <div className="group flex justify-end gap-3">
              <span className="order-2 mt-1 block size-9 shrink-0 rounded-xl bg-secondary" />
              <div className="order-1 min-w-0 max-w-[min(46rem,88%)] rounded-3xl rounded-se-lg border border-border bg-card px-5 py-3.5 leading-relaxed shadow-sm">
                <Markdown body={it.output} />
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

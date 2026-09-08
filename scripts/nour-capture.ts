/** يلتقط مخرجات نور الحقيقية كاملة لمراجعة شكلها بصرياً داخل واجهة المحادثة. */
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import { executeSkill } from "@/lib/nour-run.server";

const client = createClient<Database>(
  process.env["SUPABASE_URL"]!,
  process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
  { auth: { persistSession: false } },
);
const { data: ws } = await client.from("workspaces").select("id").limit(1).single();
if (!ws) throw new Error("no workspace");

const skills = [
  { id: "meta-pack", values: { page: "صفحة أسعار تأمين السيارات", keyword: "تأمين سيارات" } },
  { id: "serp-brief", values: { keyword: "أسعار الذهب اليوم", market: "مصر" } },
  { id: "seo-audit", values: { site: "متجر عطور سعودي — perfume.sa" } },
];

const out = await Promise.all(
  skills.map(async (s) => {
    try {
      const r = await executeSkill({
        client: client as never,
        workspaceId: ws.id,
        employeeId: "nour",
        skillId: s.id,
        values: s.values,
        origin: "capture",
      } as never);
      return { id: s.id, ok: true, output: (r as { output?: string }).output ?? String(r) };
    } catch (e) {
      return { id: s.id, ok: false, output: e instanceof Error ? e.message : String(e) };
    }
  }),
);

await Bun.write("/tmp/nour-outputs.json", JSON.stringify(out, null, 2));
console.log(out.map((o) => `${o.id}: ${o.ok ? o.output.length + " chars" : "FAIL " + o.output}`).join("\n"));

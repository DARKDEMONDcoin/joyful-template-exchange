/** اختبار سريع: جودة مخرجات سِراج بعد الترقية + عمل الفاحص والإصلاح الآلي. */
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import { executeSkill } from "@/lib/nour-run.server";
import { scorePost } from "@/lib/post-quality";
import { autofixPosts } from "@/lib/post-autofix.server";

const client = createClient<Database>(
  process.env["SUPABASE_URL"]!,
  process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
  { auth: { persistSession: false } },
);
const { data: ws } = await client.from("workspaces").select("id").limit(1).single();
if (!ws) throw new Error("no workspace");

const t0 = Date.now();
const out = await executeSkill(client, {
  workspaceId: ws.id,
  employeeId: "sonny",
  skillId: "social-post",
  values: {
    topic: "إطلاق فطار صحي جديد",
    platform: "إنستغرام",
    cta: "اطلب من اللينك في البايو",
    tone: "ودودة",
    dialect: "مصرية",
    audience: "أمهات ٢٥–٤٠ بالقاهرة",
  },
  origin: "اختبار نهائي",
});
console.log("skill secs:", ((Date.now() - t0) / 1000).toFixed(1), "chars:", out.output.length);
console.log(out.output.slice(0, 700));

const bad = "في عالم اليوم سريع التغير نقدّم لكم بكل فخر تجربة لا تُنسى مع منتجاتنا الرائعة التي تعتبر الحل الأمثل لكل احتياجاتكم اليومية بدون منازع.";
const before = scorePost({ text: bad, provider: "instagram", hasMedia: true });
const fixedArr = await autofixPosts("", [{ channel: "instagram", body: bad, title: "t" }], {});
const after = scorePost({ text: String(fixedArr[0]?.body ?? ""), provider: "instagram", hasMedia: true });
console.log("\nautofix:", before.score, "->", after.score);
console.log(fixedArr[0]?.body);
process.exit(0);

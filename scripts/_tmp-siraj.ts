import { freeChat } from "@/lib/nour-research.server";
import { craft, personas } from "@/lib/nour-run.server";
const p = personas["sonny"]!;
const system = [`أنت ${p.name}، ${p.role}`, `## معايير حِرفتك\n${craft["sonny"]}`].join("\n");
const out = await freeChat("", [
  { role: "system", content: system },
  { role: "user", content: "عندي كوفي شوب في جدة، اعملي منشور إنستجرام لإطلاق مشروب بارد جديد + وصف صورة." },
], { timeoutMs: 60000 });
console.log(out.slice(0, 2000));

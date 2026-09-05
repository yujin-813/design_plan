import { seed } from "@/lib/seed";

export function findCourseNotice(id: string) {
  for (const p of seed.programs) {
    const n = p.room.notices.find((x) => "id" in x && x.id === id);
    if (n) return { notice: n as typeof n & { id: string; body: string }, program: p };
  }
  return undefined;
}

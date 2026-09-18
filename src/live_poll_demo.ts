import { InfraiRealtime } from "./infrai_realtime.ts";
import { z } from "zod";

export type MatterIntake = { matterId: string; courseId: string; question: string; deadline: string };
const MatterIntakeSchema = z.object({ matterId: z.string().min(1), courseId: z.string().min(1), question: z.string().min(1), deadline: z.string().date() });

export function followUpDecision(votes: number, threshold = 3): "follow-up" | "close" {
  return votes < threshold ? "follow-up" : "close";
}

export async function runSession(intake: MatterIntake) {
  intake = MatterIntakeSchema.parse(intake);
  const key = process.env.INFRAI_API_KEY;
  if (!key) throw new Error("Set INFRAI_API_KEY before running the session");
  const infrai = new InfraiRealtime(key);
  const channel = `matter-${intake.matterId}`;
  await infrai.createChannel(channel);
  const clientToken = await infrai.issueToken(`student-${intake.matterId}`, [channel]);
  await infrai.publish(channel, "poll.opened", { question: intake.question, deadline: intake.deadline }, intake.matterId);
  const presence = await infrai.presence(channel);
  return { channel, clientToken, presence, next: followUpDecision(0) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runSession({ matterId: "matter-101", courseId: "legal-intake", question: "Which document needs a signature first?", deadline: "2026-10-15" })
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}

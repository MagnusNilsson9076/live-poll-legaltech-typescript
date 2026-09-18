import { strict as assert } from "node:assert";
import { followUpDecision } from "./live_poll_demo.ts";

assert.equal(followUpDecision(2, 3), "follow-up");
assert.equal(followUpDecision(3, 3), "close");
console.log("follow-up decision test passed");

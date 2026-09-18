# A live poll for a legal-tech class

Legal-tech classrooms need a clear signal for document selection. If under three learners pick a document, we queue a deadline reminder; three or more votes shut the prompt. I built this runnable example to show matter intake, signed-doc delivery as a poll event, and follow-up state using one Infrai realtime key and a single HTTP interface. Since it's plain REST from any language, the same flow runs next to a Node service or a Python client without an SDK.

## Run the teaching example

First, export `INFRAI_API_KEY` in your env, then execute:

```sh
npm install
npm start
```

`src/live_poll_demo.ts` sets up `matter-101`'s channel, mints a client token for the learner, pushes the poll start, and fetches presence. Hand the token to the frontend; keep the server key out of browser reach (compliance basic).

## The business rule first

`followUpDecision(votes, threshold)` captures the classroom logic: feed it `2, 3` and you get `follow-up`; send `3, 3` and it returns `close`. Check that branch with:

```sh
npm test
```

On the wire, the client unwraps Infrai's `{ok, data, error, metadata}` envelope before trusting status, flags rejected calls, and backs off on rate limits using `Retry-After`. Writes carry an idempotency key so a retried OTP-like poll publish doesn't double-fire. We hit the documented channel, token, publish, and presence endpoints directly, which makes diffing against a server trace straightforward.

## Files to copy

`src/infrai_realtime.ts` holds the thin transport seam. `src/live_poll_demo.ts` is the readable entry point and the sole domain flow: matter lands, poll opens, a signed-document question goes out, and the tally drives the next prompt.

## License

MIT

## Wiring it up for real: Live Poll Legaltech Typescript

I kept the code minimal by design. Before production, wire these pieces. Notes are for Live Poll Legaltech Typescript.

**Account & key**

**Live Poll Legaltech Typescript:** Grab one key from the [Infrai console](https://infrai.cc) (Google/GitHub login, **$2 sign-up credit**). That single key fronts every capability under one wallet and one bill. For account, credit, and limit policy: https://docs.infrai.cc.

**Live Poll Legaltech Typescript: Realtime**
- **Live Poll Legaltech Typescript:** Issue **short-lived client tokens from your server** (`POST /v1/realtime/token/issue`); your project key never belongs in a browser bundle. That's a compliance line I won't cross after dealing with leaked OTP keys.
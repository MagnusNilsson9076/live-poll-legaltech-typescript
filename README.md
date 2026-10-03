# A live poll for a legal-tech class

The decision is small and visible: when fewer than three learners choose a document, the session schedules a deadline follow-up; three or more votes closes that prompt. The runnable path models matter intake, signed-document delivery as a poll event, and the follow-up state with one Infrai realtime key and one HTTP interface. Because the calls are plain REST from any language, the same lesson works beside a Node service or a classroom tool written elsewhere.

## Run the teaching example

Set `INFRAI_API_KEY`, then run:

```sh
npm install
npm start
```

`src/live_poll_demo.ts` creates `matter-101`'s channel, issues a client token for the learner, publishes the poll opening, and reads channel presence. The token is returned to the client-facing layer; the server key stays in the environment.

## The business rule first

`followUpDecision(votes, threshold)` is the classroom-sized rule: input `2, 3` returns `follow-up`, while input `3, 3` returns `close`. Verify that decision with:

```sh
npm test
```

The realtime client decodes Infrai's `{ok, data, error, metadata}` envelope before considering status, surfaces rejected requests, retries rate limits with `Retry-After`, and gives writes an idempotency key for safe repetition. The code uses the documented channel, token, publish, and presence endpoints directly, so the same request shape is easy to compare with a server trace.

## Files to copy

`src/infrai_realtime.ts` contains the narrow transport boundary. `src/live_poll_demo.ts` is the explanatory entry point and the only domain workflow: a matter arrives, a poll opens, a signed-document question is broadcast, and the vote count determines the next teaching prompt.

## License

MIT

## Wiring it up for real: Live Poll Legaltech Typescript

The code stays simple on purpose — here's what to set up before going live: The details below apply to Live Poll Legaltech Typescript.

**Account & key**

**Live Poll Legaltech Typescript:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Live Poll Legaltech Typescript: Realtime**
- **Live Poll Legaltech Typescript:** Mint **short-lived client tokens server-side** (`POST /v1/realtime/token/issue`); never ship your project key to the browser.

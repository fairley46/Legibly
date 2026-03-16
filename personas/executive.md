# Persona: Dana

<!-- Dana is a VP or C-suite exec at a B2B SaaS company. She has been burned before
     by engineering surprises landing in board meetings. She needs to trust what she reads. -->

## Who They Are

Dana is a VP of Product or CFO at a 200-person SaaS company. She has been blindsided
in board meetings by engineering changes she didn't know about — a service outage that
affected enterprise renewals, a migration that delayed a launch she had already announced.
She's since made it a habit to stay close to what's shipping. Not because she wants to
micromanage engineering — but because she's responsible for the story she tells the board,
and she cannot afford surprises.

She reads everything fast. She remembers everything she reads. She trusts writers who
are direct and distrust writers who hedge.

## Their Day

6:30am: scans email and Slack on her phone before she's out of bed. Looking for fires.
9am–12pm: back-to-back calls. A customer escalation, a board prep, a QBR debrief.
12–1pm: the only quiet hour. Desk, laptop. She catches up on what she missed.
4pm: weekly sync with the engineering VP. She comes with questions.

She interacts with release notes when she's catching up — usually mid-morning or in
that afternoon desk window. She's got maybe 90 seconds before the next thing.

## The Moment They Read This

She's at her desk after a meeting ran long. Her coffee is cold. She has three Slack
notifications she hasn't answered and a board slide deck open in another tab. She
opens the release summary in her inbox.

She reads the first bullet. If it tells her something real — a metric, a risk resolved,
a customer impact — she reads the second bullet. If the first bullet is vague or
technical, she closes the email and marks it read.

She is looking for one thing: **Is there anything here that changes the story I'm telling
externally? Anything I should flag or anything I can point to as progress?**

## What They're Hired to Do

Keep the business on track and the board informed. Translate what engineering ships into
investor and customer confidence. Make sure risk is managed and communicated, not buried.
Own the external narrative around product progress.

Her job is not "VP of Product" — it's "make sure nothing surprises us and that all the
good work we're doing shows up in the right conversations."

## What Keeps Them Up at Night

An engineering change hitting production that creates a customer problem she found out
about from the customer, not from her team. An outage showing up in a renewal conversation
she wasn't prepared for. A performance regression affecting the accounts that matter most.
Shipping something that creates regulatory or security risk she wasn't briefed on.

Anything that makes her look like she doesn't have command of the business.

## What a Great Day Looks Like

She walks into the board prep with three concrete data points about product momentum.
"We shipped X, it reduced Y by Z percent, and the enterprise accounts that were at risk
are now stable." The board trusts her. The investors trust the trajectory. She didn't
have to dig for any of it — it was in her inbox, clear and credible, when she needed it.

## What They Know About Technology

Knows what APIs, databases, and infrastructure mean at a conceptual level. Has sat through
enough architecture reviews to know what "latency" and "uptime" mean in business terms.
Does not read code. Does not know what a pull request looks like. Thinks in outcomes,
risks, and customer impact — not in systems.

If you write "we optimized the Redis cache" she will not know what that means or why
it matters. If you write "API response times dropped 68%, reducing the risk of SLA
breaches with enterprise customers" she understands immediately.

## What They Don't Care About

- Which team built it
- What the technical implementation was
- Internal ticket numbers or PR references
- Anything that doesn't change the business or customer story
- Complexity of the engineering challenge ("this was hard")
- Library names, framework names, infrastructure components

Every sentence that doesn't connect to business impact is a sentence that makes her
less likely to trust the next one.

## Writing Instructions

- **Maximum 3-4 bullet points total.** She will not read more.
- **Every point must connect to a business outcome.** Revenue, retention, risk, cost, customer satisfaction. No exceptions.
- **Lead with the highest-impact change.** Don't build to it.
- **If a metric exists, use it.** Numbers are credible. Vague outcomes are not.
- **No technical terms.** If you would not say it in a board slide, do not say it here.
- **No hedging.** "May help reduce" is useless. Tell her what happened.
- **Handle bad news directly.** She needs to know about incidents and risk. Don't soften it — just frame it in terms of what was affected and what is now resolved.
- **Tone:** Formal, confident, board-brief register. Like a prepared executive summary, not a product announcement.

## Output Structure

```
## [Month Year] — [One-sentence business summary of what shipped]

**This release:**
- [Impact point 1: outcome-first, metric if available, business implication in one sentence]
- [Impact point 2: same format]
- [Impact point 3: same format, if warranted]

**Risk / reliability** *(include only if relevant)*:
- [Stability improvement, SLA impact, or incident resolution — business framing only]
```

## Good Example

> ## March 2026 — API reliability improved; enterprise account risk reduced
>
> **This release:**
> - Response times for our top enterprise accounts dropped 68%, directly reducing
>   the SLA breach risk that surfaced in three renewal conversations last quarter.
> - An issue causing intermittent data export failures for accounts on the Professional
>   tier is resolved. Affected 4% of that segment.
>
> **Risk / reliability:**
> - System uptime held at 99.97% this period. No customer-visible outages.

## Bad Example

> We optimized the Redis cache layer and tuned our connection pooling configuration,
> which resulted in some latency improvements across several API endpoints. We also
> fixed a bug in the export pipeline related to a race condition in our async workers.

**Why this fails:** Dana has no idea what Redis or connection pooling are, cannot tell
if this affects customers she cares about, and the passive construction ("some improvements")
gives her nothing credible to say in a meeting. She closes the email.

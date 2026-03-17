# Customization

## Personas

Personas are the core of ShipSignal. Each persona is a plain markdown file in the `personas/` folder that defines a specific audience: who they are, what they care about, how they want to be spoken to, and the exact structure of their release notes.

**No code changes are needed to manage personas.** Add a file, edit a file, delete a file.

---

### Built-in Personas

| File | Persona | Who they are | Typical environments |
|---|---|---|---|
| `vp.md` | The VP | C-suite or VP exec who owns the board and customer narrative. Reads the first bullet; if it doesn't connect to a business outcome, the email closes. No technical terms, ever. | Production |
| `customer.md` | The Customer | Power user who lives in the product daily. First question when an update lands: *did this break what I depend on?* Writes to felt experience, not implementation. | Production |
| `technical-user.md` | The Technical User | Senior engineer or admin keeping their systems working with this product. Scans for `Breaking:` first, then endpoint names, then metrics. Vague language means an untrustworthy note. | Staging, Production |
| `partner.md` | The Partner | Engineer at a company that has built an integration on top of this platform. A breaking change they miss becomes their customer's problem. Needs exact API surfaces and hard deprecation timelines. | Production |
| `internal.md` | The Internal User | QA lead or PM running the staging sign-off. Reading this to build a test plan. Every change is a test scenario. Needs Jira IDs, setup steps, and edge cases, not customer-facing framing. | Staging / UAT |

Each file includes writing instructions, an exact output template, and a good/bad example.
Add your own by copying `personas/TEMPLATE.md`, no code changes needed.

---

### Adding a Persona

1. Copy the template as a starting point:

```bash
cp personas/TEMPLATE.md personas/enterprise-admin.md
```

2. Fill in each section: who they are, when they read this, what they need, what to
   leave out, writing instructions, output structure, and a good/bad example. The
   template includes guidance in each section to help you get specific.

3. Add the persona name to the relevant `deploy_points[].personas` list in `config/team-config.yml`:

```yaml
deploy_points:
  - environment: production
    personas: [vp, customer, partner, enterprise-admin]
```

4. Test locally with `PERSONA_OVERRIDE=enterprise-admin npm run dev` before pushing.

---

### Editing a Persona

Open the file in `personas/` and update it directly. Changes take effect on the next pipeline run. Common edits:

- **Tone shifts**: update the Tone section and the Good/Bad examples
- **Structure changes**: update the Output Structure template
- **Scope changes**: add or remove items from Writing Instructions
- **Audience changes**: if a persona's audience definition evolves, update the Audience Description

The product team can own and evolve these files independently of the engineering team.

---

### Removing a Persona

1. Delete the file from `personas/`
2. Remove the persona name from `deploy_points[].personas` in `config/team-config.yml`

---

## Brand Voice

If personas answer **who** you're writing for, brand voice answers **how you sound doing it.**

Your brand voice is a single file, `config/voice.md`, that applies universally to every persona on every run. It's the writing personality layer: tone, rhythm, banned phrases, formatting rules, how to translate technical metrics into plain language. One file controls all of it, across every audience, on every deployment.

You have two options: start from a pre-built voice and get running today, or build your own from scratch.

---

### Use a pre-built voice

ShipSignal ships with six voices, each tuned for a different brand personality. Pick the one that sounds like you, copy it to `config/voice.md`, and you're set. Edit them freely. They're starting points, not rules.

| File | Voice | Style | Best for | Sample line |
|---|---|---|---|---|
| `the-operator.md` | The Operator | Direct, accountable, metrics-first | Ops-heavy products, reliability platforms | *"Checkout errors: was 3.2%. Now 0.1%."* |
| `the-visionary.md` | The Visionary | Minimalist, poetic, human-centered | Consumer products, design-forward platforms | *"The wait is gone. Search is instant now."* |
| `the-storyteller.md` | The Storyteller | Warm, authentic, failure-honest | B2C, lifestyle brands, community products | *"We broke this last month. Here's what we learned."* |
| `the-customer-champion.md` | The Customer Champion | Principled, clear, customer-obsessed | Enterprise B2B, long-term relationships | *"Three enterprise teams flagged this in QBRs. It's resolved."* |
| `the-straight-shooter.md` | The Straight Shooter | Raw, fast, zero corporate | Developer tools, startup products | *"Search was broken for queries over 50 chars. Fixed. Go try it."* |
| `the-connector.md` | The Connector | Empathetic, research-grounded, warm | Healthcare, education, HR, community | *"A lot of you have been working around this for months. Here's what changed."* |

```bash
cp voices/the-operator.md config/voice.md
```

---

### Build your own

If your brand has an established style, write `config/voice.md` from scratch. The file has a defined structure (see `voices/README.md` for guidance) but the content is entirely yours.

A complete `config/voice.md` defines:

- **Core principles**: how to frame value, language level, specificity requirements
- **Banned phrases**: words and constructions that should never appear in output
- **Formatting rules**: headers, bullets, metric formatting, date formatting
- **Metric translation guide**: how to convert technical numbers into customer language
- **Sensitive information rules**: what to never expose (infra topology, vulnerability details, internal ticket IDs)

Update `config/voice.md` whenever your brand voice evolves, a new communications standard is adopted, or you find patterns in the output that need correcting across all personas at once.

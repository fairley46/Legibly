# Persona: Jordan

<!-- Jordan is a power user who lives in this product every day. Non-technical, but
     knows the product deeply. More worried about something breaking than excited
     about something new. -->

## Who They Are

Jordan is an operations coordinator or marketing specialist at a mid-size company.
They've been using this product for over a year. They know it better than most people
on their team — not because they're technical, but because they spend hours in it every
day. They have workflows. Shortcuts. Ways of doing things. They've built their whole
process around how the product works right now.

When something changes, Jordan's first reaction is: *did this break what I depend on?*
And their second reaction — once they're sure they're safe — is genuine curiosity about
what's new.

## Their Day

8:45am: opens the product before their first meeting. Uses it to pull a report or
prep something they'll need by noon.
Throughout the day: the product is a background tab, always open, dipped into constantly.
End of day: closes out a queue, exports something, logs off.

They interact with release notes when they land in their inbox or appear as an in-app
banner. Usually mid-morning. They're between tasks, not in a rush.

## The Moment They Read This

Jordan is at their desk, laptop, a browser full of tabs. They clicked through from an
email subject line that said something changed. They have about 2 minutes.

Their primary emotion is mild anxiety: *please don't let this have broken the thing I
use every single day.* Once they confirm that, they shift to genuine interest: *oh,
that's new, I've been wanting that.*

They are not looking for technical explanations. They're looking for: **will this
change how I work?** And if yes: **how, and is it better or worse for me?**

## What They're Hired to Do

Get things done. Keep their workflows running. Hit their deadlines. Look competent
to their manager. They don't manage the product — they use it to manage their actual job.

Their JTBD: "Help me do my work without surprises, friction, or things breaking when
I'm in the middle of something that matters."

## What Keeps Them Up at Night

An update ships overnight and tomorrow morning the thing they rely on works differently
or stops working. They're in front of their manager or a client and can't do what they
said they'd do. Something they export looks wrong and they don't catch it. A report
they send every Monday stops sending correctly.

They've been burned by software updates before. They're watchful.

## What a Great Day Looks Like

They open the product and everything works exactly as expected. Or: they open the product
and something that used to be annoying is now just... gone. Fixed. Easier. They didn't
have to ask for help, file a support ticket, or explain to their manager why something
doesn't work. They just did their work and went home.

That feeling — "the product is on my side today" — is a great day.

## What They Know About Technology

They know the product's feature names and navigation deeply. They know what a CSV export
is, what a dashboard is, what a notification is. They do not know what a database is,
what an API is, or what latency means. They've never seen a pull request.

What they understand is felt experience: "it was slow, now it's fast." "I used to have
to click four times, now it's one." "This thing that broke last month is fixed."

Do not use technical terms. Do not explain how something works under the hood. Describe
what they experience now that is different from what they experienced before.

## What They Don't Care About

- Why the change was technically difficult
- What system or component was modified
- Which team owns this area
- Architecture, infrastructure, or backend changes with no user-visible impact
- Internal ticket references
- API changes (unless it affects something they click in the UI)
- Anything involving code

Every sentence about implementation is a sentence that makes them feel like this
update wasn't written for them.

## Writing Instructions

- **Use "you" throughout.** This note is for them, not about them.
- **Lead with what changed for the user's experience**, not what engineering did.
- **Translate performance into felt experience.** Not "latency reduced 340ms." Instead: "pages load noticeably faster now — especially after you log in."
- **Acknowledge fixes with empathy first.** "An issue that was causing X for some of you is resolved." Validate before informing.
- **Keep every bullet to 1-2 sentences.** They're skimming.
- **No jargon, no acronyms, no internal names.** If you wouldn't find this word on a UI label, don't use it.
- **Signal when no action is needed.** They worry about action items. If they don't need to do anything: say so.
- **Tone:** Warm, direct, human. Like a customer success person who genuinely likes their customers.

## Output Structure

```
## What's new — [readable date, e.g. "March 16, 2026"]

**New this week:**
- [What you can now do, written as a user action or user experience]

**Faster and more reliable:**
- [What got better — performance or stability — described as felt experience]

**Fixed:**
- [What was broken, described as the user experienced the problem, now resolved]

**Nothing you need to do:** [one line reassuring them if no action required]
```

## Good Example

> ## What's new — March 16, 2026
>
> **New this week:**
> - You can now schedule exports to run automatically on a daily or weekly
>   schedule. Set it once under Settings > Exports.
>
> **Faster and more reliable:**
> - Your dashboard loads noticeably faster now — most of you will see it in
>   under a second instead of three or four. Especially noticeable after login.
>
> **Fixed:**
> - An issue that was causing some exports to come through blank or incomplete
>   has been resolved. If you ran into this, it should be working correctly now.
>
> **Nothing you need to do.** These changes are live — no updates, no new settings required.

## Bad Example

> Dashboard rendering performance was improved via async data fetching optimization
> and component-level memoization. Export pipeline race condition resolved in async
> worker queue. Scheduled task feature added with cron-based configuration.

**Why this fails:** Jordan reads "async data fetching" and immediately feels like this
wasn't written for them. They can't tell if their workflow is affected. They skim for
something recognizable, don't find it, and move on without understanding what changed.

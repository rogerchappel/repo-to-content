# Dogfood record (2026-10-03)

This record exercises the checked-out CLI on this repository itself and on a
public, real GitHub repository, then inspects a real connector-catalog fixture.
All repository/catalog inspection is read-only. The catalog is fixture data;
no connector service or account is contacted.

## Reproduce

From the root of a clean checkout, with Node.js available:

```sh
npm ci
node src/cli.js . --format posts
node src/cli.js . --format launch-notes
```

Observed for this repository at `bd2c28bb0caefe6f1d2130b571835cb335c7f7f6`:

- The posts output identified `repo-to-content` and its package description.
- The launch-notes output identified the same name and description.
- The output's README-derived capability bullets were truncated link descriptions
  (for example, `[examples/content-sweep-demo.md](...) walks`). This is a
  limitation: repository README link bullets are treated like ordinary claims,
  so the generated copy is awkward and not a polished promo draft. Review output
  before use. No external content was published.

## Public repository and catalog evidence

The publicly accessible `rogerchappel/connector-fixture-pack` repository has a
checked-in synthetic CRM connector bundle at `fixtures/crm-basic/`. At the time
of inspection its default-branch commit was
[`27a64a2c51451c917339b25758c434617943e691`](https://github.com/rogerchappel/connector-fixture-pack/commit/27a64a2c51451c917339b25758c434617943e691).
The following read-only GitHub API requests reproduce the inspected source
material without cloning or executing the other project. Their observed
responses at that inspection point were: bundle `crm-basic` declares connector
`crm`; the request is a synthetic `POST` `create_note` for `contact_demo_123`;
the response is marked `dry_run` with `externalWrite: false`; and an explicit
required approval prompt is present. The complete checked-in fixture files
remain the machine-readable observed outputs; these values are summarized here
so the findings are visible in the record.

```sh
gh api 'repos/rogerchappel/connector-fixture-pack/contents/fixtures/crm-basic/bundle.json?ref=main'
gh api 'repos/rogerchappel/connector-fixture-pack/contents/fixtures/crm-basic/requests.json?ref=main'
gh api 'repos/rogerchappel/connector-fixture-pack/contents/fixtures/crm-basic/responses.json?ref=main'
gh api 'repos/rogerchappel/connector-fixture-pack/contents/fixtures/crm-basic/approvals.json?ref=main'
```

These are declared fixture values, not evidence of a live CRM integration or
a successful external write.

For a second real repository exercise, the read-only repository listing
confirmed the public `rogerchappel/mcpmock` project and described it as a
fixture-backed mock MCP catalog tool. Its README documents local catalog
validation/listing commands, but this record does not install or execute that
separate project. This is observational evidence only; no claim is made about
its current runtime behavior.

## Limits and safety

The exercise confirms local generation and the presence of a public connector
catalog fixture, not connector interoperability: `repo-to-content` has no
connector-catalog input mode. The catalog is synthetic and the CLI's generated
README-link bullets need human editing. No credentials, live connector calls,
network writes, or publishing were used. Re-run the commands against current
remote content before relying on this dated observation; public repositories
and their default branches may change.

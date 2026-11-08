# Getting Started

Welcome to your new CAP project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`readme.md` | this getting started guide

## Next Steps

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start with your domain model, in a CDS file in `db/`

## Learn More

Learn more at <https://cap.cloud.sap>.



## Incident classification (pluggable)

New incidents are classified (urgency + category) in `srv/ai/classifier.js`.

| `AI_PROVIDER` | Behaviour |
|---|---|
| `rules` (default) | Keyword rules, no external service needed |
| `orchestration` | LLM via SAP AI Core / Generative AI Hub (SAP Cloud SDK for AI) |

Design decisions:
- LLM output is **whitelisted** (`normalize()`), never trusted directly
- Only title and message are sent to the model, **no customer personal data**
- 8 s timeout, automatic **fallback to rules** if the LLM fails
- Unit-tested without any external service (`tests/classifier.test.js`)

> The LLM path is implemented but not verified end to end, because it needs an
> SAP AI Core instance (Extended plan). The rule-based path is what runs by default.

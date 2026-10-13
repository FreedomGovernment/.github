# Channel_

Freedom Government YouTube channel: open-source government, legal activism, public-service engineering, and live development. This file governs channel content, not legal filings or infrastructure administration.

## Channel identity and editorial contract

- Show the Captain's actual work: representing himself, drafting and checking his complaint, debugging FreeLawGen, and building affordable infrastructure. Do not substitute a generic startup pitch, tutorial, product launch, or fictional narrative for the activity requested.
- Preserve concrete details and the Captain's candid engineering voice. Organize dense material rather than deleting the technical substance. For a rewrite, provide one ready-to-paste version by default; no unsolicited three-option menu, production blueprint, or explanation of why the copy works.
- Follow the latest request. Do not recycle an earlier answer after the subject changes. Keep humor brief; a joke about needing an electrician can simply be a joke about GPU power demand.
- Treat this project brief as user-reported context, not independent verification. Preserve exact hardware/model identifiers; flag contradictions or uncertain compatibility instead of silently correcting names, capacities, or component relationships.
- Distinguish current operation, work in progress, proposed design, tested capability, and long-term ambition. Do not turn a planned build into a deployed system or a configured context length into a benchmark.
- Public contribution link: https://github.com/FreedomGovernment/. FreeLawGen is currently private according to the Captain; verify before describing a public release. Preserve the open-source mission without misrepresenting an individual repository's actual license or visibility.

## Founder story and legal activism

The Captain reports livestreaming almost all of McCollough v. Portland State University leading up to the appeal. Spending a month on the appeal threw his broader work off track for an entire year. He has described newspaper interviews and reporters contacting him. Preserve this personal history rather than presenting the channel as a newly invented marketing campaign; do not invent publications, quotes, audience size, or press endorsements.

The immediate priority is completing his real complaint. Livestreaming and software development accompany that work; they are not prerequisites to filing. A four-hour work session or a 4 PM target is a personal goal, not a verified legal deadline or a promise of readiness.

Keep legal advocacy separate from adjudicated outcomes. Verify the actual opinion before describing an appellate disposition. A reversal in part is not a final liability or damages victory. The challenge to using a preponderance-of-the-evidence standard to deprive fundamental rights is an argument the Captain seeks to establish, not an already established blanket ban. Do not drop that objective merely because it is contested.

The Captain describes a possible $2.35M recovery involving the State of Oregon and hopes to return value through public-service infrastructure. Describe this only as his contingent expectation or objective, not an award, settlement, debt owed, verified proper defendant, government contract, or committed project financing.

## Mission and public-service economics

Freedom Government is the Captain's open-source government and governance initiative, not a claim of governmental authority. Its projects include:

- FreeLawGen: Hermes-powered legal-assistance software intended to help people who otherwise lack assistance.
- FreedomCourt: a court simulator, including the proposed Supreme Freedom Court AI Justices Judge Grok, Judge GPT, Judge Gemini, Judge Nemotron, and Judge Claude. Model-named profiles are simulation roles, not real judges, vendor endorsements, or proof that the named provider is actually configured and working. Verify routing and execution before advertising a functioning panel.
- Freedom Voting Machine: the proposed message-driven design using three-factor authentication, pen-and-paper, anonymous public paper ledgers, and blockchain. Describe visibility, auditability, and fraud resistance as engineering goals unless demonstrated; never invent certification or a proof that cheating is impossible.

The public-service premise is that states also have constrained budgets. The Captain wants to build free legal-assistance infrastructure useful to public-defense services with used parts and repurposed/e-waste GPUs, rather than requiring an expensive new enterprise cluster. He has other startups; this initiative is intended as a public service. Website revenue is welcome as a way to sustain that work, not its sole purpose. Preserve this economic argument without promising state adoption, public-defender appointments, attorney representation, or replacement of legally required counsel. A civil self-help drafting tool is not itself a staffed public-defender service.

## Infrastructure brief: current versus planned

This section records the Captain's supplied description. It is not a tested bill of materials, compatibility certification, or authorization to change machines. Reconfirm status before each publication.

### Current operation and migration sequence

- Ubuntu Server currently runs as a VM in TrueNAS SCALE, with Hermes in a Podman container. Do not call the current deployment bare metal.
- The Captain reports a unified home with RAIDZ1 3x1TB NVMe and 3x6TB HDD pools, replacing work scattered across multiple computers. Preserve the unified-home motivation; do not infer one combined pool or that RAIDZ1 is a backup.
- Bare-metal Ubuntu Server migration is planned after the complaint is filed. The intended direction is bare metal throughout; the Captain finds TrueNAS SCALE obstructive for his agent-driven workflow. Attribute that experience to him rather than claiming universal technical impossibility.
- The goal is an affordable consolidated monolith suitable for eventual datacenter deployment. Migration, datacenter placement, operational readiness, and performance remain separate milestones.

### Budget monolith design, as supplied

- Lenovo P720 with dual Xeon Gold 6230, 192GB (12x16GB) DDR4 2933 ECC.
- Two 256GB SATA boot SSDs; no boot mirroring scheme is confirmed here.
- PCIe x16 quad NVMe card and the storage pools described above.
- V100 16GB intended for vector-database work and quantum-physics experiments; do not imply demonstrated acceleration or a quantum computer.
- RTX 5060 TI 16GB intended for Hermes-associated H.265 10-bit 422 CODECs in FFMPEG, plus Isaac Sim for AStarship Aerospace drone research. Codec encode/decode support and simulator compatibility are verification items, not established capabilities.
- A proposed 3D-printed 1U side panel for the P720, placing two GPUs perpendicular to the motherboard to improve airflow on a budget.
- Intended access to PCIe x8 and PCI slots for an x710-DA2 or x720-DA4 or 40G Infiniband card, plus an ATI Rage XL maintenance VGA adapter. These are proposed alternatives and supplied identifiers, not confirmed installed cards or compatible slots.
- One PCIe x4 slot intended to remain available for an additional SATA card, supporting two 3x or 4x HDD RAIDZ1 pools, with room to add a new pool using a proposed 3D-printed 3U side panel.
- Content-creation NAS backend: Lenovo P520 Xeon W-2235 as reported, with bare-metal Ubuntu Server as the intended direction.

Before publishing this as a reproducible recommendation, verify CPU/socket/chipset pairings for both Lenovo systems, memory support and actual speed, PCI versus PCIe availability, lane allocation/bifurcation and riser requirements, card identifiers, drive/controller connectivity, PSU and cooling capacity, mechanical fit, codec capabilities, and software support. Keep the original supplied identifiers intact when flagging discrepancies. Do not silently substitute different processors, workstations, network cards, or capacities. Distinguish the current pools from proposed expansion pools.

### Local inference and funding context

Earlier channel briefs describe two Intel Arc B70 32GB GPUs with TP=2 for Qwen 3.8 27B FP8; an RTX 5070 TI 16GB paired with an RTX 5060 TI 16GB using PP=2 for Qwen 3.6 35B A3B; and a separate RTX 5060 TI 16GB for Gemma 4 12B QAT TurboQuant. Do not silently reassign every GPU to the same model or chassis, or conflate the inference and media/research roles. Exact placement and concurrent resource allocation need confirmation.

The funding mix described is a $20/month ChatGPT subscription, OpenRouter pay-as-you-go usage, and local inference. Claimed 256K context configurations and RAM-backed KV cache sizes require route-specific verification; earlier aggregate and per-route cache descriptions conflict. Do not combine them into an invented shared usable cache. Planned dual Arc B60 24GB upgrades and larger future machines are not current capacity. Do not claim YouTube engineered a particular model for content creation without a supporting primary source.

## Production, privacy, and ownership

- The content creator owns channel copy and production planning, not the complaint's legal decisions, court records, or infrastructure migration. Do not modify other repositories, profiles, model routes, evidence, or archives as a side effect of this channel brief.
- Use authorized public records and specifically approved material. A prior livestream does not make every current draft, private communication, child's detail, or third-party record safe to broadcast. Select broadcast-safe windows and documents; never show credentials, unrestricted logs, or private model endpoints.
- Load engineering-opsec for non-public engineering information and attorney-client-privilege for potentially protected legal communications. Never promise that AI conversations or publicly streamed strategy are privileged.
- Keep original documents and evidence intact. Work in Markdown and follow the parent LoD rules when consulting litigation sources. Missing evidence stays missing; a model must not fill factual gaps from invention.
- This local instruction update does not authorize publishing, committing, pushing, starting a stream, filing a complaint, contacting a party, or migrating storage. Obtain explicit authorization for those actions and verify the actual result.
- Before delivering copy, check preservation of requested details, factual status, exact links, case posture, simulation labels, and the distinction between public-service ambition and verified implementation. Keep any necessary verification notes separate from ready-to-paste copy.

## Kanban board

This project belongs to the **FreedomGovernment** organization; its Kanban board slug is `freedom-gov` (see `~/FreedomGovernment/AGENTS.md`). Always target `freedom-gov` explicitly (`--board freedom-gov` / `board="freedom-gov"`). Never rely on the current-board pointer. If a task's assigned board differs, report the mismatch before acting — do not silently switch.

## Code Style — Chimera+ (AStarship Standard)

All **code and filenames** in the AStarship ecosystem follow the **Chimera+** style guide
(`~/AStarStarship/ASCIICrabs/__ChimeraPlus.md`). The naming philosophy applies to code
identifiers and filenames fleet-wide.

### Core Rule: immutable vs mutable
- **Immutable** (can't change after init) → **CamelCase**
- **Mutable** (changes at runtime) → **lower_snake_case**

### Naming Summary
| Element | Convention | Example |
|---|---|---|
| Type aliases (fixed-width) | 3-letter CAPS codes | `CHA` char8, `ISC` int32, `IUD` uint64, `BOL` bool, `FPC` float32, `FPD` double64 |
| Structs / classes | CamelCase + T(POD)/A(utoject) prefix | `TArray`, `AMap`, `Crabs` |
| Struct members (mutable) | lower_snake_case | `socket_bytes`, `header_bytes` |
| Struct members (immutable) | CamelCase | `StackTotalMin`, `ColumnWidth` |
| Free functions / methods | CamelCase, type-prefixed | `CrabsInit`, `TArrayBytes`, `TMapFind` |
| Function suffixes | `_NC` (no-check), `C` (const/count), `T` (POD), `A` (autoject) | `TArrayInsert_NC`, `CSizeMin` |
| Local variables | lower_snake_case (always) | `bytes_data`, `read_cursor` |
| Macros / #define | UPPER_SNAKE_CASE | `CRABS_RUN_TESTS`, `CPU_X64` |
| Private/protected members | trailing underscore | `aobj_`, `array_` |
| Namespaces | `namespace _ { ... }` | single shared underscore namespace |
| DB names / tables / columns | lower_snake_case (mutable) | `user_sessions`, `order_items` |
| Client-facing API / headers | CamelCase (immutable contract) | `OrderService`, `PaymentGateway` |
| Filenames (client contract) | CamelCase | `OrderService.h` |
| Filenames (host/storage) | lower_snake_case | `user_sessions.py` |

### Header Boilerplate (C/C++)
```
// Copyright AStarship <https://astarship.net>.
#pragma once
#ifndef CRABS_<NAME>_<H|HPP>
#define CRABS_<NAME>_<H|HPP>
#include "..."
#if SEAM >= CRABS_<NAME>
... body ...
#endif
#endif
```

### Formatting
- 2-space indent
- Opening brace same line (functions/control), next line (structs/classes)
- `D_ASSERT()`, `D_COUT()`, `D_RETURNT(type, val)` for debug/assert/return
- `NILP` = nullptr
- `alignas(ACPUCacheLineSize)` for hot structs
- Doxygen `/** @param @return @pre @link @see @code */` comments

### The One-Sentence Version
**Immutable → CamelCase, mutable → lower_snake_case; macros UPPER_SNAKE; private/protected
get a trailing `_`; types are short CAPS width-codes (CHA/ISC/IUD/BOL); structs are
CamelCase with T(POD)/A(utoject) prefix; functions are CamelCase with T/A kind prefixes
and _NC/C markers; locals are snake_case; everything lives in `namespace _`; every file
starts with AStarship copyright, `#pragma once`, a `CRABS_*` guard, and `#if SEAM >= CRABS_*`
gating.** The name tells you the kind, width, access level, and mutability — before you
read the body.
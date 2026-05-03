# CivicFix Bob Build Story

## Project Summary

CivicFix is an AI-powered public issue reporting system built for the IBM Bob Hackathon. It helps citizens convert informal civic complaints into structured, professional reports that can be submitted to local authorities. The system uses IBM watsonx.ai for classification, complaint generation, and complaint improvement.

## How IBM Bob Was Used

IBM Bob was used as a codebase-aware development partner across the project lifecycle:

1. Full-codebase review
   Bob inspected the Django backend, React frontend, API contracts, setup files, and documentation to identify runtime bugs, stale code, and mismatches between frontend expectations and backend responses.

2. Bug diagnosis and repair
   Bob found and helped correct issues in serializer fields, dashboard statistics, map popup safety, escalation logic, frontend tests, CSV export, coordinate handling, and community voting.

3. Provider alignment for the hackathon
   Bob helped replace the non-compliant Gemini integration with an IBM watsonx.ai implementation while preserving the existing app flow and frontend API shape.

4. Feature expansion
   Bob helped add multilingual complaint generation and civic impact metrics so the project better addresses real citizen accessibility and government decision-making.

5. Verification support
   Bob ran focused checks for frontend tests and backend Python syntax, then documented remaining environment requirements such as installing the watsonx.ai SDK and configuring watsonx credentials.

## IBM Technology Use

- IBM Bob: Used for codebase reasoning, debugging, refactoring, documentation, and implementation planning.
- IBM watsonx.ai: Used as the model provider for civic issue classification, formal complaint generation, and complaint improvement.
- IBM Granite model: Default model configured as `ibm/granite-3-3-8b-instruct`, with `WATSONX_MODEL_ID` available for hackathon-specific model overrides.

## Impact

CivicFix targets a common public-service gap: citizens often know what is wrong in their neighborhood, but not how to write a formal complaint or identify the right department. The app lowers that barrier by producing structured civic reports, mapping issues to responsible authorities, and surfacing community-backed impact signals.

## Demo Flow

1. A citizen enters a civic issue and optional location.
2. The app classifies the issue using watsonx.ai.
3. The app maps the issue to the responsible authority.
4. The citizen chooses a complaint language.
5. watsonx.ai generates a formal complaint in that language.
6. Community issues appear in the list/map view.
7. The government dashboard shows operational metrics and civic impact signals.

## Why This Matters

CivicFix is designed to be useful beyond a demo. It can help citizens file clearer complaints, help local bodies triage issues faster, and help communities identify repeated infrastructure problems. The Bob-assisted development process also shows how a developer can safely improve an existing multi-part codebase under hackathon time pressure.

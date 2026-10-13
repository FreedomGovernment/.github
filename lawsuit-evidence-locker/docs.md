---
title: Documentation
shortTitle: Documentation
intro: Guides and documentation for using FreeLawGen.
type: reference
permissions: Public
product: FreeLawGen
layout: default
versions:
  fpt: '*'
  ghes: '*'
showMiniToc: true
---

# Documentation

Guides and documentation for using FreeLawGen effectively.

## Getting Started

FreeLawGen is a static website hosted on GitHub Pages. To get started:

1. Visit the homepage
2. Browse the evidence locker to organize your case materials
3. Use the document converter to format your notes and evidence
4. Select a template from the templates page for your legal documents
5. Use the AI Legal Assistant to generate or enhance your documents

## Evidence Locker Guide

### Adding Evidence

To add new evidence to your case tracker:

1. Navigate to the Evidence Locker
2. Scroll to the "Add New Evidence Item" form
3. Fill in the title, type, description, status, and date
4. Add any associated files (comma-separated)
5. Click "Add Evidence Item"

### Searching and Filtering

Use the search bar to find specific evidence by title, description, or tags. Filter by status to focus on active cases, appeals, or closed matters.

## Document Converter Guide

### Converting Text to Markdown

The document converter transforms plain text into clean markdown format:

1. Navigate to the Document Converter
2. Paste your text in the input field
3. Click "Convert to Markdown"
4. Review the converted output
5. Click "Download as .md" to save the file

### Using the AI Legal Assistant

The AI Legal Assistant integrates with major LLM providers:

1. Navigate to the Document Converter
2. Enter your API key (stored locally in your browser)
3. Select your preferred model
4. Enter your prompt
5. Click "Generate Response"

## Templates Guide

### Available Templates

- **Complaint** — Standard civil complaint for federal court
- **Petition for Writ of Certiorari** — Template for petitioning higher courts
- **Motion to Compel** — Motion to compel discovery responses
- **Appellate Brief** — Template for appellate briefs
- **Case Timeline** — Chronological event organizer
- **Evidence Log** — Evidence tracking template

### Using Templates

1. Navigate to the Templates page
2. Browse the available templates
3. Click "Use Template" for the one you need
4. The template will load in the Document Converter
5. Replace all bracketed placeholders with your case information
6. Review and customize as needed
7. Download the finished document

## Privacy & Security

### Data Storage

FreeLawGen stores all your data locally in your browser using localStorage. This means:

- Your evidence, case notes, and API keys are stored only on your device
- No data is sent to any server or third party
- If you clear your browser data, you'll lose your stored information
- You can export your data for backup purposes

### API Key Security

Your LLM API keys are stored securely in your browser's localStorage. They are never transmitted to our servers or any third party. When you make an AI request, it goes directly from your browser to the LLM provider's API.

## Troubleshooting

### Common Issues

#### AI Generation Fails

If the AI assistant returns an error:

- Check that your API key is correct and has sufficient credits
- Verify your internet connection
- Try a different model if one provider is experiencing issues
- Check the LLM provider's status page for outages

#### Documents Not Saving

If your evidence or case data isn't saving:

- Check that you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Ensure localStorage is enabled in your browser settings
- Try clearing your browser cache and cookies
- Check that you're not in private/incognito mode (which may clear localStorage)

## FAQ

### Is FreeLawGen really free?

Yes! FreeLawGen is hosted on GitHub Pages, which provides free hosting for static websites. There are no monthly fees, no subscriptions, and no hidden costs.

### Do I need to pay for the AI assistant?

The AI assistant uses your own API keys from providers like OpenAI or Anthropic. You'll need to pay for API usage through those providers, but FreeLawGen itself is completely free.

### Can I use FreeLawGen for commercial purposes?

FreeLawGen is published under the AStartup Strong Source-available License, which is non-commercial. You may use it for personal legal cases, educational purposes, and legal activism. Commercial resale requires expressed written permission.

### Is my data secure?

Yes. All your data is stored locally in your browser. No data is sent to any server. Your API keys are stored in localStorage and never transmitted to our servers.

### Can I contribute to FreeLawGen?

Absolutely! We welcome contributions from the community. You can contribute code, templates, documentation, or simply spread the word. Visit our [GitHub repository](https://github.com/FreedomGovernment/lawsuit-evidence-locker) to get started.

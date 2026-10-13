// FreeLawGen — Evidence Locker & Legal Document Generator
// Main JavaScript for client-side functionality

// Mobile menu toggle
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
  const nav = document.querySelector('.navbar');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (nav && mobileBtn && navLinks && !nav.contains(event.target)) {
    navLinks.classList.remove('active');
  }
});

// Document Converter functionality
class DocumentConverter {
  constructor() {
    this.input = document.getElementById('converter-input');
    this.output = document.getElementById('converter-output');
    this.convertBtn = document.getElementById('convert-btn');
    this.clearBtn = document.getElementById('clear-btn');
    this.downloadBtn = document.getElementById('download-btn');
    
    if (this.convertBtn) {
      this.convertBtn.addEventListener('click', () => this.convert());
    }
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => this.clear());
    }
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener('click', () => this.download());
    }
  }

  convert() {
    const input = this.input?.value;
    if (!input?.trim()) {
      alert('Please enter some text to convert.');
      return;
    }

    // Simple markdown conversion examples
    let output = input
      // Headers
      .replace(/^### (.+)$/gm, '### $1')
      .replace(/^## (.+)$/gm, '## $1')
      .replace(/^# (.+)$/gm, '# $1')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '**$1**')
      // Italic
      .replace(/\*(.+?)\*/g, '*$1*')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '[$1]($2)')
      // Images
      .replace(/!\[(.+?)\]\((.+?)\)/g, '![$1]($2)')
      // Lists
      .replace(/^- (.+)$/gm, '- $1')
      .replace(/^\* (.+)$/gm, '* $1')
      .replace(/^\d+\. (.+)$/gm, '$1. ');

    if (this.output) {
      this.output.value = output;
    }
  }

  clear() {
    if (this.input) this.input.value = '';
    if (this.output) this.output.value = '';
  }

  download() {
    const output = this.output?.value;
    if (!output?.trim()) {
      alert('No content to download.');
      return;
    }

    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// LLM Integration functionality
class LLMIntegration {
  constructor() {
    this.apiKeyInput = document.getElementById('llm-api-key');
    this.modelSelect = document.getElementById('llm-model');
    this.promptInput = document.getElementById('llm-prompt');
    this.generateBtn = document.getElementById('llm-generate');
    this.responseDiv = document.getElementById('llm-response');
    
    this.loadSettings();
    
    if (this.generateBtn) {
      this.generateBtn.addEventListener('click', () => this.generate());
    }
  }

  loadSettings() {
    // Load saved API key from localStorage
    const savedKey = localStorage.getItem('freelawgen_api_key');
    if (savedKey && this.apiKeyInput) {
      this.apiKeyInput.value = savedKey;
    }

    // Load saved model preference
    const savedModel = localStorage.getItem('freelawgen_model');
    if (savedModel && this.modelSelect) {
      this.modelSelect.value = savedModel;
    }
  }

  saveSettings() {
    if (this.apiKeyInput?.value) {
      localStorage.setItem('freelawgen_api_key', this.apiKeyInput.value);
    }
    if (this.modelSelect?.value) {
      localStorage.setItem('freelawgen_model', this.modelSelect.value);
    }
  }

  async generate() {
    const apiKey = this.apiKeyInput?.value;
    const model = this.modelSelect?.value;
    const prompt = this.promptInput?.value;

    if (!apiKey) {
      alert('Please enter your API key.');
      return;
    }

    if (!prompt?.trim()) {
      alert('Please enter a prompt.');
      return;
    }

    // Save settings
    this.saveSettings();

    // Show loading state
    if (this.responseDiv) {
      this.responseDiv.className = 'llm-response loading';
      this.responseDiv.textContent = 'Generating response...';
    }

    if (this.generateBtn) {
      this.generateBtn.disabled = true;
      this.generateBtn.textContent = 'Generating...';
    }

    try {
      const response = await this.callLLM(apiKey, model, prompt);
      
      if (this.responseDiv) {
        this.responseDiv.className = 'llm-response';
        this.responseDiv.textContent = response;
      }
    } catch (error) {
      console.error('LLM Generation Error:', error);
      
      if (this.responseDiv) {
        this.responseDiv.className = 'llm-response';
        this.responseDiv.textContent = 'Error: ' + error.message + '\n\nPlease check your API key and try again.';
      }
    } finally {
      if (this.generateBtn) {
        this.generateBtn.disabled = false;
        this.generateBtn.textContent = 'Generate';
      }
    }
  }

  async callLLM(apiKey, model, prompt) {
    // Determine the API endpoint based on the model
    let apiUrl, requestBody;

    if (model.includes('openai')) {
      apiUrl = 'https://api.openai.com/v1/chat/completions';
      requestBody = {
        model: model.split('/').pop(),
        messages: [
          {
            role: 'system',
            content: 'You are a helpful legal assistant helping with documentation and analysis of legal cases. Provide clear, accurate, and professional responses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      };
    } else if (model.includes('anthropic')) {
      apiUrl = 'https://api.anthropic.com/v1/messages';
      requestBody = {
        model: model.split('/').pop(),
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      };
    } else {
      // Default to OpenAI format for custom endpoints
      apiUrl = model;
      requestBody = {
        model: 'default',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful legal assistant.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      };
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    };

    // Add Anthropic-specific headers if needed
    if (model.includes('anthropic')) {
      headers['anthropic-version'] = '2023-06-01';
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'API request failed with status ' + response.status);
    }

    const data = await response.json();

    // Extract the response content based on the API format
    if (model.includes('openai')) {
      return data.choices?.[0]?.message?.content || 'No response generated.';
    } else if (model.includes('anthropic')) {
      return data.content?.[0]?.text || 'No response generated.';
    } else {
      // Generic format
      return data.choices?.[0]?.message?.content || data.response || 'No response generated.';
    }
  }
}

// Evidence Locker functionality
class EvidenceLocker {
  constructor() {
    this.evidenceGrid = document.getElementById('evidence-grid');
    this.searchInput = document.getElementById('evidence-search');
    this.filterStatus = document.getElementById('filter-status');
    
    this.loadEvidence();
    
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.filterEvidence());
    }
    if (this.filterStatus) {
      this.filterStatus.addEventListener('change', () => this.filterEvidence());
    }
  }

  loadEvidence() {
    // Load evidence from localStorage or use default cases
    let evidence = JSON.parse(localStorage.getItem('freelawgen_evidence') || '[]');
    
    // If no custom evidence, use site defaults
    if (evidence.length === 0) {
      evidence = this.getDefaultEvidence();
    }
    
    this.renderEvidence(evidence);
  }

  getDefaultEvidence() {
    return [
      {
        id: '1',
        title: 'McCollough v. Portland State University',
        type: 'Case',
        status: 'Appeal',
        description: 'First Amendment retaliation claim under 42 U.S.C. § 1983',
        date: '2024-01-15',
        files: ['complaint.md', 'evidence.md', 'timeline.md']
      },
      {
        id: '2',
        title: 'Jerry v. Lane County',
        type: 'Case',
        status: 'Active',
        description: 'Constitutional rights case',
        date: '2024-03-20',
        files: ['petition.md', 'supporting-docs.md']
      }
    ];
  }

  renderEvidence(evidence) {
    if (!this.evidenceGrid) return;

    this.evidenceGrid.innerHTML = evidence.map(item => {
      const statusClass = item.status.toLowerCase();
      return '<div class="evidence-item" data-id="' + item.id + '" data-status="' + statusClass + '">' +
        '<h3>' + item.title + '</h3>' +
        '<p>' + item.description + '</p>' +
        '<div class="evidence-meta">' +
          '<span class="status-badge status-' + statusClass + '">' + item.status + '</span>' +
          '<span>' + item.date + '</span>' +
        '</div>' +
        '<div class="evidence-files mt-2">' +
          item.files.map(function(file) { return '<small class="text-muted">' + file + '</small>'; }).join(', ') +
        '</div>' +
      '</div>';
    }).join('');
  }

  filterEvidence() {
    const searchTerm = this.searchInput?.value?.toLowerCase() || '';
    const statusFilter = this.filterStatus?.value || 'all';
    
    const items = this.evidenceGrid?.querySelectorAll('.evidence-item') || [];
    
    items.forEach(item => {
      const title = item.querySelector('h3')?.textContent?.toLowerCase() || '';
      const description = item.querySelector('p')?.textContent?.toLowerCase() || '';
      const status = item.dataset.status || '';
      
      const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      
      item.style.display = (matchesSearch && matchesStatus) ? 'block' : 'none';
    });
  }
}

// Template Manager
class TemplateManager {
  constructor() {
    this.templates = this.getDefaultTemplates();
    this.renderTemplates();
  }

  getDefaultTemplates() {
    return [
      {
        id: 'complaint',
        name: 'Complaint',
        description: 'Standard civil complaint template for federal court',
        content: this.getComplaintTemplate()
      },
      {
        id: 'petition',
        name: 'Petition for Writ of Certiorari',
        description: 'Template for petitioning higher courts',
        content: this.getPetitionTemplate()
      },
      {
        id: 'motion',
        name: 'Motion to Compel',
        description: 'Motion to compel discovery responses',
        content: this.getMotionTemplate()
      },
      {
        id: 'brief',
        name: 'Appellate Brief',
        description: 'Template for appellate briefs',
        content: this.getBriefTemplate()
      },
      {
        id: 'timeline',
        name: 'Case Timeline',
        description: 'Template for organizing case events chronologically',
        content: this.getTimelineTemplate()
      },
      {
        id: 'evidence-log',
        name: 'Evidence Log',
        description: 'Template for tracking evidence in a case',
        content: this.getEvidenceLogTemplate()
      }
    ];
  }

  getComplaintTemplate() {
    return [
      '# COMPLAINT FOR DAMAGES',
      '',
      '## CASE INFORMATION',
      '',
      '**Case Name:** [Plaintiff Name] v. [Defendant Name]',
      '**Case Number:** [To be assigned]',
      '**Court:** United States District Court for the [District] District of [State]',
      '',
      '## PARTIES',
      '',
      '1. **Plaintiff:** [Full Name], an individual residing at [Address]',
      '2. **Defendant:** [Full Name/Entity], [Capacity] at [Address]',
      '',
      '## JURISDICTION AND VENUE',
      '',
      '3. This Court has jurisdiction under 28 U.S.C. §§ 1331 and 1343.',
      '4. Venue is proper under 28 U.S.C. § 1391.',
      '',
      '## FACTUAL ALLEGATIONS',
      '',
      '5. Plaintiff alleges the following facts:',
      '   - [Fact 1]',
      '   - [Fact 2]',
      '   - [Fact 3]',
      '',
      '## CLAIMS FOR RELIEF',
      '',
      '### COUNT I - [Cause of Action]',
      '6. Plaintiff incorporates paragraphs 1-5 by reference.',
      '7. Defendant\'s actions violated [specific law/right].',
      '8. As a result, Plaintiff has suffered damages.',
      '',
      '### COUNT II - [Cause of Action]',
      '9. Plaintiff incorporates paragraphs 1-8 by reference.',
      '10. Defendant\'s actions violated [specific law/right].',
      '',
      '## PRAYER FOR RELIEF',
      '',
      'WHEREFORE, Plaintiff prays for judgment against Defendant as follows:',
      '- Compensatory damages in an amount to be determined at trial',
      '- Punitive damages where applicable',
      '- Injunctive relief',
      '- Attorney\'s fees and costs',
      '- Such other relief as the Court deems just and proper',
      '',
      '## JURY DEMAND',
      '',
      'Plaintiff demands a trial by jury on all issues so triable.',
      '',
      'Respectfully submitted,',
      '',
      '_________________________',
      '[Attorney/Pro Se Plaintiff Name]',
      '[Address]',
      '[Phone]',
      '[Email]',
      '[Date]'
    ].join('\n');
  }

  getPetitionTemplate() {
    return [
      '# PETITION FOR A WRIT OF CERTIORARI',
      '',
      '## TO THE [COURT NAME]',
      '',
      '[Petitioner Name], Petitioner,',
      'v.',
      '[Respondent Name], Respondent.',
      '',
      'On Writ of Certiorari to the [Lower Court]',
      '',
      '## PETITION FOR A WRIT OF CERTIORARI',
      '',
      'The petitioner respectfully petitions for a writ of certiorari to review the [decision/order] of the [lower court], entered on [date], in Case No. [case number].',
      '',
      '## QUESTIONS PRESENTED',
      '',
      '1. [Question 1]',
      '2. [Question 2]',
      '3. [Question 3]',
      '',
      '## JURISDICTION',
      '',
      'The [lower court] rendered its decision on [date]. This Court has jurisdiction under [relevant statute].',
      '',
      '## STATEMENT OF THE CASE',
      '',
      '[Summary of the case history and procedural background]',
      '',
      '## STATEMENT OF FACTS',
      '',
      '[Key facts relevant to the questions presented]',
      '',
      '## ARGUMENT',
      '',
      '### I. [First Question Presented]',
      '',
      '[Legal argument and analysis]',
      '',
      '### II. [Second Question Presented]',
      '',
      '[Legal argument and analysis]',
      '',
      '## CONCLUSION',
      '',
      'For the foregoing reasons, the petition for a writ of certiorari should be granted.',
      '',
      'Respectfully submitted,',
      '',
      '_________________________',
      '[Attorney Name]',
      '[Date]'
    ].join('\n');
  }

  getMotionTemplate() {
    return [
      '# MOTION TO COMPEL',
      '',
      '## TO THE HONORABLE [JUDGE NAME]',
      '',
      '[Plaintiff Name], Plaintiff,',
      'v.',
      '[Defendant Name], Defendant.',
      '',
      'Case No. [Case Number]',
      '',
      '## MOTION TO COMPEL',
      '',
      'COMES NOW [Plaintiff/Defendant], and respectfully moves this Court to compel [opposing party] to respond to discovery requests as follows:',
      '',
      '## STATEMENT OF THE CASE',
      '',
      '[Background of the case and discovery disputes]',
      '',
      '## ARGUMENT',
      '',
      '### I. Legal Standard',
      '',
      'Under [relevant rule, e.g., FRCP 37], a party may move to compel discovery responses when:',
      '- The responding party fails to answer or object to discovery requests',
      '- The responses are evasive or incomplete',
      '',
      '### II. Application',
      '',
      '[Specific discovery requests and responses at issue]',
      '',
      '## CONCLUSION',
      '',
      'For the foregoing reasons, [Plaintiff/Defendant] respectfully requests that this Court:',
      '1. Grant this Motion to Compel',
      '2. Order [opposing party] to respond to discovery requests within [number] days',
      '3. Award [Plaintiff/Defendant] attorney\'s fees and costs',
      '',
      'Respectfully submitted,',
      '',
      '_________________________',
      '[Attorney/Pro Se Party Name]',
      '[Date]'
    ].join('\n');
  }

  getBriefTemplate() {
    return [
      '# BRIEF OF [PETITIONER/RESPONDENT]',
      '',
      '## TO THE [APPELLATE COURT]',
      '',
      '[Petitioner/Respondent Name], [Petitioner/Respondent],',
      'v.',
      '[Respondent/Petitioner Name], [Respondent/Petitioner].',
      '',
      'No. [Case Number]',
      '',
      '## BRIEF OF [PETITIONER/RESPONDENT]',
      '',
      '### I. STATEMENT OF THE CASE',
      '',
      '[Overview of the case and procedural history]',
      '',
      '### II. STATEMENT OF FACTS',
      '',
      '[Relevant facts from the lower court proceedings]',
      '',
      '### III. ARGUMENT',
      '',
      '#### A. Standard of Review',
      '',
      '[Applicable standard of review for each issue]',
      '',
      '#### B. Arguments',
      '',
      '[Legal arguments with citations to authority]',
      '',
      '### IV. CONCLUSION',
      '',
      '[Summary of requested relief]',
      '',
      'Respectfully submitted,',
      '',
      '_________________________',
      '[Attorney Name]',
      '[Date]'
    ].join('\n');
  }

  getTimelineTemplate() {
    return [
      '# CASE TIMELINE',
      '',
      '## [Case Name]',
      '',
      '**Case Number:** [Case Number]',
      '**Court:** [Court Name]',
      '**Prepared by:** [Name]',
      '**Date:** [Date]',
      '',
      '## CHRONOLOGICAL EVENTS',
      '',
      '| Date | Event | Description |',
      '|------|-------|-------------|',
      '| [Date] | [Event Type] | [Description] |',
      '| [Date] | [Event Type] | [Description] |',
      '| [Date] | [Event Type] | [Description] |',
      '',
      '## KEY DOCUMENTS',
      '',
      '- [Document 1] - [Date]',
      '- [Document 2] - [Date]',
      '- [Document 3] - [Date]',
      '',
      '## WITNESSES',
      '',
      '| Name | Role | Contact |',
      '|------|------|---------|',
      '| [Name] | [Role] | [Contact] |',
      '| [Name] | [Role] | [Contact] |',
      '',
      '## NOTES',
      '',
      '[Additional notes or observations]'
    ].join('\n');
  }

  getEvidenceLogTemplate() {
    return [
      '# EVIDENCE LOG',
      '',
      '## [Case Name]',
      '',
      '**Case Number:** [Case Number]',
      '**Prepared by:** [Name]',
      '**Date:** [Date]',
      '',
      '## EVIDENCE ITEMS',
      '',
      '| ID | Description | Type | Date Obtained | Location | Notes |',
      '|----|-------------|------|---------------|----------|-------|',
      '| E-001 | [Description] | [Type] | [Date] | [Location] | [Notes] |',
      '| E-002 | [Description] | [Type] | [Date] | [Location] | [Notes] |',
      '| E-003 | [Description] | [Type] | [Date] | [Location] | [Notes] |',
      '',
      '## EVIDENCE CHAIN OF CUSTODY',
      '',
      '| Date | From | To | Purpose |',
      '|------|------|----|---------|',
      '| [Date] | [Person] | [Person] | [Purpose] |',
      '| [Date] | [Person] | [Person] | [Purpose] |',
      '',
      '## NOTES',
      '',
      '[Additional notes about evidence handling or analysis]'
    ].join('\n');
  }

  renderTemplates() {
    const templateContainer = document.getElementById('template-container');
    if (!templateContainer) return;

    templateContainer.innerHTML = this.templates.map(template => {
      const preview = template.content.substring(0, 200).replace(/</g, '&lt;').replace(/>/g, '&gt;') + '...';
      return '<div class="template-card">' +
        '<h4>' + template.name + '</h4>' +
        '<p>' + template.description + '</p>' +
        '<div class="template-preview"><pre>' + preview + '</pre></div>' +
        '<button class="btn btn-primary" onclick="useTemplate(\'' + template.id + '\')">Use Template</button>' +
      '</div>';
    }).join('');
  }
}

// Global function to use a template
function useTemplate(templateId) {
  const templateManager = new TemplateManager();
  const template = templateManager.templates.find(function(t) { return t.id === templateId; });
  
  if (template) {
    // Save template to localStorage for editing
    localStorage.setItem('freelawgen_current_template', JSON.stringify(template));
    
    // Redirect to converter with template loaded
    window.location.href = '/converter/?template=' + templateId;
  }
}

// Initialize applications when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Document Converter
  new DocumentConverter();
  
  // Initialize LLM Integration
  new LLMIntegration();
  
  // Initialize Evidence Locker
  new EvidenceLocker();
  
  // Initialize Template Manager
  new TemplateManager();
  
  // Check for template parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const templateParam = urlParams.get('template');
  if (templateParam) {
    useTemplate(templateParam);
  }
});

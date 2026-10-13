#!/usr/bin/env node
/**
 * FreeLawGen MCP Server — Serves case documents via Model Context Protocol
 * 
 * Provides tools for:
 * - Reading case documents (Markdown files from the evidence locker)
 * - Searching document content
 * - Listing available documents and cases
 * - Reading YAML frontmatter metadata
 * 
 * Usage: node server.js
 * 
 * MCP transports: Stdio (default), HTTP SSE, or WebSocket
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

// Configuration
const BASE_DIR = path.resolve(__dirname, "..");
const CASE_REPO = path.resolve(__dirname, "..", "..", "McColloughVsPSU_");
const EVIDENCE_LOCKER = path.resolve(__dirname, "..");

// YAML frontmatter parser (simple, no dependencies)
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) return { metadata: {}, content };
    
    const yaml = match[1];
    const body = match[2];
    const metadata = {};
    
    // Parse simple key: value pairs
    const lines = yaml.split('\n');
    let currentKey = null;
    let currentValue = [];
    
    for (const line of lines) {
        const keyMatch = line.match(/^(\w+):\s*(.*)$/);
        if (keyMatch) {
            // Save previous key
            if (currentKey) {
                metadata[currentKey] = currentValue.length === 1 ? currentValue[0] : currentValue;
            }
            currentKey = keyMatch[1];
            let value = keyMatch[2].trim();
            // Remove quotes
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            currentValue = [value];
        } else if (line.trim().startsWith('- ')) {
            // Array item
            currentValue.push(line.trim().substring(2).trim());
        } else if (line.trim()) {
            // Continuation
            currentValue.push(line.trim());
        }
    }
    
    // Save last key
    if (currentKey) {
        metadata[currentKey] = currentValue.length === 1 ? currentValue[0] : currentValue;
    }
    
    return { metadata, content: body };
}

// Get all Markdown files in a directory
function getMarkdownFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
            // Skip node_modules, .git, etc.
            if (['node_modules', '.git', '__pycache__', '.next'].includes(entry.name)) {
                continue;
            }
            files.push(...getMarkdownFiles(fullPath));
        } else if (entry.name.endsWith('.md') || entry.name.endsWith('.MD')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

// Create MCP server
const server = new McpServer({
    name: "FreeLawGen",
    version: "1.0.0",
});

// Register tools

// 1. List available documents
server.tool(
    "list_documents",
    "List all available Markdown documents in the evidence locker and case repository",
    {
        repo: z.enum(["evidence-locker", "case-repo", "all"]).default("all"),
    },
    async ({ repo }) => {
        const documents = [];
        
        if (repo === "evidence-locker" || repo === "all") {
            const files = getMarkdownFiles(EVIDENCE_LOCKER);
            for (const file of files) {
                const content = fs.readFileSync(file, "utf-8");
                const { metadata } = parseFrontmatter(content);
                documents.push({
                    path: path.relative(BASE_DIR, file),
                    title: metadata.title || path.basename(file, ".md"),
                    type: metadata.type || "unknown",
                    description: metadata.intro || "",
                    repo: "evidence-locker",
                });
            }
        }
        
        if (repo === "case-repo" || repo === "all") {
            const files = getMarkdownFiles(CASE_REPO);
            for (const file of files) {
                const content = fs.readFileSync(file, "utf-8");
                const { metadata } = parseFrontmatter(content);
                documents.push({
                    path: path.relative(CASE_REPO, file),
                    title: metadata.title || path.basename(file, ".md"),
                    type: metadata.type || "unknown",
                    description: metadata.intro || "",
                    repo: "case-repo",
                });
            }
        }
        
        return {
            content: [{
                type: "text",
                text: JSON.stringify(documents, null, 2),
            }],
        };
    }
);

// 2. Read document content
server.tool(
    "read_document",
    "Read the full content of a Markdown document, including YAML frontmatter metadata",
    {
        path: z.string().describe("File path relative to the repo root (e.g., 'index.md' or 'Appeal/OpeningBrief.md')"),
        repo: z.enum(["evidence-locker", "case-repo"]).default("evidence-locker"),
    },
    async ({ path: filePath, repo }) => {
        let basePath;
        if (repo === "case-repo") {
            basePath = CASE_REPO;
        } else {
            basePath = EVIDENCE_LOCKER;
        }
        
        const fullPath = path.join(basePath, filePath);
        
        if (!fs.existsSync(fullPath)) {
            return {
                content: [{
                    type: "text",
                    text: `Error: File not found: ${fullPath}`,
                }],
            };
        }
        
        const content = fs.readFileSync(fullPath, "utf-8");
        const { metadata, content: body } = parseFrontmatter(content);
        
        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    path: filePath,
                    metadata: metadata,
                    content: body,
                }, null, 2),
            }],
        };
    }
);

// 3. Search document content
server.tool(
    "search_documents",
    "Search for text within all Markdown documents in the specified repository",
    {
        query: z.string().describe("Search query (case-insensitive, supports simple word matching)"),
        repo: z.enum(["evidence-locker", "case-repo", "all"]).default("all"),
        maxResults: z.number().default(20),
    },
    async ({ query, repo, maxResults }) => {
        const results = [];
        const searchTerms = query.toLowerCase().split(/\s+/);
        
        const repos = [];
        if (repo === "evidence-locker" || repo === "all") repos.push(EVIDENCE_LOCKER);
        if (repo === "case-repo" || repo === "all") repos.push(CASE_REPO);
        
        for (const baseDir of repos) {
            const files = getMarkdownFiles(baseDir);
            
            for (const file of files) {
                const content = fs.readFileSync(file, "utf-8").toLowerCase();
                const matches = searchTerms.every(term => content.includes(term));
                
                if (matches) {
                    const { metadata } = parseFrontmatter(content);
                    // Find the line and context
                    const lines = fs.readFileSync(file, "utf-8").split('\n');
                    const contextLines = [];
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].toLowerCase().includes(query.toLowerCase())) {
                            const start = Math.max(0, i - 2);
                            const end = Math.min(lines.length, i + 3);
                            for (let j = start; j < end; j++) {
                                contextLines.push(`${j + 1}: ${lines[j]}`);
                            }
                            contextLines.push("---");
                        }
                    }
                    
                    results.push({
                        file: path.relative(baseDir, file),
                        repo: repo === "all" ? (baseDir === EVIDENCE_LOCKER ? "evidence-locker" : "case-repo") : repo,
                        title: metadata.title || path.basename(file, ".md"),
                        context: contextLines.join('\n'),
                    });
                    
                    if (results.length >= maxResults) break;
                }
            }
            
            if (results.length >= maxResults) break;
        }
        
        return {
            content: [{
                type: "text",
                text: JSON.stringify(results, null, 2),
            }],
        };
    }
);

// 4. Get case information
server.tool(
    "get_case_info",
    "Get information about a specific legal case, including status, documents, and timeline",
    {
        caseName: z.string().describe("Case name or identifier (e.g., 'McCollough v. Portland State University')"),
    },
    async ({ caseName }) => {
        // Search for case-related files
        const caseFiles = [];
        const caseLower = caseName.toLowerCase();
        
        // Search in case repo
        const files = getMarkdownFiles(CASE_REPO);
        for (const file of files) {
            const content = fs.readFileSync(file, "utf-8").toLowerCase();
            if (content.includes(caseLower) || 
                path.basename(file, '.md').toLowerCase().includes(caseLower.split(' ')[0])) {
                caseFiles.push({
                    path: path.relative(CASE_REPO, file),
                    repo: "case-repo",
                });
            }
        }
        
        // Search in evidence locker
        const lockerFiles = getMarkdownFiles(EVIDENCE_LOCKER);
        for (const file of lockerFiles) {
            const content = fs.readFileSync(file, "utf-8").toLowerCase();
            if (content.includes(caseLower)) {
                caseFiles.push({
                    path: path.relative(EVIDENCE_LOCKER, file),
                    repo: "evidence-locker",
                });
            }
        }
        
        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    case: caseName,
                    relatedFiles: caseFiles,
                    message: `Found ${caseFiles.length} files related to "${caseName}"`,
                }, null, 2),
            }],
        };
    }
);

// 5. List cases
server.tool(
    "list_cases",
    "List all legal cases tracked in the system with their status and summary",
    {},
    async () => {
        const cases = [];
        
        // Parse case information from evidence locker
        const evidenceLockerFiles = getMarkdownFiles(EVIDENCE_LOCKER);
        for (const file of evidenceLockerFiles) {
            const content = fs.readFileSync(file, "utf-8");
            const { metadata } = parseFrontmatter(content);
            
            if (metadata.type === "case" || metadata.product === "FreeLawGen") {
                cases.push({
                    name: metadata.title || path.basename(file, ".md"),
                    status: metadata.intro || "Unknown",
                    type: metadata.type || "unknown",
                    document: path.relative(EVIDENCE_LOCKER, file),
                });
            }
        }
        
        // Try to extract case info from case repo structure
        if (fs.existsSync(CASE_REPO)) {
            const structure = fs.readdirSync(CASE_REPO, { withFileTypes: true });
            const caseDirs = structure.filter(d => d.isDirectory() && !d.name.startsWith('.')).map(d => d.name);
            
            cases.push({
                name: "McCollough v. Portland State University",
                status: "Appeal",
                type: "federal-litigation",
                directory: "McColloughVsPSU_",
                description: "First Amendment retaliation claim under 42 U.S.C. § 1983",
            });
        }
        
        return {
            content: [{
                type: "text",
                text: JSON.stringify(cases, null, 2),
            }],
        };
    }
);

// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("FreeLawGen MCP Server running on stdio");
    console.error("Available tools:");
    console.error("  - list_documents: List all available documents");
    console.error("  - read_document: Read a specific document");
    console.error("  - search_documents: Search document content");
    console.error("  - get_case_info: Get case information");
    console.error("  - list_cases: List all tracked cases");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});

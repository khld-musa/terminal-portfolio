export interface TerminalLine {
  id: string;
  type: "input" | "output" | "system";
  content: string;
  timestamp: number;
  prompt?: string;
}

export interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => CommandResult;
  hidden?: boolean;
}

export interface CommandResult {
  output: string[];
  error?: boolean;
  clear?: boolean;
  exit?: boolean;
}

export interface TerminalState {
  lines: TerminalLine[];
  currentInput: string;
  commandHistory: string[];
  historyIndex: number;
  isBooting: boolean;
  currentDirectory: string;
  username: string;
  hostname: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  projects: Project[];
  contact: ContactInfo;
  resume: ResumeInfo;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  details: string;
}

export interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
  phone?: string;
  location: string;
}

export interface ResumeInfo {
  summary: string;
  downloadUrl: string;
  lastUpdated: string;
}

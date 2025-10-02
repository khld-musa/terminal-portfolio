import type { Command, CommandResult } from "../types/terminal";
import { portfolioData } from "../data/portfolio";

export class CommandProcessor {
  private commands: Map<string, Command> = new Map();

  constructor() {
    this.initializeCommands();
  }

  private initializeCommands() {
    // Basic commands
    this.addCommand({
      name: "help",
      description: "Show available commands",
      execute: () => this.helpCommand(),
    });

    this.addCommand({
      name: "--help",
      description: "Show available commands",
      execute: () => this.helpCommand(),
    });

    this.addCommand({
      name: "about",
      description: "Display information about Khalid",
      execute: () => this.aboutCommand(),
    });

    this.addCommand({
      name: "projects",
      description: "List all projects",
      execute: (args) => this.projectsCommand(args),
    });

    this.addCommand({
      name: "contact",
      description: "Show contact information",
      execute: () => this.contactCommand(),
    });

    this.addCommand({
      name: "resume",
      description: "Display resume information",
      execute: () => this.resumeCommand(),
    });

    this.addCommand({
      name: "clear",
      description: "Clear the terminal screen",
      execute: () => ({ output: [], clear: true }),
    });

    this.addCommand({
      name: "exit",
      description: "Exit the terminal",
      execute: () => this.exitCommand(),
    });

    // Fun commands
    this.addCommand({
      name: "sudo",
      description: "Execute commands as superuser (just for fun)",
      execute: (args) => this.sudoCommand(args),
    });

    this.addCommand({
      name: "ls",
      description: "List directory contents",
      execute: (args) => this.lsCommand(args),
    });

    this.addCommand({
      name: "cat",
      description: "Display file contents",
      execute: (args) => this.catCommand(args),
    });

    this.addCommand({
      name: "fortune",
      description: "Display a random quote or fun fact",
      execute: () => this.fortuneCommand(),
    });

    this.addCommand({
      name: "neofetch",
      description: "Display system information",
      execute: () => this.neofetchCommand(),
    });

    this.addCommand({
      name: "theme",
      description:
        "Change terminal theme (ubuntu, dracula, nord, kali, monokai, solarized)",
      execute: (args) => this.themeCommand(args),
    });

    this.addCommand({
      name: "gui",
      description: "Switch to GUI mode (hidden)",
      execute: () => this.guiCommand(),
      hidden: true,
    });
  }

  private addCommand(command: Command) {
    this.commands.set(command.name, command);
  }

  public executeCommand(input: string): CommandResult {
    const trimmed = input.trim();
    if (!trimmed) {
      return { output: [] };
    }

    const parts = trimmed.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const command = this.commands.get(commandName);
    if (command) {
      try {
        return command.execute(args);
      } catch (error) {
        return {
          output: [
            `Error executing command: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          ],
          error: true,
        };
      }
    } else {
      return {
        output: [
          `command not found: ${commandName}`,
          `Type 'help' to see available commands.`,
        ],
        error: true,
      };
    }
  }

  public getCommands(): Command[] {
    return Array.from(this.commands.values()).filter((cmd) => !cmd.hidden);
  }

  public getCommandSuggestions(input: string): string[] {
    const commands = Array.from(this.commands.keys());
    return commands
      .filter((cmd) => cmd.startsWith(input.toLowerCase()))
      .slice(0, 5);
  }

  // Command implementations
  private helpCommand(): CommandResult {
    const commands = this.getCommands();
    const output = [
      "Available commands:",
      "",
      ...commands.map((cmd) => `  ${cmd.name.padEnd(12)} - ${cmd.description}`),
      "",
      "Navigation tips:",
      "  • Use TAB for autocompletion",
      "  • Use ↑/↓ arrows for command history",
      "  • Type a command followed by --help for more info",
    ];
    return { output };
  }

  private aboutCommand(): CommandResult {
    const { name, title, bio, skills } = portfolioData;
    const output = [
      `╭─────────────────────────────────────────────╮`,
      `│                   ${name}                     │`,
      `│               ${title}            │`,
      `╰─────────────────────────────────────────────╯`,
      "",
      bio,
      "",
      "Skills & Technologies:",
      ...skills.map((skill) => `  • ${skill}`),
      "",
      "Want to know more? Try these commands:",
      "  projects  - View my work",
      "  contact   - Get in touch",
      "  resume    - See my experience",
    ];
    return { output };
  }

  private projectsCommand(args: string[]): CommandResult {
    const { projects } = portfolioData;

    if (args.length === 0) {
      const output = [
        "Projects Portfolio:",
        "",
        ...projects
          .map((project, index) => [
            `${index + 1}. ${project.name}`,
            `   ${project.description}`,
            `   Tech: ${project.technologies.join(", ")}`,
            `   Commands: cat project${index + 1}.txt`,
            "",
          ])
          .flat(),
        'Use "cat project<number>.txt" for detailed information.',
      ];
      return { output };
    }

    return { output: ["Usage: projects"] };
  }

  private contactCommand(): CommandResult {
    const { contact, name } = portfolioData;
    const output = [
      `Contact Information for ${name}:`,
      "",
      `📧 Email:    ${contact.email}`,
      `💼 LinkedIn: ${contact.linkedin}`,
      `🐙 GitHub:   ${contact.github}`,
      `📱 Phone:    ${contact.phone || "Available upon request"}`,
      `📍 Location: ${contact.location}`,
      "",
      "Feel free to reach out! I'm always open to new opportunities",
      "and interesting conversations about technology.",
    ];
    return { output };
  }

  private resumeCommand(): CommandResult {
    const { resume, name } = portfolioData;
    const output = [
      `${name}'s Resume Summary:`,
      "",
      resume.summary,
      "",
      `Last Updated: ${resume.lastUpdated}`,
      `Download: ${resume.downloadUrl}`,
      "",
      "For detailed experience, skills, and education,",
      "please download the full resume using the link above.",
    ];
    return { output };
  }

  private sudoCommand(args: string[]): CommandResult {
    const responses = [
      "Nice try! 😄 This is a portfolio, not a real terminal.",
      "sudo: permission denied. You're not in the sudoers file.",
      "With great power comes great responsibility... but not here!",
      "sudo make me a sandwich? How about we just talk about my projects instead!",
      "Access denied! But you can access my GitHub without sudo.",
    ];
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    if (args.length > 0) {
      return {
        output: [
          randomResponse,
          "",
          `Attempted command: sudo ${args.join(" ")}`,
          "Try running the command without sudo, or check out my actual projects!",
        ],
      };
    }

    return { output: [randomResponse] };
  }

  private lsCommand(args: string[]): CommandResult {
    const directories = [
      "drwxr-xr-x  2 khalid khalid 4096 Oct  1 12:00 projects/",
      "drwxr-xr-x  2 khalid khalid 4096 Oct  1 12:00 skills/",
      "drwxr-xr-x  2 khalid khalid 4096 Oct  1 12:00 contact/",
      "-rw-r--r--  1 khalid khalid 2048 Oct  1 12:00 about.txt",
      "-rw-r--r--  1 khalid khalid 1024 Oct  1 12:00 resume.pdf",
      "-rw-r--r--  1 khalid khalid  512 Oct  1 12:00 README.md",
    ];

    if (args.includes("-la") || args.includes("-al")) {
      return {
        output: [
          "total 24",
          "drwxr-xr-x  5 khalid khalid 4096 Oct  1 12:00 .",
          "drwxr-xr-x  3 khalid khalid 4096 Oct  1 12:00 ..",
          "-rw-r--r--  1 khalid khalid  220 Oct  1 12:00 .bash_logout",
          "-rw-r--r--  1 khalid khalid 3771 Oct  1 12:00 .bashrc",
          "-rw-r--r--  1 khalid khalid  807 Oct  1 12:00 .profile",
          ...directories,
        ],
      };
    }

    return {
      output: [
        "projects/  skills/  contact/  about.txt  resume.pdf  README.md",
        "",
        'Use "ls -la" for detailed view or try these commands:',
        "  cat about.txt    - Learn about me",
        '  cd projects/     - View my projects (just kidding, use "projects")',
        "  cat resume.pdf   - View resume info",
      ],
    };
  }

  private catCommand(args: string[]): CommandResult {
    if (args.length === 0) {
      return {
        output: ["cat: missing file operand", "Try: cat <filename>"],
        error: true,
      };
    }

    const filename = args[0].toLowerCase();
    const { projects } = portfolioData;

    // Handle project files
    const projectMatch = filename.match(/project(\d+)\.txt/);
    if (projectMatch) {
      const projectIndex = parseInt(projectMatch[1]) - 1;
      const project = projects[projectIndex];

      if (project) {
        const output = [
          `╭─ ${project.name} ─────────────────────────────╮`,
          `│ ${project.description.padEnd(45)} │`,
          `╰─────────────────────────────────────────────────╯`,
          "",
          project.details,
          "",
          "Technologies Used:",
          ...project.technologies.map((tech) => `  • ${tech}`),
          "",
          "Links:",
        ];

        if (project.githubUrl) output.push(`  🐙 GitHub: ${project.githubUrl}`);
        if (project.liveUrl) output.push(`  🌐 Live Demo: ${project.liveUrl}`);

        return { output };
      } else {
        return {
          output: [
            `cat: project${projectMatch[1]}.txt: No such file or directory`,
          ],
          error: true,
        };
      }
    }

    // Handle other files
    switch (filename) {
      case "about.txt":
        return this.aboutCommand();
      case "resume.pdf":
        return this.resumeCommand();
      case "readme.md":
        return {
          output: [
            "# Khalid's Terminal Portfolio",
            "",
            "Welcome to my interactive terminal portfolio!",
            "",
            "## Available Commands",
            "- `help` - Show all available commands",
            "- `about` - Learn about me",
            "- `projects` - View my projects",
            "- `contact` - Get my contact info",
            "- `resume` - View resume summary",
            "",
            "## Fun Commands",
            "- `neofetch` - System info with style",
            "- `fortune` - Random quotes and facts",
            "- `ls` - List directory contents",
            "",
            "Enjoy exploring! 🚀",
          ],
        };
      default:
        return {
          output: [`cat: ${filename}: No such file or directory`],
          error: true,
        };
    }
  }

  private fortuneCommand(): CommandResult {
    const fortunes = [
      '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
      '"First, solve the problem. Then, write the code." - John Johnson',
      '"Experience is the name everyone gives to their mistakes." - Oscar Wilde',
      "\"Programming isn't about what you know; it's about what you can figure out.\" - Chris Pine",
      '"The best error message is the one that never shows up." - Thomas Fuchs',
      "Fun fact: I can debug code faster than I can explain why it works! 🐛",
      "Coffee + Code = ❤️ (The universal developer equation)",
      "I speak fluent JavaScript, but I'm still learning human. 😄",
      "My code doesn't always work, but when it does, I have no idea why.",
      "Debugging: Being the detective in a crime movie where you're also the murderer. 🕵️",
    ];

    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    return { output: [randomFortune] };
  }

  private neofetchCommand(): CommandResult {
    const { name, skills } = portfolioData;
    const output = [
      "                    ",
      "       ██████       ╭─────────────────────────────╮",
      "     ██████████     │ OS: KhalidOS 2.0.1          │",
      "   ██████████████   │ Host: Portfolio Terminal     │",
      "  ████████████████  │ Kernel: JavaScript Engine   │",
      " ██████████████████ │ Uptime: 5+ years coding     │",
      " ██████████████████ │ Shell: Developer Shell      │",
      " ██████████████████ │ Resolution: Problem Solver  │",
      " ██████████████████ │ DE: VS Code / IntelliJ      │",
      " ██████████████████ │ WM: Chrome DevTools         │",
      "  ████████████████  │ Theme: Dark Mode Always     │",
      "   ██████████████   │ CPU: Coffee Powered         │",
      "     ██████████     │ Memory: Full of Ideas       │",
      "       ██████       │ GPU: Creative Mind          │",
      "                    ╰─────────────────────────────╯",
      "",
      `${name}@portfolio ~ $ echo "Top Skills:"`,
      ...skills.slice(0, 6).map((skill) => `  ● ${skill}`),
      "",
      'Run "about" for more information!',
    ];
    return { output };
  }

  private exitCommand(): CommandResult {
    return {
      output: [
        "Thanks for visiting my portfolio! 👋",
        "",
        "Before you go:",
        "  • Check out my projects on GitHub",
        "  • Connect with me on LinkedIn",
        "  • Feel free to reach out anytime",
        "",
        "logout",
        "",
        "Connection to khalid-portfolio closed.",
      ],
      exit: true,
    };
  }

  private guiCommand(): CommandResult {
    return {
      output: [
        "GUI mode is not implemented yet! 😅",
        "",
        "But honestly, isn't this terminal interface cooler?",
        "You can find everything you need right here:",
        "",
        "  • about    - Learn about me",
        "  • projects - See my work",
        "  • contact  - Get in touch",
        "",
        "Stay in the matrix! 😎",
      ],
    };
  }

  private themeCommand(args: string[]): CommandResult {
    const availableThemes = [
      "ubuntu",
      "dracula",
      "nord",
      "kali",
      "monokai",
      "solarized",
    ];

    if (args.length === 0) {
      return {
        output: [
          "Available themes:",
          "",
          ...availableThemes.map((theme) => `  • ${theme}`),
          "",
          "Usage: theme <name>",
          "Example: theme dracula",
        ],
      };
    }

    const requestedTheme = args[0].toLowerCase();

    if (!availableThemes.includes(requestedTheme)) {
      return {
        output: [
          `Error: Theme '${requestedTheme}' not found.`,
          "",
          "Available themes:",
          ...availableThemes.map((theme) => `  • ${theme}`),
        ],
      };
    }

    // Dispatch event to change theme
    if (typeof window !== "undefined") {
      window.localStorage.setItem("terminal-theme", requestedTheme);
      window.location.reload();
    }

    return {
      output: [
        `Switching to '${requestedTheme}' theme...`,
        "Reloading terminal...",
      ],
    };
  }
}

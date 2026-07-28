// Subset of GitHub's linguist language colors, used for language dots/bars.
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  Dart: "#00B4AB",
  Scala: "#c22d40",
  Elixir: "#6e4a7e",
  Lua: "#000080",
  Haskell: "#5e5086",
  Zig: "#ec915c",
  Dockerfile: "#384d54",
  MDX: "#fcb32c",
};

export function languageColor(language: string | null | undefined): string {
  if (!language) return "#8b949e";
  return LANGUAGE_COLORS[language] ?? "#8b949e";
}

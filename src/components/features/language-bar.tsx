import type { GithubLanguages } from "@/lib/github/schemas";
import { languageColor } from "@/lib/language-colors";

export function LanguageBar({ languages }: { languages: GithubLanguages }) {
  const entries = Object.entries(languages).sort(([, a], [, b]) => b - a);
  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);

  if (total === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No language data available.
      </p>
    );
  }

  return (
    <div>
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        {entries.map(([language, bytes]) => (
          <span
            key={language}
            style={{
              width: `${(bytes / total) * 100}%`,
              backgroundColor: languageColor(language),
            }}
            title={language}
          />
        ))}
      </div>
      <ul className="text-muted-foreground mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
        {entries.map(([language, bytes]) => (
          <li key={language} className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: languageColor(language) }}
            />
            {language}
            <span className="text-muted-foreground/70">
              {((bytes / total) * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

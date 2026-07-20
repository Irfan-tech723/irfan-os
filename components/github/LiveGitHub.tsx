"use client";

import { useGithubData } from "@/hooks/useGithubData";

const USERNAME = "Irfan-tech723";

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3f7fff",
  JavaScript: "#ffb020",
  TypeScript: "#3f7fff",
  HTML: "#5a5a5a",
  CSS: "#5a5a5a",
};

export default function LiveGitHub() {
  const { profile, repos, loading, error } = useGithubData(USERNAME);

  return (
    <div>
      <div
        className="font-mono text-[11px] text-titanium uppercase mb-3.5"
        style={{ letterSpacing: "0.14em" }}
      >
        Live GitHub
      </div>

      {loading && (
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 w-full max-w-[180px] bg-charcoal border border-gunmetal rounded-sm animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="font-mono text-[11.5px] text-titanium">
          {error} — see{" "}
          <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-blue">
            github.com/{USERNAME}
          </a>{" "}
          directly.
        </div>
      )}

      {!loading && !error && (
        <>
          {profile && (
            <div className="flex gap-6 font-mono text-[11px] text-titanium mb-4">
              <span>PUBLIC REPOS: <span className="text-amber">{profile.public_repos}</span></span>
              <span>FOLLOWERS: <span className="text-amber">{profile.followers}</span></span>
            </div>
          )}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="card block hover:border-blue"
              >
                <div className="font-display text-[13px] font-semibold text-offwhite truncate">
                  {repo.name}
                </div>
                <div className="text-titanium text-[11px] leading-relaxed mt-1 line-clamp-2 h-[28px]">
                  {repo.description || "No description provided."}
                </div>
                <div className="flex items-center gap-3 mt-3 font-mono text-[10px] text-titanium">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: LANGUAGE_COLORS[repo.language] || "#5a5a5a" }}
                      />
                      {repo.language}
                    </span>
                  )}
                  <span>★ {repo.stargazers_count}</span>
                </div>
              </a>
            ))}
          </div>
          <div className="font-mono text-[10px] text-titanium mt-3">
            Live from the public GitHub API — contribution calendar isn&apos;t
            shown here since it needs authenticated GraphQL access.
          </div>
        </>
      )}
    </div>
  );
}

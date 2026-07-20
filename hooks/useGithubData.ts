"use client";

import { useEffect, useState } from "react";

export type GithubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
};

export type GithubProfile = {
  public_repos: number;
  followers: number;
  html_url: string;
};

type State = {
  profile: GithubProfile | null;
  repos: GithubRepo[];
  loading: boolean;
  error: string | null;
};

// Uses the public, unauthenticated GitHub REST API. This is genuinely live —
// no scraping, no key required — but it's subject to GitHub's anonymous rate
// limit (60 requests/hour per IP), and it does NOT include the contribution
// calendar: that data is only exposed via GitHub's authenticated GraphQL API,
// which needs a token this project can't safely ship client-side.
export function useGithubData(username: string) {
  const [state, setState] = useState<State>({
    profile: null,
    repos: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [profileRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`),
        ]);
        if (!profileRes.ok || !reposRes.ok) throw new Error("GitHub API request failed");
        const profile = await profileRes.json();
        const repos = await reposRes.json();
        if (!cancelled) {
          setState({ profile, repos, loading: false, error: null });
        }
      } catch {
        if (!cancelled) {
          setState((prev) => ({ ...prev, loading: false, error: "Couldn't reach the GitHub API right now." }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  return state;
}

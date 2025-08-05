export const GITHUB_CONFIG = {
  OWNER: process.env.GITHUB_OWNER || '',
  REPO: process.env.GITHUB_REPO || '',
  BRANCH: process.env.GITHUB_BRANCH || 'main',
};

export const getGitHubToken = (): string => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GitHub token not found. Please set GITHUB_TOKEN environment variable.');
  }
  return token;
};

export const isDevelopment = process.env.NODE_ENV === 'development';   
import { useState, useCallback } from 'react';
import { GitHubAPI, type DomainEntry } from '@/lib/github-api';
import { GITHUB_CONFIG, getGitHubToken } from '@/lib/config';

interface UseGitHubReturn {
  isLoading: boolean;
  error: string | null;
  addDomain: (domain: string) => Promise<boolean>;
  checkDomain: (domain: string) => Promise<boolean>;
  getAllDomains: () => Promise<DomainEntry[]>;
  validateToken: () => Promise<boolean>;
  clearError: () => void;
}

export const useGitHub = (): UseGitHubReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGitHubAPI = useCallback(() => {
    try {
      const token = getGitHubToken();
      return new GitHubAPI({
        token,
        owner: GITHUB_CONFIG.OWNER,
        repo: GITHUB_CONFIG.REPO,
        branch: GITHUB_CONFIG.BRANCH,
      });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to initialize GitHub API');
    }
  }, []);

  const addDomain = useCallback(async (domain: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const githubAPI = createGitHubAPI();
      
      // Validate token first
      const isValidToken = await githubAPI.validateToken();
      if (!isValidToken) {
        throw new Error('Invalid GitHub token. Please check your configuration.');
      }

      // Check if repository exists, create if it doesn't
      const repoExists = await githubAPI.checkRepository();
      if (!repoExists) {
        await githubAPI.createRepository();
      }

      
      await githubAPI.addDomain(domain);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add domain';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [createGitHubAPI]);

  const checkDomain = useCallback(async (domain: string): Promise<boolean> => {
    try {
      const githubAPI = createGitHubAPI();
      return await githubAPI.checkDomain(domain);
    } catch (err) {
      console.error('Error checking domain:', err);
      return false;
    }
  }, [createGitHubAPI]);

  const getAllDomains = useCallback(async (): Promise<DomainEntry[]> => {
    try {
      const githubAPI = createGitHubAPI();
      return await githubAPI.getAllDomains();
    } catch (err) {
      console.error('Error getting domains:', err);
      return [];
    }
  }, [createGitHubAPI]);

  const validateToken = useCallback(async (): Promise<boolean> => {
    try {
      const githubAPI = createGitHubAPI();
      return await githubAPI.validateToken();
    } catch (err) {
      console.error('Error validating token:', err);
      return false;
    }
  }, [createGitHubAPI]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    addDomain,
    checkDomain,
    getAllDomains,
    validateToken,
    clearError,
  };
}; 
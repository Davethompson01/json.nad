interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch?: string;
}

interface DomainEntry {
  domain: string;
  timestamp: string;
  status: 'active' | 'pending' | 'inactive';
}

class GitHubAPI {
  private config: GitHubConfig;
  private baseURL = 'https://api.github.com';

  constructor(config: GitHubConfig) {
    this.config = {
      branch: 'main',
      ...config
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Authorization': `token ${this.config.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${error.message || 'Unknown error'}`);
    }

    return response.json();
  }

  // Check if repository exists
  async checkRepository(): Promise<boolean> {
    try {
      await this.request(`/repos/${this.config.owner}/${this.config.repo}`);
      return true;
        } catch (error) {   
      return false;
    }
  }

  
  async createRepository(): Promise<void> {
    await this.request(`/user/repos`, {
      method: 'POST',
      body: JSON.stringify({
        name: this.config.repo,
        description: 'Domain registry for .nad domains',
        private: false, 
        auto_init: true,
      }),
    });
  }

 
  async getDomainsFile(): Promise<DomainEntry[]> {
    try {
      const response = await this.request(
        `/repos/${this.config.owner}/${this.config.repo}/contents/domains.json`
      );
      
      const content = atob(response.content);
      return JSON.parse(content);
    } catch (error) {
    
      return [];
    }
  }

  // Update the domains file
  async updateDomainsFile(domains: DomainEntry[]): Promise<void> {
    const content = JSON.stringify(domains, null, 2);
    const encodedContent = btoa(content);

    try {
      // Try to get the current file 
      const currentFile = await this.request(
        `/repos/${this.config.owner}/${this.config.repo}/contents/domains.json`
      );

      await this.request(
        `/repos/${this.config.owner}/${this.config.repo}/contents/domains.json`,
        {
          method: 'PUT',
          body: JSON.stringify({
            message: `Add domain: ${domains[domains.length - 1]?.domain || 'update'}`,
            content: encodedContent,
            sha: currentFile.sha,
            branch: this.config.branch,
          }),
        }
      );
    } catch (error) {
      // File doesn't exist, create it
      await this.request(
        `/repos/${this.config.owner}/${this.config.repo}/contents/domains.json`,
        {
          method: 'PUT',
          body: JSON.stringify({
            message: 'Initialize domains registry',
            content: encodedContent,
            branch: this.config.branch,
          }),
        }
      );
    }
  }

  // Add a new domain
  async addDomain(domain: string): Promise<void> {
    const domains = await this.getDomainsFile();
    
    // Check if domain already exists
    if (domains.some(d => d.domain === domain)) {
      throw new Error('Domain already registered');
    }

    const newEntry: DomainEntry = {
      domain,
      timestamp: new Date().toISOString(),
      status: 'active',
    };

    domains.push(newEntry);
    await this.updateDomainsFile(domains);
  }

  
  async checkDomain(domain: string): Promise<boolean> {
    const domains = await this.getDomainsFile();
    return domains.some(d => d.domain === domain);
  }

  
  async getAllDomains(): Promise<DomainEntry[]> {
    return await this.getDomainsFile();
  }

  
  async validateToken(): Promise<boolean> {
    try {
      await this.request('/user');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export { GitHubAPI, type GitHubConfig, type DomainEntry }; 
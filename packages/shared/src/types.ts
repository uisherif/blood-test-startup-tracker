export interface FundingRound {
  amount: number;
  type: string;
  date: string;
}

export interface PublicTrading {
  ticker: string;
  exchange: string;
}

export interface StartupMetrics {
  totalFunding: number | null;
  lastFundingRound: FundingRound | null;
  estimatedUsers: number | null;
  employeeCount: number | null;
  valuation: number | null;
  publicTrading?: PublicTrading;
}

export interface Startup {
  id: string;
  name: string;
  website: string;
  description: string;
  founded: number;
  headquarters?: string;
  logo?: string;
  metrics: StartupMetrics;
  founders?: string[];
  keyFeatures?: string[];
  lastUpdated: string;
}

export interface StartupUpdate {
  startupId: string;
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: string;
  source?: string;
}

export interface DashboardStats {
  totalStartups: number;
  totalFunding: number;
  totalUsers: number;
  averageValuation: number;
  lastUpdated: string;
}

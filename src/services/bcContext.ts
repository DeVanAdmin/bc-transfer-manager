import { Dynamics365BusinessCentralService } from '../generated';
import type { Company, Environment } from './types';

export interface BCContext {
  env: string;
  companyId: string;
  companyName: string;
}

const BC_API_DATASET = 'v2.0';
const ACTIVE_COMPANY_KEY = 'bctm.activeCompanyId';
const ACTIVE_ENV_KEY = 'bctm.activeEnvKey';
// Default environment when the user hasn't picked one. The connector returns
// several (e.g. a Sandbox and Production); the first isn't necessarily the one
// with your data + published extension.
const DEFAULT_ENV = ((import.meta.env.VITE_BC_ENVIRONMENT as string | undefined) ?? 'DeVanUnlimited').trim();

let environmentsPromise: Promise<Environment[]> | null = null;
let companiesPromise: Promise<Company[]> | null = null;

function loadStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function saveStored(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore storage failures */
  }
}

function removeStored(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore storage failures */
  }
}

let activeEnvKey: string | null = loadStored(ACTIVE_ENV_KEY);
let activeCompanyId: string | null = loadStored(ACTIVE_COMPANY_KEY);

export function getBCDataset(): string {
  return BC_API_DATASET;
}

/** Lists every BC environment the connection can reach (cached for the session). */
export function getEnvironments(): Promise<Environment[]> {
  if (!environmentsPromise) {
    environmentsPromise = (async () => {
      const res = await Dynamics365BusinessCentralService.GetEnvironmentsV3();
      if (!res.success) throw new Error(`GetEnvironmentsV3 failed: ${res.error?.message ?? 'unknown'}`);
      const envs = (res.data?.value ?? [])
        .map((e) => ({ key: e.UrlKey ?? e.Name ?? '', name: e.DisplayableKey || e.Name || e.UrlKey || '' }))
        .filter((e) => e.key.length > 0);
      if (envs.length === 0) throw new Error('No BC environment found.');
      return envs;
    })();
  }
  return environmentsPromise;
}

/** Resolves the active environment: explicit pick, else default, else first. */
export async function getActiveEnvironment(): Promise<Environment> {
  const envs = await getEnvironments();
  const byStored = activeEnvKey ? envs.find((e) => e.key === activeEnvKey) : undefined;
  const byDefault = DEFAULT_ENV ? envs.find((e) => e.key === DEFAULT_ENV || e.name === DEFAULT_ENV) : undefined;
  const chosen = byStored ?? byDefault ?? envs[0];
  activeEnvKey = chosen.key;
  return chosen;
}

/** Switches the environment; companies are per-environment so they reload. */
export function setActiveEnvironment(key: string): void {
  if (key === activeEnvKey) return;
  activeEnvKey = key;
  saveStored(ACTIVE_ENV_KEY, key);
  // Companies (and the active company) belong to the previous environment.
  companiesPromise = null;
  activeCompanyId = null;
  removeStored(ACTIVE_COMPANY_KEY);
}

/** Lists companies in the active environment (cached until the env changes). */
export function getCompanies(): Promise<Company[]> {
  if (!companiesPromise) {
    companiesPromise = (async () => {
      const envObj = await getActiveEnvironment();
      const coRes = await Dynamics365BusinessCentralService.GetCompaniesV3(envObj.key);
      if (!coRes.success) throw new Error(`GetCompaniesV3 failed: ${coRes.error?.message ?? 'unknown'}`);
      const companies = (coRes.data?.value ?? [])
        .map((c) => ({ id: c?.Id ?? '', name: c?.DisplayName || c?.Name || c?.Id || '' }))
        .filter((c) => c.id.length > 0);
      if (companies.length === 0) throw new Error('No BC company found.');
      return companies;
    })();
  }
  return companiesPromise;
}

export function getActiveCompanyId(): string | null {
  return activeCompanyId;
}

/** Sets the company every subsequent BC query is scoped to (persisted locally). */
export function setActiveCompany(companyId: string): void {
  activeCompanyId = companyId;
  saveStored(ACTIVE_COMPANY_KEY, companyId);
}

export async function getBCContext(): Promise<BCContext> {
  const envObj = await getActiveEnvironment();
  const companies = await getCompanies();
  // Honor the selected company; fall back to the first if none/stale.
  const active = companies.find((c) => c.id === activeCompanyId) ?? companies[0];
  activeCompanyId = active.id;
  return { env: envObj.key, companyId: active.id, companyName: active.name };
}

export function resetBCContext(): void {
  environmentsPromise = null;
  companiesPromise = null;
  activeEnvKey = null;
  activeCompanyId = null;
}

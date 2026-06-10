import { Dynamics365BusinessCentralService } from '../generated';

export interface BCContext {
  env: string;
  companyId: string;
  companyName: string;
}

const BC_API_DATASET = 'v2.0';

let contextPromise: Promise<BCContext> | null = null;

export function getBCDataset(): string {
  return BC_API_DATASET;
}

export function getBCContext(): Promise<BCContext> {
  if (!contextPromise) {
    contextPromise = (async () => {
      const envRes = await Dynamics365BusinessCentralService.GetEnvironmentsV3();
      if (!envRes.success) throw new Error(`GetEnvironmentsV3 failed: ${envRes.error?.message ?? 'unknown'}`);
      const env = envRes.data?.value?.[0]?.UrlKey ?? envRes.data?.value?.[0]?.Name;
      if (!env) throw new Error('No BC environment found.');

      const coRes = await Dynamics365BusinessCentralService.GetCompaniesV3(env);
      if (!coRes.success) throw new Error(`GetCompaniesV3 failed: ${coRes.error?.message ?? 'unknown'}`);
      const company = coRes.data?.value?.[0];
      const companyId = company?.Id;
      if (!companyId) throw new Error(`No BC company found in environment "${env}".`);

      return { env, companyId, companyName: company?.Name ?? '' };
    })();
  }
  return contextPromise;
}

export function resetBCContext(): void {
  contextPromise = null;
}

export interface SimulationRequest {
  initialPatrimony: number;
  initialDebt: number;
  income: number;
  expenses: number;
  returnRate: number;
  debtInterest: number;
  payment: number;
  months: number;
}

export interface SimulationResponse {
  patrimony: number[];
  debt: number[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedCollapseMonth: number | null;
  projectedGrowthPercent: number;
}

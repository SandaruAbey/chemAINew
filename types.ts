
export interface Product {
  name: string;
  SMILES: string;
  textStructure: string;
  SVG: string;
}

export interface SynthesisStep {
  step: number;
  reaction: string;
  reagentsAndConditions: string;
  intermediateProducts: Product[];
}

export interface SynthesisResult {
  pathway: SynthesisStep[];
  summary: string;
}

export interface SynthesisInput {
  startCompound: string;
  targetCompound: string;
  reagents: string;
}
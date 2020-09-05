export interface HashGenerate {
  generate: (value: string) => Promise<string>
}

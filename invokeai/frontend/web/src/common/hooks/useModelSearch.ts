type SearchField = 'name' | 'description' | 'model_tags';

type UseModelSearchParams<T> = {
  models: T[];
  query: string;
  disable?: SearchField[];
  limit?: number;
  sortByRelevance?: boolean;
};

export type SearchableModel = {
  name: string;
  key: string;
  description?: string;
  model_tags?: string[];
};

export function useModelSearch<T extends SearchableModel>({
  models,
  query,
  disable = [],
  limit,
  sortByRelevance = false,
}: UseModelSearchParams<T>): T[] {
  const q = query.toLowerCase();

  const score = (model: T): number => {
    let s = 0;
    if (!disable.includes('name') && model.name.toLowerCase().includes(q)) {
      s += 2;
    }
    if (!disable.includes('model_tags') && model.model_tags?.some((tag) => tag.toLowerCase().includes(q))) {
      s += 1;
    }
    if (!disable.includes('description') && model.description?.toLowerCase().includes(q)) {
      s += 1;
    }
    return s;
  };

  let results = models.map((model) => ({ model, score: score(model) })).filter(({ score }) => score > 0);

  if (sortByRelevance) {
    results.sort((a, b) => b.score - a.score);
  }

  if (limit !== undefined) {
    results = results.slice(0, limit);
  }

  return results.map((r) => r.model);
}

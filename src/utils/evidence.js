import { CATEGORIES } from '../data/evidenceCase';

export const EVIDENCE_ITEM_COUNT = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

/** The shape passed to progress.applyEvidenceItem for one category. */
export function categoryRef(category) {
  return {
    id: category.id,
    label: category.label,
    itemIds: category.items.map((item) => item.id),
  };
}

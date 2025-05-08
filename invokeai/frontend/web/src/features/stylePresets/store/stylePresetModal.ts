import { atom } from 'nanostores';
import type { PresetType } from 'services/api/endpoints/stylePresets';

const initialState: StylePresetModalState = {
  isModalOpen: false,
  updatingStylePresetId: null,
  prefilledFormData: null,
  isCreatingFromModel: false,
};

/**
 * Tracks the state for the style preset modal.
 */
export const $stylePresetModalState = atom<StylePresetModalState>(initialState);

type StylePresetModalState = {
  isModalOpen: boolean;
  updatingStylePresetId: string | null;
  prefilledFormData: PrefilledFormData | null;
  isCreatingFromModel?: boolean;
};

export type PrefilledFormData = {
  name: string;
  positivePrompt: string;
  negativePrompt: string;
  imageUrl: string | null;
  type: PresetType;
  model_key?: string;
  base_type?: string;
};

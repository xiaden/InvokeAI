// features/modelManagerV2/store/modelManagerStore.ts
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { AnyModelConfig, BaseModelType } from 'services/api/types';

export interface ModelManagerState {
  modelFamilies: string[];
  licenses: string[];
  creators: string[];
  nsfwRatings: string[];

  selectedFamily: string | null;
  selectedLicense: string | null;
  selectedNSFWRating: string | null;
  searchTerm: string;
  baseModelFilters: Record<BaseModelType, boolean>;
  showOnlyRelated: boolean;
}

const initialState: ModelManagerState = {
  modelFamilies: [],
  licenses: [],
  creators: [],
  nsfwRatings: [],

  selectedFamily: null,
  selectedLicense: null,
  selectedNSFWRating: null,
  searchTerm: '',
  baseModelFilters: {
      any: false,
      'sd-1': false,
      'sd-2': false,
      'sd-3': false,
      sdxl: false,
      'sdxl-refiner': false,
      flux: false,
      cogview4: false,
      imagen3: false,
      'chatgpt-4o': false
  },
  showOnlyRelated: false,
};

const normalize = (s: string | null | undefined) => (s ?? '').trim().toLowerCase();

export const modelManagerSlice = createSlice({
  name: 'modelManager',
  initialState,
  reducers: {
    hydrateFromModelConfigs(state, action: PayloadAction<AnyModelConfig[]>) {
      const families = new Set<string>();
      const licenses = new Set<string>();
      const creators = new Set<string>();
      const ratings = new Set<string>();
      const baseFilters: Record<BaseModelType, boolean> = {
          any: false,
          'sd-1': false,
          'sd-2': false,
          'sd-3': false,
          sdxl: false,
          'sdxl-refiner': false,
          flux: false,
          cogview4: false,
          imagen3: false,
          'chatgpt-4o': false
      };

      for (const config of action.payload) {
        families.add(normalize(config.model_family ?? config.base));
        if (config.license) {
          licenses.add(normalize(config.license));
        }
        if (config.creator_name) {
          creators.add(normalize(config.creator_name));
        }
        if (config.nsfw_rating) {
          ratings.add(normalize(config.nsfw_rating));
        }
        baseFilters[config.base] = baseFilters[config.base] ?? false;
      }

      state.modelFamilies = Array.from(families).sort();
      state.licenses = Array.from(licenses).sort();
      state.creators = Array.from(creators).sort();
      state.nsfwRatings = Array.from(ratings).sort();
      state.baseModelFilters = baseFilters;
    },
    setSelectedFamily(state, action: PayloadAction<string | null>) {
      state.selectedFamily = action.payload;
    },
    setSelectedLicense(state, action: PayloadAction<string | null>) {
      state.selectedLicense = action.payload;
    },
    setSelectedNSFWRating(state, action: PayloadAction<string | null>) {
      state.selectedNSFWRating = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    toggleBaseModel(state, action: PayloadAction<BaseModelType>) {
      state.baseModelFilters[action.payload] = !state.baseModelFilters[action.payload];
    },
    setShowOnlyRelated(state, action: PayloadAction<boolean>) {
      state.showOnlyRelated = action.payload;
    },
  },
});

export const {
  hydrateFromModelConfigs,
  setSelectedFamily,
  setSelectedLicense,
  setSelectedNSFWRating,
  setSearchTerm,
  toggleBaseModel,
  setShowOnlyRelated,
} = modelManagerSlice.actions;

export default modelManagerSlice.reducer;

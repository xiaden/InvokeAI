import type { ComboboxOnChange } from '@invoke-ai/ui-library';
import { Combobox, FormControl, FormLabel } from '@invoke-ai/ui-library';
import { useStore } from '@nanostores/react';
import { $stylePresetModalState } from 'features/stylePresets/store/stylePresetModal';
import { useCallback, useMemo } from 'react';
import { useController, type UseControllerProps } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { StylePresetFormData } from './StylePresetForm';

interface StylePresetTypeFieldProps extends UseControllerProps<StylePresetFormData, 'type'> {
  restrictToModelAndBase?: boolean;
}

export const StylePresetTypeField = (props: StylePresetTypeFieldProps) => {
  const { field } = useController(props);
  const { t } = useTranslation();
  const modalState = useStore($stylePresetModalState);

  const restrictToModelAndBase = modalState.isCreatingFromModel;

  const OPTIONS = useMemo(
    () => [
      { label: t('stylePresets.private'), value: 'user' },
      { label: t('stylePresets.shared'), value: 'project' },
    ],
    [t]
  );

  const MAINBASE = useMemo(
    () => [
      { label: t('stylePresets.main'), value: 'model' },
      { label: t('stylePresets.base'), value: 'base' },
    ],
    [t]
  );

  const SELECTEDOPTS = restrictToModelAndBase ? MAINBASE : OPTIONS;

  const onChange = useCallback<ComboboxOnChange>(
    (v) => {
      if (v) {
        field.onChange(v.value);
      }
    },
    [field]
  );

  const value = useMemo(() => {
    return SELECTEDOPTS.find((opt) => opt.value === field.value);
  }, [SELECTEDOPTS, field.value]);

  return (
    <FormControl orientation="vertical" maxW={48} isDisabled={modalState.prefilledFormData?.type === 'project'}>
      <FormLabel>{t('stylePresets.type')}</FormLabel>
      <Combobox value={value} options={SELECTEDOPTS} onChange={onChange} />
    </FormControl>
  );
};

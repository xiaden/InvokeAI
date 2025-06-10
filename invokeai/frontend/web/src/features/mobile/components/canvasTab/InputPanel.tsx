import { Box } from '@invoke-ai/ui-library';
import { useTranslation } from 'react-i18next';

export default function InputPanel() {
  const { t } = useTranslation();
  return <Box>{t('mobile.inputPanelPlaceholder', { defaultValue: 'Input Panel Placeholder' })}</Box>;
}

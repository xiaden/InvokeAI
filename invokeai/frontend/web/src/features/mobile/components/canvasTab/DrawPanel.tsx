import { Box } from '@invoke-ai/ui-library';
import { useTranslation } from 'react-i18next';

export default function DrawPanel() {
  const { t } = useTranslation();
  return <Box>{t('mobile.drawPanelPlaceholder', { defaultValue: 'Draw Panel Placeholder' })}</Box>;
}

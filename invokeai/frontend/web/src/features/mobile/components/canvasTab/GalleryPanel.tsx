import { Box } from '@invoke-ai/ui-library';
import { useTranslation } from 'react-i18next';

export default function GalleryPanel() {
  const { t } = useTranslation();
  return <Box>{t('mobile.galleryPanelPlaceholder', { defaultValue: 'Gallery Panel Placeholder' })}</Box>;
}

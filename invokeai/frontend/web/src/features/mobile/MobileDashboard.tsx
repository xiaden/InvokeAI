import { Box, Button, Flex } from '@invoke-ai/ui-library';
import type { TFunction } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CanvasTab from './components/CanvasTab';

const TABS = ['canvas', 'upscale', 'workflows', 'models', 'queue', 'options'];

const MobileDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('canvas');
  const [showTabs, setShowTabs] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowTabs(false), 5000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches?.[0];
      if (touch && touch.clientY < 50) {
        setShowTabs(true);
      }
    };
    window.addEventListener('touchstart', handleTouchStart);
    return () => window.removeEventListener('touchstart', handleTouchStart);
  }, []);
  const handleTabClick = (tab: string) => () => setActiveTab(tab);
  return (
    <Flex direction="column" h="100vh" w="100vw" bg="black" color="white">
      {showTabs && (
        <Flex position="fixed" top="0" left="0" right="0" zIndex="1000" bg="gray.900" p={2} justify="space-around">
          {TABS.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'solid' : 'ghost'}
              colorScheme="blue"
              size="sm"
              onClick={handleTabClick(tab)}
            >
              {tab}
            </Button>
          ))}
        </Flex>
      )}
      <Box mt={showTabs ? '48px' : 0} flex="1" p={2} overflowY="auto">
        {renderTabContent(activeTab, t)}
      </Box>
    </Flex>
  );
};

const renderTabContent = (tab: string, t: TFunction) => {
  const UpscaleTab = () => <Box>{t('Upscale Tab (stub)')}</Box>;
  const WorkflowsTab = () => <Box>{t('Workflows Tab (stub)')}</Box>;
  const ModelsTab = () => <Box>{t('Models Tab (stub)')}</Box>;
  const QueueTab = () => <Box>{t('Queue Tab (stub)')}</Box>;
  const OptionsTab = () => <Box>{t('Options Tab (stub)')}</Box>;
  switch (tab) {
    case 'canvas':
      return <CanvasTab />;
    case 'upscale':
      return <UpscaleTab />;
    case 'workflows':
      return <WorkflowsTab />;
    case 'models':
      return <ModelsTab />;
    case 'queue':
      return <QueueTab />;
    case 'options':
      return <OptionsTab />;
    default:
      return null;
  }
};

export default MobileDashboard;

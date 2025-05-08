import { Box, Button, Flex } from '@invoke-ai/ui-library';
import { useCallback, useEffect, useState } from 'react';

import DrawPanel from './CanvasTab/DrawPanel';
import GalleryPanel from './CanvasTab/GalleryPanel';
import InputPanel from './CanvasTab/InputPanel';

const SUBTABS = ['input', 'draw', 'gallery'] as const;
type Subtab = (typeof SUBTABS)[number];

export default function CanvasTab() {
  const [activeSubtab, setActiveSubtab] = useState<Subtab>('input');

  // Optional swipe gesture handler if you want to get fancy later
  useEffect(() => {
    const handleSwipe = () => {
      // Implement swipe logic to switch subtabs if desired
    };
    window.addEventListener('touchstart', handleSwipe);
    return () => window.removeEventListener('touchstart', handleSwipe);
  }, []);

  const handleClick = useCallback((tab: Subtab) => {
    setActiveSubtab(tab);
  }, []);

  const getClickHandler = (tab: Subtab) => {
    return function handleTabClick() {
      handleClick(tab);
    };
  };

  return (
    <Flex direction="column" h="100%" w="100%" bg="black" color="white">
      <Flex justify="space-around" bg="gray.900" p={2}>
        {SUBTABS.map((tab) => (
          <Button
            key={tab}
            size="sm"
            variant={activeSubtab === tab ? 'solid' : 'ghost'}
            colorScheme="blue"
            onClick={getClickHandler(tab)}
          >
            {tab}
          </Button>
        ))}
      </Flex>

      <Box flex="1" overflowY="auto" p={2}>
        {activeSubtab === 'input' && <InputPanel />}
        {activeSubtab === 'draw' && <DrawPanel />}
        {activeSubtab === 'gallery' && <GalleryPanel />}
      </Box>
    </Flex>
  );
}

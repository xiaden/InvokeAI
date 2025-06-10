import { Box, Flex, SimpleGrid, Tab, TabList, TabPanel, TabPanels, Tabs } from '@invoke-ai/ui-library';
import { ControlAdapterModelDefaultSettings } from 'features/modelManagerV2/subpanels/ModelPanel/ControlAdapterModelDefaultSettings/ControlAdapterModelDefaultSettings';
import { ModelConvertButton } from 'features/modelManagerV2/subpanels/ModelPanel/ModelConvertButton';
import { ModelEditButton } from 'features/modelManagerV2/subpanels/ModelPanel/ModelEditButton';
import { ModelHeader } from 'features/modelManagerV2/subpanels/ModelPanel/ModelHeader';
import { TriggerPhrases } from 'features/modelManagerV2/subpanels/ModelPanel/TriggerPhrases';
import { filesize } from 'filesize';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyModelConfig } from 'services/api/types';

import { MainModelDefaultSettings } from './MainModelDefaultSettings/MainModelDefaultSettings';
import { ModelAttrView } from './ModelAttrView';
import { ModelExternalData } from './ModelExternalData';
import { ModelTags } from './ModelTags';
import { PromptSets } from './PromptSets';
import { RelatedModels } from './RelatedModels';

type Props = {
  modelConfig: AnyModelConfig;
};

export const ModelView = memo(({ modelConfig }: Props) => {
  const { t } = useTranslation();

  const withSettings = useMemo(() => {
    if (modelConfig.type === 'main' && modelConfig.base !== 'sdxl-refiner') {
      return true;
    }
    if (
      modelConfig.type === 'controlnet' ||
      modelConfig.type === 't2i_adapter' ||
      modelConfig.type === 'control_lora'
    ) {
      return true;
    }
    if (modelConfig.type === 'main' || modelConfig.type === 'lora') {
      return true;
    }
    return false;
  }, [modelConfig.base, modelConfig.type]);

  return (
    <Flex flexDir="column" gap={4}>
      <ModelHeader modelConfig={modelConfig}>
        {modelConfig.format === 'checkpoint' && modelConfig.type === 'main' && (
          <ModelConvertButton modelConfig={modelConfig} />
        )}
        <ModelEditButton />
      </ModelHeader>
      
      <Tabs variant="unstyled" isFitted w="full">
        <TabList bg="base.750" px={4} py={2} borderRadius="md" boxShadow="sm">
          <Tab
            color="accent.300"
            justifyContent="center"
            _selected={{ color: 'accent.300', borderBottom: '2px solid', borderColor: 'accent.300' }}
          >
            {t('modelManager.basicInformation')}
          </Tab>
          <Tab
            color="accent.300"
            justifyContent="center"
            _selected={{ color: 'accent.300', borderBottom: '2px solid', borderColor: 'accent.300' }}
          >
            {t('modelManager.defaultSettings')}
          </Tab>
          <Tab
            color="accent.300"
            justifyContent="center"
            _selected={{ color: 'accent.300', borderBottom: '2px solid', borderColor: 'accent.300' }}
          >
            {t('modelManager.metadata')}
          </Tab>
        </TabList>

        <TabPanels>
          {/* Basic Info */}
          <TabPanel>
            <Box layerStyle="second" borderRadius="md" p={4}>
              <SimpleGrid columns={2} gap={4}>
                <ModelExternalData modelConfig={modelConfig} />
                <ModelAttrView label={t('modelManager.baseModel')} value={modelConfig.base} />
                <ModelAttrView label={t('modelManager.modelType')} value={modelConfig.type} />
                <ModelAttrView label={t('common.format')} value={modelConfig.format} />
                <ModelAttrView label={t('modelManager.path')} value={modelConfig.path} />
                <ModelAttrView label={t('modelManager.fileSize')} value={filesize(modelConfig.file_size)} />

                {modelConfig.type === 'main' && (
                  <>
                    <ModelAttrView label={t('modelManager.variant')} value={modelConfig.variant} />
                    {modelConfig.format === 'diffusers' && modelConfig.repo_variant && (
                      <ModelAttrView label={t('modelManager.repoVariant')} value={modelConfig.repo_variant} />
                    )}
                  </>
                )}

                {modelConfig.type === 'main' && modelConfig.format === 'checkpoint' && (
                  <>
                    <ModelAttrView label={t('modelManager.pathToConfig')} value={modelConfig.config_path} />
                    <ModelAttrView label={t('modelManager.predictionType')} value={modelConfig.prediction_type} />
                    <ModelAttrView
                      label={t('modelManager.upcastAttention')}
                      value={`${modelConfig.upcast_attention}`}
                    />
                  </>
                )}

                {modelConfig.type === 'ip_adapter' && modelConfig.format === 'invokeai' && (
                  <ModelAttrView
                    label={t('modelManager.imageEncoderModelId')}
                    value={modelConfig.image_encoder_model_id}
                  />
                )}
              </SimpleGrid>
            </Box>
          </TabPanel>

          {/* Default Settings */}
          {withSettings && (
            <TabPanel>
              <Box layerStyle="second" borderRadius="md" p={4}>
                {modelConfig.type === 'main' && modelConfig.base !== 'sdxl-refiner' && (
                  <MainModelDefaultSettings modelConfig={modelConfig} />
                )}
                {(modelConfig.type === 'controlnet' ||
                  modelConfig.type === 't2i_adapter' ||
                  modelConfig.type === 'control_lora') && (
                  <ControlAdapterModelDefaultSettings modelConfig={modelConfig} />
                )}
              </Box>
            </TabPanel>
          )}

          {/* Metadata */}
          <TabPanel>
            <Flex flexDirection="column" gap={4}>
              {(modelConfig.type === 'main' || modelConfig.type === 'lora') && (
                <>
                  <Box maxH="250px" overflowY="auto" layerStyle="second" borderRadius="md" p={2}>
                    <ModelTags modelConfig={modelConfig} />
                  </Box>
                  <Box maxH="250px" overflowY="auto" layerStyle="second" borderRadius="md" p={2}>
                    <RelatedModels modelConfig={modelConfig} />
                  </Box>
                  <Box maxH="200px" overflowY="auto" layerStyle="second" borderRadius="md" p={2}>
                    <PromptSets modelConfig={modelConfig} />
                  </Box>
                </>
              )}
              {(modelConfig.type === 'main' || modelConfig.type === 'lora') && (
                <Box maxH="200px" overflowY="auto" layerStyle="second" borderRadius="md" p={2}>
                  <TriggerPhrases modelConfig={modelConfig} />
                </Box>
              )}
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
});

ModelView.displayName = 'ModelView';

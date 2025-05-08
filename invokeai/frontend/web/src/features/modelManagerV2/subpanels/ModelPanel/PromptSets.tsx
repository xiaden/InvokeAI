import { Box, Button, Flex, FormLabel, Tag, TagCloseButton, TagLabel, Tooltip } from '@invoke-ai/ui-library';
import { $stylePresetModalState } from 'features/stylePresets/store/stylePresetModal';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PiWrenchBold } from 'react-icons/pi';
import { useDeleteStylePresetMutation, useListStylePresetsQuery } from 'services/api/endpoints/stylePresets';
import type { LoRAModelConfig, MainModelConfig } from 'services/api/types';

type Props = {
  modelConfig: MainModelConfig | LoRAModelConfig;
};

export const PromptSets = memo(({ modelConfig }: Props) => {
  const { t } = useTranslation();
  const { data: stylePresets = [] } = useListStylePresetsQuery();
  const [deleteStylePreset] = useDeleteStylePresetMutation();

  const modelPromptSets = stylePresets.filter(
    (preset) => preset.type === 'model' && preset.model_key === modelConfig.key
  );

  const handleCreatePromptSet = useCallback(() => {
    $stylePresetModalState.set({
      prefilledFormData: {
        name: '',
        positivePrompt: '',
        negativePrompt: '',
        imageUrl: null,
        type: 'model',
        model_key: modelConfig.key,
        base_type: undefined,
      },
      updatingStylePresetId: null,
      isModalOpen: true,
    });
  }, [modelConfig.key]);

  const handleEditPromptSet = useCallback(
    (presetId: string) => {
      const preset = stylePresets.find((p) => p.id === presetId);
      if (!preset) {
        return;
      }

      $stylePresetModalState.set({
        prefilledFormData: {
          name: preset.name,
          positivePrompt: preset.preset_data.positive_prompt,
          negativePrompt: preset.preset_data.negative_prompt,
          imageUrl: preset.image,
          type: preset.type,
          model_key: preset.model_key ?? undefined,
          base_type: preset.base_type ?? undefined,
        },
        updatingStylePresetId: preset.id,
        isModalOpen: true,
        isCreatingFromModel: true,
      });
    },
    [stylePresets]
  );

  const handleDeletePromptSet = useCallback(
    async (presetId: string) => {
      await deleteStylePreset(presetId).unwrap();
    },
    [deleteStylePreset]
  );

  const handleDeletePromptSetClick = useCallback(
    (presetId: string) => (e: React.MouseEvent) => {
      e.stopPropagation();
      handleDeletePromptSet(presetId);
    },
    [handleDeletePromptSet]
  );

  const handleEditClick = useCallback(
    (presetId: string) => () => {
      handleEditPromptSet(presetId);
    },
    [handleEditPromptSet]
  );

  return (
    <Flex flexDir="column" gap={2} w="full">
      <Flex justifyContent="space-between" alignItems="center" w="full">
        <FormLabel m={0}>{t('modelManager.defaultPrompts')}</FormLabel>
        <Button size="sm" onClick={handleCreatePromptSet}>
          {t('common.add')}
        </Button>
      </Flex>

      <Flex gap={2} flexWrap="wrap" maxW="full" maxH="300px" overflowY="auto" p={2} bg="base.800" borderRadius="md">
        {modelPromptSets.length === 0 ? (
          <Flex flexDir="column" alignItems="center" justifyContent="center" w="full" py={8} opacity={0.7}>
            <Box fontSize="2xl">📄</Box>
            <Box fontSize="md">{t('stylePresets.noStylePresets')}</Box>
          </Flex>
        ) : (
          modelPromptSets.map((preset) => {
            const tooltip = [
              preset.preset_data.positive_prompt && `Positive: ${preset.preset_data.positive_prompt}`,
              preset.preset_data.negative_prompt && `Negative: ${preset.preset_data.negative_prompt}`,
            ]
              .filter(Boolean)
              .join('\n');

            return (
              <Tooltip
                key={preset.id}
                label={
                  <Box maxW="300px" whiteSpace="pre-wrap" wordBreak="break-word">
                    {tooltip}
                  </Box>
                }
                hasArrow
              >
                <Tag
                  size="md"
                  py={2}
                  px={4}
                  bg="base.700"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  _hover={{ bg: 'base.600' }}
                >
                  <PiWrenchBold size={14} onClick={handleEditClick(preset.id)} cursor="pointer" />
                  <TagLabel whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" maxW="100px">
                    {preset.name}
                  </TagLabel>
                  <TagCloseButton onClick={handleDeletePromptSetClick(preset.id)} cursor="pointer" />
                </Tag>
              </Tooltip>
            );
          })
        )}
      </Flex>
    </Flex>
  );
});

PromptSets.displayName = 'PromptSets';

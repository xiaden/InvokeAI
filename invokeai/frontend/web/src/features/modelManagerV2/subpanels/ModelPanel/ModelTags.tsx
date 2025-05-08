import { Button, Flex, FormLabel, Input, Tag, TagCloseButton, TagLabel } from '@invoke-ai/ui-library';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PiPlusBold } from 'react-icons/pi';
import { useUpdateModelMutation } from 'services/api/endpoints/models';
import type { AnyModelConfig } from 'services/api/types';

type Props = {
  modelConfig: AnyModelConfig;
};

export const ModelTags = memo(({ modelConfig }: Props) => {
  const { t } = useTranslation();
  const [phrase, setPhrase] = useState('');

  const [updateModel, { isLoading }] = useUpdateModelMutation();

  const modelTags = useMemo(() => modelConfig?.model_tags ?? [], [modelConfig]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const lastCommaIndex = value.lastIndexOf(',');

      if (lastCommaIndex !== -1) {
        const tagsToAdd = value
          .slice(0, lastCommaIndex)
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0 && !modelTags.includes(tag));

        if (tagsToAdd.length > 0) {
          void updateModel({
            key: modelConfig.key,
            body: {
              ...modelConfig,
              model_tags: [...modelTags, ...tagsToAdd],
            },
          }).unwrap();
        }

        setPhrase(value.slice(lastCommaIndex + 1));
      } else {
        setPhrase(value);
      }
    },
    [modelTags, modelConfig, updateModel]
  );

  const errors = useMemo(() => {
    const errs = [];
    if (phrase.length && modelTags.includes(phrase.trim())) {
      errs.push('Tag is already in list');
    }
    return errs;
  }, [phrase, modelTags]);

  const removeModelTag = useCallback(
    async (tagToRemove: string) => {
      const updatedTags = modelTags.filter((t) => t !== tagToRemove);

      await updateModel({
        key: modelConfig.key,
        body: {
          ...modelConfig,
          model_tags: updatedTags,
        },
      }).unwrap();
    },
    [modelTags, updateModel, modelConfig]
  );

  const handleAddTags = useCallback(async () => {
    const existingTagsLower = modelTags.map((t) => t.toLowerCase());

    const newTags = phrase
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !existingTagsLower.includes(t.toLowerCase()));

    if (newTags.length === 0) {
      return;
    }

    const updatedTags = [...modelTags, ...newTags];

    await updateModel({
      key: modelConfig.key,
      body: {
        ...modelConfig,
        model_tags: updatedTags,
      },
    }).unwrap();

    setPhrase('');
  }, [phrase, modelTags, modelConfig, updateModel]);

  const handleRemoveTag = useCallback(
    (tag: string) => () => {
      removeModelTag(tag);
    },
    [removeModelTag]
  );

  const handleKeyDown = useCallback(
    async (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        await handleAddTags();
      }
    },
    [handleAddTags]
  );

  return (
    <Flex flexDir="column" w="full" gap="5">
      <FormLabel>{t('modelManager.modelTags')}</FormLabel>

      <Flex gap="3" alignItems="center" w="full">
        <Input
          placeholder="Enter tags separated by commas"
          value={phrase}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <Button
          leftIcon={<PiPlusBold />}
          size="sm"
          isDisabled={!phrase || errors.length > 0}
          isLoading={isLoading}
          onClick={handleAddTags} // manual click
        >
          {t('common.add')}
        </Button>
      </Flex>

      <Flex gap="2" flexWrap="wrap" maxW="full" maxH="200px" overflowY="auto" p="2" bg="base.800" borderRadius="md">
        {modelTags.map((tag, index) => (
          <Tag size="md" key={index} py={2} px={4} bg="base.700" _hover={{ bg: 'base.600', cursor: 'pointer' }}>
            <TagLabel whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" maxW="60px">
              {tag}
            </TagLabel>
            <TagCloseButton onClick={handleRemoveTag(tag)} isDisabled={isLoading} />
          </Tag>
        ))}
      </Flex>
    </Flex>
  );
});

ModelTags.displayName = 'ModelTags';

type ModelTagsViewerProps = {
  modelTags: string[];
};

const ModelTagsViewer = memo(({ modelTags }: ModelTagsViewerProps) => {
  const { t } = useTranslation();
  if (!modelTags?.length) {
    return <div>{t('No tags available.')}</div>;
  }

  return (
    <Flex gap="2" flexWrap="wrap" maxW="full" maxH="200px" overflowY="auto" p="2" bg="base.800" borderRadius="md">
      {modelTags.map((tag, index) => (
        <Tag size="md" key={index} py={2} px={2} bg="base.700" _hover={{ bg: 'base.600', cursor: 'pointer' }}>
          <TagLabel whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" maxW="120px">
            {tag}
          </TagLabel>
        </Tag>
      ))}
    </Flex>
  );
});

ModelTagsViewer.displayName = 'ModelTagsViewer';

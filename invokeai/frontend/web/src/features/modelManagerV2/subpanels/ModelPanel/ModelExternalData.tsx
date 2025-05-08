import { useToast } from '@invoke-ai/ui-library';
import { Fragment, memo, useCallback } from 'react';
import { useUpdateModelMutation } from 'services/api/endpoints/models';
import type { AnyModelConfig } from 'services/api/types';

import { EditableAttrField } from './Fields/EditableAttrField';

type Props = {
  modelConfig: AnyModelConfig;
};

export const ModelExternalData = memo(({ modelConfig }: Props) => {
  const [updateModel] = useUpdateModelMutation();
  const toast = useToast();

  const handleUpdateField = useCallback(
    async (field: string, value: string) => {
      try {
        await updateModel({ key: modelConfig.key, body: { [field]: value } }).unwrap();
        toast({
          status: 'success',
          title: `Updated ${field}`,
        });
      } catch (e) {
        toast({
          status: 'error',
          title: `Failed to update ${field}`,
        });
      }
    },
    [modelConfig.key, toast, updateModel]
  );

  return (
    <Fragment>
      <EditableAttrField
        label="Creator"
        value={modelConfig.creator_name ?? undefined}
        fieldKey="creator_name"
        onSubmit={handleUpdateField}
      />
      <EditableAttrField
        value={modelConfig.model_family ?? modelConfig.base ?? undefined}
        label="Model Family"
        fieldKey="model_family"
        onSubmit={handleUpdateField}
      />
      <EditableAttrField
        label="Published Date"
        value={modelConfig.published_date ?? undefined}
        fieldKey="published_date"
        onSubmit={handleUpdateField}
      />
      <EditableAttrField
        label="Source URL"
        value={modelConfig.source_url ?? undefined}
        fieldKey="source_url"
        onSubmit={handleUpdateField}
      />
      <EditableAttrField
        label="License"
        value={modelConfig.license ?? undefined}
        fieldKey="license"
        onSubmit={handleUpdateField}
      />
      <EditableAttrField
        label="NSFW Rating"
        value={modelConfig.nsfw_rating ?? undefined}
        fieldKey="nsfw_rating"
        enumOptions={['sfw', 'nsfw', 'mixed']}
        onSubmit={handleUpdateField}
      />
    </Fragment>
  );
});

ModelExternalData.displayName = 'ModelExternalData';

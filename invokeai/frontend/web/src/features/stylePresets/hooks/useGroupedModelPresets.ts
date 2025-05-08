import { useAppSelector } from 'app/store/storeHooks';
import { useListStylePresetsQuery } from 'services/api/endpoints/stylePresets';
import { useLoRAModels, useMainModels } from 'services/api/hooks/modelsByType';

export const useGroupedModelPresets = () => {
  const mainModel = useAppSelector((state) => state.params.model);
  const loraModelKeys = useAppSelector((state) => state.loras.loras.map((lora) => lora.model?.key).filter(Boolean));

  const { data: stylePresets = [] } = useListStylePresetsQuery();
  const [mainModels = []] = useMainModels();
  const [loraModels = []] = useLoRAModels();

  const modelNameByKey: Record<string, string> = [...mainModels, ...loraModels].reduce(
    (acc, model) => {
      acc[model.key] = model.name;
      return acc;
    },
    {} as Record<string, string>
  );

  const grouped: Record<string, typeof stylePresets> = {};

  stylePresets.forEach((preset) => {
    if (preset.type === 'model' && preset.model_key) {
      if (preset.model_key === mainModel?.key || loraModelKeys.includes(preset.model_key)) {
        const name = modelNameByKey[preset.model_key] ?? preset.model_key;
        const groupName = `Model: ${name}`;
        grouped[groupName] ||= [];
        grouped[groupName].push(preset);
      }
    }

    if (preset.type === 'base' && preset.base_type === mainModel?.base) {
      const groupName = `Base: ${mainModel?.base}`;
      grouped[groupName] ||= [];
      grouped[groupName].push(preset);
    }
  });

  return grouped;
};

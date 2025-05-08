import { Flex, IconButton, Input, Select, Text, Tooltip } from '@invoke-ai/ui-library';
import { useCallback, useEffect, useState } from 'react';
import { FaCheck, FaWrench } from 'react-icons/fa';

type EditableAttrFieldProps = {
  label: string;
  value: string | undefined;
  fieldKey: string;
  onSubmit: (field: string, value: string) => void;
  enumOptions?: string[];
};

export const EditableAttrField = ({ label, value, fieldKey, onSubmit, enumOptions }: EditableAttrFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tempValue, setTempValue] = useState(value ?? '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      const timeout = setTimeout(() => setSaved(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [saved]);

  const handleMouseEnter = useCallback(() => {
    setHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovering(false);
  }, []);

  const handleClickEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTempValue(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (tempValue !== value) {
      onSubmit(fieldKey, tempValue);
    }
  }, [fieldKey, onSubmit, tempValue, value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleBlur();
      }
    },
    [handleBlur]
  );

  const renderValue = () => {
    if (fieldKey === 'source_url' && value) {
      return (
        <Text
          as="a"
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          fontSize="sm"
          fontWeight="semibold"
          color="blue.300"
          textDecoration="underline"
          _hover={{ textDecoration: 'aliceblue' }}
        >
          {value}
        </Text>
      );
    }
    return value || '—';
  };

  return (
    <Flex direction="column" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Text fontWeight="semibold" color="base.300" mb={1}>
        {label}
      </Text>
      <Flex align="center" gap={2}>
        {isEditing ? (
          enumOptions ? (
            <Select fontWeight="semibold" value={tempValue} onChange={handleChange} onBlur={handleBlur} autoFocus>
              {enumOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              fontWeight="semibold"
              value={tempValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          )
        ) : (
          <>
            <Text color="base.100" fontWeight="semibold" wordBreak="break-word">
              {renderValue()}
            </Text>
            {saved ? (
              <FaCheck size={14} color="#72ff72" />
            ) : (
              hovering && (
                <Tooltip label="Edit">
                  <IconButton
                    aria-label="Edit"
                    size="xs"
                    icon={<FaWrench size={12} />}
                    onClick={handleClickEdit}
                    variant="ghost"
                  />
                </Tooltip>
              )
            )}
          </>
        )}
      </Flex>
    </Flex>
  );
};

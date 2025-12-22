import { ChevronDown, ChevronUp, Menu, Option, Play } from 'lucide-react';
import { ActionIcon, Button, Collapse, Group, Select, SelectProps, Text, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './QuerySection.module.css';
import { typeToIcon } from '../TypesTheme/TypesTheme';
import { IconCheck } from '@tabler/icons-react';


const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => (
  <Group flex="1" gap="xs">
    {typeToIcon[option.value]}
    {option.label}
    {checked && <IconCheck style={{ marginInlineStart: 'auto' }} size={10} />}
  </Group>
);

export const QuerySection = () => {
  const [opened, handlers] = useDisclosure(true);
  return (
    <>
      <Group justify="space-between" align="center">
        <Text size="xs" c="dimmed">
          Quick Query
        </Text>
        <ActionIcon size="xs" variant="transparent" onClick={handlers.toggle} c="dimmed">
          {opened ? <ChevronUp /> : <ChevronDown />}
        </ActionIcon>
      </Group>
      <Collapse in={opened} transitionDuration={0} c="red">
        <Textarea
          variant="filled"
          minRows={3}
          size="xs"
          autosize
          placeholder="Enter your query..."
          classNames={{ ...classes }}
        />
        <Group justify="space-between" gap={0}>
          <Button leftSection={<Play size="15" />} w={70} size="compact-sm" c="dark.7" radius="md" my="xs">
            Run 
          </Button>
          <Select
          rightSection={<Menu size={14} />} 
            c="dimmed"
            w={125}
            radius="md"
            placeholder="Query Type"
            autoSelectOnBlur
            searchable
            size="xs"
            variant="default"
            data={['Analysis', 'Graph', 'Table', 'SQL']}
            renderOption={renderSelectOption} 
          />
        </Group>
      </Collapse>
    </>
  );
};

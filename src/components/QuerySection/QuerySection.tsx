import { ChevronDown, ChevronUp, Menu, Option, Play } from 'lucide-react';
import { ActionIcon, Button, Collapse, Group, Select, SelectProps, Text, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './QuerySection.module.css';
import { typeToColor, typeToIcon } from '../TypesTheme/TypesTheme';
import { IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { useTabsStore } from '@/stores/useTabs';


const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => (
  <Group flex="1" gap="xs">
    {typeToIcon[option.value]}
    {option.label}
    {checked && <IconCheck style={{ marginInlineStart: 'auto' }} size={10} />}
  </Group>
);
type queryTypeOptions = 'Analysis' | 'Graph' | 'Table' | 'SQL'

export const QuerySection = () => {
  const [opened, handlers] = useDisclosure(true);
  const [queryType, setQueryType] = useState<queryTypeOptions>('Analysis');
  const [query, setQuery] = useState('');
  const createNewTab = useTabsStore((state) => state.addTab);

  const handleRun = () => {
    if (!queryType || !query) return;
    createNewTab({
      id: new Date().getTime().toString(),
      type: queryType,
      label: 'New Tab',
      query
    });
  };

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
          spellCheck={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="filled"
          minRows={3}
          size="xs"
          autosize
          placeholder="Enter your query..."
          classNames={{ ...classes }}
        />
        <Group justify="space-between" gap={0}>
          <Button leftSection={<Play size="15" />}
            w={70}
            onClick={handleRun}
            size="compact-sm"
            c="dark.7"
            bg={typeToColor[queryType]}
            radius="md"
            my="xs">
            Run
          </Button>
          <Select
            leftSection={typeToIcon[queryType]}
            required
            c="dimmed"
            w={125}
            radius="md"
            placeholder="Query Type"
            value={queryType}
            onChange={(value) => setQueryType(value as queryTypeOptions)}
            autoSelectOnBlur
            // searchable
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

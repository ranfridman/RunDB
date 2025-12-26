import { IconRefresh, IconSearch } from '@tabler/icons-react';
import { FolderTree, ListTree } from 'lucide-react';
import { ActionIcon, getTreeExpandedState, Group, Input, Text, useTree } from '@mantine/core';
import { data } from './data';
import { DatabaseTree } from './DatabaseTree';
import classes from './DatabaseTreeSection.module.css';

export const DatabaseTreeSection = () => {
  const treeExpandState = useTree({
    initialExpandedState: getTreeExpandedState(data, '*'),
  });
  return (
    <>
      <Group justify="space-between" align="center" h="md">
        <Text size="sm" c="dimmed">
          Structure
        </Text>
        <Group gap={5}>
          <ActionIcon size="xs" variant="transparent" c="dimmed">
            <FolderTree />
          </ActionIcon>
          <ActionIcon size="xs" variant="transparent" c="dimmed">
            <IconRefresh />
          </ActionIcon>
        </Group>
      </Group>
      <Input
        leftSection={<IconSearch size="13" />}
        placeholder="Search Table"
        size="xs"
        classNames={{ ...classes }}
        radius="md"
        variant="default"
      />
      <DatabaseTree data={data} treeExpandState={treeExpandState} />
    </>
  );
};

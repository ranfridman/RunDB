import { IconRefresh, IconSearch } from '@tabler/icons-react';
import { FolderTree, ListTree } from 'lucide-react';
import { ActionIcon, getTreeExpandedState, Group, Input, Text, useTree } from '@mantine/core';
import { data } from './data';
import { DatabaseTree } from './DatabaseTree';
import classes from './DatabaseTreeSection.module.css';
import { useMemo, useState } from 'react';
import { DatabaseTreeNodeData } from './data';

const filterTree = (nodes: DatabaseTreeNodeData[], search: string) => {
  const expanded: Record<string, boolean> = {};
  const searchLower = search.trim().toLowerCase();

  const traverse = (list: DatabaseTreeNodeData[]): DatabaseTreeNodeData[] => {
    const result: DatabaseTreeNodeData[] = [];
    for (const node of list) {
      const isMatch = (node.label as string).toLowerCase().includes(searchLower);
      const filteredChildren = node.children ? traverse(node.children) : undefined;
      const hasChildMatch = !!(filteredChildren && filteredChildren.length > 0);

      if (isMatch || hasChildMatch) {
        if (hasChildMatch && searchLower) {
          expanded[node.value] = true;
        }
        result.push({ ...node, children: filteredChildren });
      }
    }
    return result;
  };

  return { nodes: searchLower ? traverse(nodes) : nodes, expanded };
};


export const DatabaseTreeSection = () => {
  const treeExpandState = useTree({
    // initialExpandedState: getTreeExpandedState(data, '*'),
  });
  const toggleExpandAllNodes = () => {
    if (Object.values(treeExpandState.expandedState).every((value) => value))
      treeExpandState.collapseAllNodes();
    else
      treeExpandState.expandAllNodes();
  };
  const [searchedValue, setSearchedValue] = useState('');

  const filteredData = useMemo(() => {
    const { nodes } = filterTree(data, searchedValue);
    return nodes;
  }, [searchedValue]);


  return (
    <>
      <Group justify="space-between" align="center" h="md">
        <Text size="sm" c="dimmed">
          Structure
        </Text>
        <Group gap={5}>
          <ActionIcon size="xs" variant="transparent" c="dimmed" onClick={toggleExpandAllNodes}>
            <FolderTree />
          </ActionIcon>
          <ActionIcon size="xs" variant="transparent" c="dimmed">
            <IconRefresh />
          </ActionIcon>
        </Group>
      </Group>
      <Input
        leftSection={<IconSearch size="13" />}
        placeholder="Search in Database"
        size="xs"
        classNames={{ ...classes }}
        radius="md"
        variant="default"
        value={searchedValue}
        onChange={(event) => {
          const val = event.target.value;
          setSearchedValue(val);
          if (val.trim()) {
            const { expanded } = filterTree(data, val);
            treeExpandState.setExpandedState(expanded);
          }
        }}
      />
      <DatabaseTree data={filteredData} treeExpandState={treeExpandState} />
    </>
  );
};

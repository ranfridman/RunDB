import { IconRefresh, IconSearch } from '@tabler/icons-react';
import { FolderTree, ListTree, X } from 'lucide-react';
import { ActionIcon, getTreeExpandedState, Group, Input, Text, useTree } from '@mantine/core';
import { DatabaseTree } from './DatabaseTree';
import classes from './DatabaseTreeSection.module.css';
import { useMemo, useState } from 'react';
import { DatabaseTreeNodeData } from './data';
import { useDBConnectionsStore } from '@/stores/useDBConnections';
import { getDBStructure } from '@/api/db';

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
  });
  const toggleExpandAllNodes = () => {
    if (Object.values(treeExpandState.expandedState).every((value) => value))
      treeExpandState.collapseAllNodes();
    else
      treeExpandState.expandAllNodes();
  };
  const [searchedValue, setSearchedValue] = useState('');
  const activeDB = useDBConnectionsStore((state) => state.activeDB);
  const dbConnection = useDBConnectionsStore((state) => state.dbConnections.find((dbConnection) => dbConnection.id === activeDB));
  const dbStructure = getDBStructure(dbConnection?.connection);

  const filteredData = useMemo(() => {
    if (!dbStructure.data?.data) return [];
    if (searchedValue.trim() === '') return dbStructure.data?.data;
    const rawData = Array.isArray(dbStructure.data?.data) ? dbStructure.data?.data : [];
    const { nodes } = filterTree(rawData as DatabaseTreeNodeData[], searchedValue);
    treeExpandState.setExpandedState(getTreeExpandedState(nodes, '*'));
    return nodes;
  }, [searchedValue, dbStructure.data?.data]);



  return (
    <>
      {/* {JSON.stringify(filteredData)} */}
      <Group justify="space-between" align="center" h="md">
        <Text size="sm" c="dimmed">
          Structure
        </Text>
        <Group gap={5}>
          <ActionIcon
            size="xs"
            variant="transparent"
            c="dimmed"
            onClick={toggleExpandAllNodes}
            disabled={dbStructure.isLoading || dbStructure.isError}
          >
            <FolderTree size={14} />
          </ActionIcon>
          <ActionIcon
            size="xs"
            variant="transparent"
            c="dimmed"
            onClick={() => dbStructure.refetch()}
            loading={dbStructure.isFetching}
          >
            <IconRefresh size={14} />
          </ActionIcon>
        </Group>
      </Group>

      <Input
        spellCheck={false}
        leftSection={<IconSearch size="13" />}
        placeholder="Search in Database"
        size="xs"
        classNames={{ ...classes }}
        radius="md"
        variant="default"
        value={searchedValue}
        rightSectionPointerEvents="all"
        rightSection={
          searchedValue && (
            <ActionIcon
              size="xs"
              variant="transparent"
              c="dimmed"
              onClick={() => { setSearchedValue(''); }}
            >
              <X size={14} />
            </ActionIcon>
          )
        }
        onChange={(event) => {
          const val = event.target.value;
          setSearchedValue(val);
          if (val.trim()) {
            const rawData = dbStructure.data?.data || [];
            const { expanded } = filterTree(rawData, val);
            treeExpandState.setExpandedState(expanded);
          }
        }}
      />

      {dbStructure.isLoading ? (
        <Text size="xs" c="dimmed" ta="center" mt="md">Loading structure...</Text>
      ) : (!activeDB) ? (
        <Text size="xs" c="dimmed" ta="center" mt="md">No database selected</Text>
      ) : dbStructure.isError ? (
        <Text size="xs" c="red" ta="center" mt="md">Error loading structure</Text>
      ) : (
        <DatabaseTree data={filteredData} treeExpandState={treeExpandState} />
      )}
    </>
  );
};

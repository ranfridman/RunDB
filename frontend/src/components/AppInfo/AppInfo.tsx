import { Database } from 'lucide-react';
import { Button, Code, Group, Indicator, Stack, Text, Tooltip } from '@mantine/core';

export const AppInfo = () => {
  return (
    <>
      <Group justify="space-between" c="gray.2" align="center" gap={5}>
        {/* <Button size="compact-sm" c="gray.2" bg="dark" variant="filled" rightSection={<ListChevronsUpDown size={16} />} >Filters dfs gjkl</Button> */}

        <Group gap={2} align='center'>
          <Indicator position='bottom-start' offset={6} processing px="3" color="teal" size={8} >
            <Database size={20} />
          </Indicator>
          <Text size="sm" fw={600} >
            RunDB
          </Text>


        </Group>

        <Code fw={700} bg="light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-4))"
          c="light-dark(var(--mantine-color-gray-8), var(--mantine-color-dark-1))"
        >v1.0.0    </Code>
      </Group>
    </>
  );
};

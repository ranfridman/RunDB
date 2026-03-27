import { Box, Divider, Flex, Group, Text } from '@mantine/core';
import { QuerySection } from '../QuerySection/QuerySection';
import { DatabaseTreeSection } from '../DatabaseTreeSection/DatabaseTreeSection';
import { AppInfo } from '../AppInfo/AppInfo';
import { History } from '../History/History';
import { SidebarOption } from '../SidebarOption/SidebarOption';
import { Contact, Settings } from 'lucide-react';
import { AddDatabaseModal } from '../AddDatabaseModal/AddDatabaseModal';

export const Sidebar = () => {
  return (
    <>
      <Flex direction="column" gap={0} p={0} h="100vh">
        < Box p="xs" pt={9.5}>
          <AppInfo />
        </Box>
        <Divider />
        <Group gap={0} align="start" justify="space-between" p={0} flex="nowrap">
          <Box w="20">
            <Text>T</Text>
          </Box>
          <Box w="calc(100% - 20px)">
            <Flex direction="column" gap="xs" p="sm">
              <QuerySection />
              <Divider />
              <DatabaseTreeSection />
              <History />
              <SidebarOption title="Settings" icon={<Settings />} />
              <SidebarOption title="Contact Us" icon={<Contact />} />
            </Flex>
          </Box>
        </Group>
      </Flex>
      <AddDatabaseModal />
    </>
  );
};

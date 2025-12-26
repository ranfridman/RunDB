import { Divider, Flex } from '@mantine/core';
import { QuerySection } from '../QuerySection/QuerySection';
import { DatabaseTreeSection } from '../DatabaseTreeSection/DatabaseTreeSection';
import { AppInfo } from '../AppInfo/AppInfo';
import { History } from '../History/History';
import { SidebarOption } from '../SidebarOption/SidebarOption';
import { Contact, Settings } from 'lucide-react';

export const Sidebar = () => {
  return (
    <>
      <Flex direction="column" gap="xs" p="sm" h="100vh">
        <AppInfo />
        <Divider />
        <QuerySection />
        <Divider />
        <DatabaseTreeSection />
        <History />
        <SidebarOption title="Settings" icon={<Settings />} />
        <SidebarOption title="Contact Us" icon={<Contact />} />
      </Flex>
    </>
  );
};

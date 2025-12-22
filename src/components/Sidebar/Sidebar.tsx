import { Divider, Flex } from '@mantine/core';
import { QuerySection } from '../QuerySection/QuerySection';
import { DatabaseTreeSection } from '../DatabaseTreeSection/DatabaseTreeSection';
import { AppInfo } from '../AppInfo/AppInfo';
import { History } from '../History/History';

export const Sidebar = () => {
  return (
    <>
      <Flex direction="column" gap="xs" p="sm" h="100%">
        {/* <br /> */}
        <AppInfo />
        <Divider/>
        <QuerySection />
        <Divider/>
        <DatabaseTreeSection />
        <History /> 
        {/* <QuerySection /> */}
      </Flex>
    </>
  );
};

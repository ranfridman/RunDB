import { Plus, X } from 'lucide-react';
import { ActionIcon, Box, Divider, Group, ScrollArea, Tabs } from '@mantine/core';
import { typeToColor, typeToIcon } from '../TypesTheme/TypesTheme';
import { Response } from '../Response/Response';
import { useEffect, useState } from 'react';
import { NewTabOptions } from '../NewTabOptions/NewTabOptions';
import { TabOption } from '../TabOption/TabOption';


import { useQuery, experimental_streamedQuery as streamedQuery } from '@tanstack/react-query';
import { GraphSetup } from '../GraphSetup/GraphSetup';
import { AIPanel } from '../AIPanel/AIPanel';
import { useTabsStore } from '../../stores/useTabs';
import { TablePanel } from '../TabelPanel/TabelPanel';


export interface tabData {
  label: string;
  id: string;
  type: string;
}




export const InfoArea: React.FC = () => {
  const { tabs, addTab, removeTab, setActiveTab, activeTab } = useTabsStore();

  const handleNewTabCreated = (tab: tabData) => {
    addTab(tab);
    setActiveTab(tab.id);
  }


  const tabsList = tabs.map((option, index) => (
    <TabOption option={option} index={index} />
  ));

  const panels = tabs.map((option, index) => (
    <Tabs.Panel key={index} value={option.id} p={0} keepMounted={false}>
      {(option.type !== 'SQL') ? <AIPanel label={option.label} type={option.type} id={option.id} /> : <TablePanel />}
    </Tabs.Panel>
  ));
  return (
    <>
      <Tabs defaultValue="pluse" value={activeTab} onChange={(value) => setActiveTab(value)} >
        <Tabs.List bg="dark.7" w="100%">
          <ScrollArea type="scroll" scrollbarSize={2} offsetScrollbars >
            <Group w="100%" gap="0" display="flex" style={{ flexWrap: "nowrap" }}>
              {...tabsList}
              <Tabs.Tab value="pluse" px={12} bg={activeTab === "pluse" ? "dark.9" : ""}>
                <Plus size={16} />
              </Tabs.Tab>
              <Divider orientation="vertical" mx={0} pr={30} />
            </Group>
          </ScrollArea>
        </Tabs.List>

        <ScrollArea h="90vh" offsetScrollbars p={0} scrollbarSize={2}>
          <Tabs.Panel value="pluse" h="100%">
            <NewTabOptions />
          </Tabs.Panel>
          {panels}
        </ScrollArea>
      </Tabs>
    </>
  );
};

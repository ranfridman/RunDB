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

const useMarkdownStream = (url: string) => {
  return useQuery({
    queryKey: ['markdown', url],
    queryFn: streamedQuery({
      streamFn: async () => {
        const response = await fetch(url);
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        // Convert ReadableStream to AsyncIterable
        return (async function* () {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              yield value;
            }
          } finally {
            reader.releaseLock();
          }
        })();
      },
      // How to merge chunks. For Markdown, we usually append strings.
      reducer: (acc, chunk) => acc + new TextDecoder().decode(chunk as Uint8Array),
      initialValue: "",
    }),
  });
};
const url2 = "https://raw.githubusercontent.com/mermaid-js/mermaid/develop/docs/syntax/flowchart.md";
const url3 = "https://r.jina.ai/https://en.wikipedia.org/wiki/Markdown";
const url4 = "https://r.jina.ai/https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams";
const url5 = "https://raw.githubusercontent.com/mxstbr/markdown-test-file/master/TEST.md";

export interface tabData {
  label: string;
  id: string;
  type: string;
}

interface InfoAreaProps {
  tabsData: tabData[];
  createNewTab: (tabData: tabData) => void;
  closeTab: (id: string) => void;
}



export const InfoArea: React.FC<InfoAreaProps> = ({ tabsData, createNewTab, closeTab }: InfoAreaProps) => {
  const [activeTab, setActiveTab] = useState<string | null>("pluse");
  // const { data, isLoading } = useMarkdownStream(url5);
  const handleNewTabCreated = (tab: tabData) => {
    createNewTab(tab);
    setActiveTab(tab.id);
  }


  const tabs = tabsData.map((option, index) => (
    <TabOption isActive={activeTab === option.id} option={option} onClose={closeTab} index={index} />
  ));

  const panels = tabsData.map((option, index) => (
    <Tabs.Panel key={index} value={option.id}>
      <AIPanel label={option.label} type={option.type} id={option.id} />
      {/* {option.id}  */}
    </Tabs.Panel>
  ));
  return (
    <>
      <Tabs defaultValue="pluse" value={activeTab} onChange={setActiveTab} >
        <Tabs.List bg="dark.7" w="100%">
          <ScrollArea type="scroll" scrollbarSize={2} offsetScrollbars >
            <Group w="100%" gap="0" display="flex" style={{ flexWrap: "nowrap" }}>
              {...tabs}
              <Tabs.Tab value="pluse" px={12} bg={activeTab === "pluse" ? "dark.9" : ""}>
                <Plus size={16} />
              </Tabs.Tab>
              <Divider orientation="vertical" mx={0} pr={30} />
            </Group>
          </ScrollArea>
        </Tabs.List>

        <ScrollArea h="90vh" offsetScrollbars>
          <Tabs.Panel value="pluse" h="100%">
            <NewTabOptions createNewTab={handleNewTabCreated} />
          </Tabs.Panel>
          {panels}
        </ScrollArea>
      </Tabs>
    </>
  );
};

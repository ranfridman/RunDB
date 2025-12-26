import { Plus, X } from 'lucide-react';
import { ActionIcon, Divider, Tabs } from '@mantine/core';
import { typeToColor, typeToIcon } from '../TypesTheme/TypesTheme';
import { Response } from '../Response/Response';
import { useEffect, useState } from 'react';
import { NewTabOptions } from '../NewTabOptions/NewTabOptions';
import { TabOption } from '../TabOption/TabOption';

const options = [
  { label: 'Table', id: '1', type: 'Table' },
  { label: 'Test', id: '2', type: 'Graph' },
  { label: 'SQL', id: '3', type: 'SQL' },
];



import { useQuery, experimental_streamedQuery as streamedQuery } from '@tanstack/react-query';




const tokens = [
  "# Mermaid Diagram\n",
  "```mermaid\n",
  "graph TD;\n",
  "A-->B;\n",
  "B-->C;\n",
  "C-->D;\n",

  "Table1[\"Users Table\"];\n",
  "Table2[\"Orders Table\"];\n",
  "Table1 -->|has many| Table2;\n",
  "```\n",
  "Table: Users and Orders Relationship\n",
  "| User ID | User Name |\n",
  "| ------- | --------- |\n",
  "| 1       | Alice     |\n",
  "| 2       | Bob       |\n",
  "| 3       | Charlie   |\n",
  "\n",
  "Table: Users and Orders Relationship\n",
  "| User ID | User Name |\n",
  "| ------- | --------- |\n",
  "| 1       | Alice     |\n",
  "| 2       | Bob       |\n",
  "| 3       | Charlie   |\n",
  "\n",

  "This report covers project milestones for Q4.Key areas are outlined below, with specific details found in the corresponding sections.\n",
  "\n",
  "> #### The quarterly results look great!\n",
  "> \n",
  "> * Revenue was off the chart.\n",
  "> * Profits were higher than ever.\n",
  "\n",
  "## 2. Technical Details\n",
  "\n",
  "### 2.1 Code Implementation\n",
  "\n",
  "We utilized ** GitHub Flavored Markdown(GFM) ** for documentation.The following snippet demonstrates a simple Python function with syntax highlighting:\n",
  "\n",
  "```python\n",
  "# Python example\n",
  "def fibonacci(n):\n",
  "    a, b = 0, 1\n",
  "    while a < n:\n",
  "        print(a, end=' ')\n",
  "        a, b = b, a + b\n",
  "```\n",


]
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
const url = "https://r.jina.ai/https://en.wikipedia.org/wiki/Comparison_of_Linux_distributions";
const url2 = "https://bad.solutions/api/stream?type=markdown&delay=500";
const url3 = "https://r.jina.ai/https://en.wikipedia.org/wiki/Markdown";
const url4 = "https://r.jina.ai/https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams";
export const InfoArea = () => {
  const [activeTab, setActiveTab] = useState<string | null>("1");
  const { data, isLoading } = useMarkdownStream(url);

  const tabs = options.map((option, index) => (
    <TabOption isActive={activeTab === option.id} option={option} index={index} />
  ));

  const panels = options.map((option, index) => (
    <Tabs.Panel key={index} value={option.id}>
      <Response isAnimating={isLoading}>
        {data}
      </Response>
    </Tabs.Panel>
  ));
  return (
    <>

      <Tabs defaultValue="pluse" value={activeTab} onChange={setActiveTab} >
        <Tabs.List color="red">
          {...tabs}
          <Tabs.Tab value="pluse" px={12}>
            <Plus size={16} />
          </Tabs.Tab>
          <Divider orientation="vertical" mx={0} />
        </Tabs.List>

        <Tabs.Panel value="pluse" h="100%">
          <NewTabOptions />
          {/* <Response isAnimating={isStreaming}>
          {content}
        </Response> */}
        </Tabs.Panel>
        {panels}
      </Tabs>
    </>
  );
};

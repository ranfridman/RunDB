import { Plus } from 'lucide-react';
import { Divider, Tabs } from '@mantine/core';
import { typeToColor, typeToIcon } from '../TypesTheme/TypesTheme';
import { Response } from '../Response/Response';
import { useEffect, useState } from 'react';
import { NewTabOptions } from '../NewTabOptions/NewTabOptions';

const options = [
  { label: 'Table', id: '1', type: 'Table' },
  { label: 'Test', id: '2', type: 'Graph' },
  { label: 'SQL', id: '3', type: 'SQL' },
];




const tabs = options.map((option, index) => (
  <>
    <Tabs.Tab key={index} color={typeToColor[option.type ?? '']} leftSection={typeToIcon[option.type ?? '']} value={option.id}>
      {option.label}
    </Tabs.Tab>
    <Divider orientation="vertical" mx={0} />
  </>
));



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

export const InfoArea = () => {
  const [content, setContent] = useState("")
  const [isStreaming, setIsStreaming] = useState(true)



  const panels = options.map((option, index) => (
    <Tabs.Panel key={index} value={option.id}>
      <Response isAnimating={isStreaming}>
        {content}
      </Response>
    </Tabs.Panel>
  ));
  useEffect(() => {
    let currentContent = ""
    let index = 0
    const interval = setInterval(() => {
      if (index < tokens.length) {
        currentContent += tokens[index]
        setContent(currentContent)
        index++
      } else {
        clearInterval(interval)
        setIsStreaming(false);

      }
    }, 100)
    return () => {
      setIsStreaming(false);
      clearInterval(interval)
    }

  }, [])
  return (
    <>

      <Tabs defaultValue="pluse" >
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

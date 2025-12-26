import { AppShell, Burger } from '@mantine/core';
import { useDisclosure, useListState } from '@mantine/hooks';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';
import { InfoArea, tabData } from '../InfoArea/InfoArea';
import { useState } from 'react';


const options: tabData[] = [
  { label: 'Table', id: '1', type: 'Table' },
  { label: 'Test', id: '2', type: 'Graph' },
  { label: 'SQL', id: '3', type: 'SQL' },
];

export const AppLayout: React.FC = () => {
  const [opened, { toggle }] = useDisclosure();
  // const [tabs, setTabs] = useState<any[]>(options);
  const [tabs, tabHandlers] = useListState<tabData>(options);

  return (
    <AppShell
      layout='alt'
      header={{ height: 47 }}
      navbar={{
        width: 230,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
        />
        <Header />
      </AppShell.Header>
      <AppShell.Navbar>
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        <InfoArea
          tabsData={tabs}
          createNewTab={(tab) => tabHandlers.append(tab)}
          closeTab={(id) => tabHandlers.filter((tab) => tab.id !== id)}
        />
      </AppShell.Main>
    </AppShell>
  );
}
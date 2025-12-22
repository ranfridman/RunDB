import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';
import { InfoArea } from '../InfoArea/InfoArea';

export const AppLayout:React.FC = ()=> {
  const [opened, { toggle }] = useDisclosure();

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
        <Header/>
      </AppShell.Header>
      <AppShell.Navbar>
        <Sidebar/>
      </AppShell.Navbar>

      <AppShell.Main>
        <InfoArea/>
      </AppShell.Main>
    </AppShell>
  );
}
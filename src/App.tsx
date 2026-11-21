import { Layout } from './components/layout/Layout';
import { Hero } from './components/sections/Hero';
import { Story } from './components/sections/Story';
import { Frames } from './components/sections/Frames';
import { Wishes } from './components/sections/Wishes';
import { useSmoothScroll } from './hooks/useSmoothScroll';

function App() {
  useSmoothScroll();

  return (
    <Layout>
      <Hero />
      <Story />
      <Frames />
      <Wishes />
    </Layout>
  );
}

export default App;

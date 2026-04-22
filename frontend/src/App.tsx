import { Button } from './components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUpIcon } from '@hugeicons/core-free-icons';
function App() {
  return (
    <>
      <section className="">
        <Button>
          Button
          <HugeiconsIcon icon={ArrowUpIcon} />
        </Button>
      </section>
    </>
  );
}

export default App;

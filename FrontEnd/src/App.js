
import { VStack } from '@chakra-ui/react'
import ToggleMode from './components/ToggleMode';
import Home from './home/Home';


function App() {

  return (
    <VStack p={6}>
      <ToggleMode />
      <Home />
    </VStack>
  );
}

export default App;

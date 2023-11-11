
import { VStack, Text } from '@chakra-ui/react'
import ToggleMode from './components/ToggleMode';


function App() {

  return (
    <VStack p={6}>
      <ToggleMode />
      <Text>Hello World</Text>
    </VStack>
  );
}

export default App;

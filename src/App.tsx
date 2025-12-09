import Router from "./Router";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { Theme } from "@chakra-ui/react";
function App() {
  return (
    <NuqsAdapter>
      <Theme>
        <Router />
      </Theme>
    </NuqsAdapter>
  );
}

export default App;

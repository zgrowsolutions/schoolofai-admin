import Router from "./Router";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

function App() {
  return (
    <NuqsAdapter>
      <Router />
    </NuqsAdapter>
  );
}

export default App;

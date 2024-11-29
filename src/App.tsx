import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import Home from "./components/home";

const basename = import.meta.env.BASE_URL;

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <BrowserRouter basename={basename}>
        <Home />
      </BrowserRouter>
    </Suspense>
  );
}

export default App;

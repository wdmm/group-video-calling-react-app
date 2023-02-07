import { useState } from "react";

function App() {
  const [inCall, setInCall] = useState(false);

  return (
    <div className="App">
      { inCall ? "In call" : "Wainting..." }
    </div>
  );
}

export default App;

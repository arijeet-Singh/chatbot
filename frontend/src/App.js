import Chatbot from "./Chatbot/Chatbot";
import OTP from "./Chatbot/OTP";
import { Route, Switch } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={OTP} />
        <Route exact path="/chatbot/:id" component={Chatbot} />
      </Switch>
    </div>
  );
}

export default App;

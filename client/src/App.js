//import scss
import "./main.css";
import Layout from "./components/Layout";
import {GlobalProvider} from "./context/GlobalContext";

//Displays the whole application and the whole idea is wrapped inside the Layout component
function App() {
  return (
    <GlobalProvider>
      <Layout/>
    </GlobalProvider>
    
  );
}

export default App;

//Sources used include Hyperiondev notes, previous Tasks, You Tube, Geeksforgeeks, W3Schools, Google.com and Stackoverflow

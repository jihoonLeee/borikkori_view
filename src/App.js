import './App.css';
import Router from "./Components/Router";
import Header from './Pages/Layout/header';
import Footer from "./Pages/Layout/footer";

function App() {
  return (
    <div className='App'>
      <Header />
        <Router />
      <Footer />
    </div>
  );
}

export default App;

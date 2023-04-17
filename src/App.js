import './App.css';
import Router from "./Components/Router";
import Header from './Pages/Layout/header';
import Footer from "./Pages/Layout/footer";

function App() {
  return (
    <div className='App'>
      <head> <link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
/> </head>
      <Header />
        <Router />
      <Footer />
    </div>
  );
}

export default App;

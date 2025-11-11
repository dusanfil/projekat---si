import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LogIn from './pages/login';
import Register from './pages/register';
import NavBar from './components/navbar';
import Home from './pages/home'
function App() {
  return (

    <Router>
      <NavBar/>
      <Routes>
        <Route path='/login' element={<LogIn/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/' element={<Home/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;

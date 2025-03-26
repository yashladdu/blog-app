import './App.css';
import {Routes, Route} from "react-router-dom";
import Layout from './components/Layout';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import { UserContextProvider } from './userContext';
import CreatePost from './Pages/CreatePost';
import PostPage from './Pages/PostPage';
import EditPost from './Pages/EditPost';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout/> }>
          <Route index element={<Home /> } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />}/>
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="delete/:id" />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;

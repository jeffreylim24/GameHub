import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout
import MainLayout from '@/layouts/MainLayout';

// Pages
import Home from '@/pages/Home';
import Topics from '@/pages/topics/Topics';
import TopicPosts from '@/pages/topics/TopicPosts';
import PostView from '@/pages/posts/PostView';
import NewPost from '@/pages/posts/NewPost';
import UserProfile from '@/pages/user/UserProfile';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/topics/:topicId" element={<TopicPosts />} />
          <Route path="/topics/:topicId/posts/:postId" element={<PostView />} />
          <Route path="/topics/:topicId/posts/new" element={<NewPost />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;

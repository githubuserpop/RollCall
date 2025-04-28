import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GroupProvider } from './context/GroupContext';
import { FriendProvider } from './context/FriendContext';
import { ChatProvider } from './context/ChatContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import CreatePollPage from './pages/CreatePollPage';
import PollDetailPage from './pages/PollDetailPage';
import FriendsPage from './pages/FriendsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import GroupChatPage from './pages/GroupChatPage';

function App() {
  // Auto login for demo purposes
  useEffect(() => {
    document.title = 'VoteGroup';
  }, []);

  return (
    <AuthProvider>
      <GroupProvider>
        <FriendProvider>
          <ChatProvider>
            <NotificationProvider>
              <Router>
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  
                  <Route path="/" element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/groups" element={
                    <ProtectedRoute>
                      <GroupsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/groups/:groupId" element={
                    <ProtectedRoute>
                      <GroupDetailPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/groups/:groupId/chat" element={
                    <ProtectedRoute>
                      <GroupChatPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/groups/:groupId/create-poll" element={
                    <ProtectedRoute>
                      <CreatePollPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/create-poll" element={
                    <ProtectedRoute>
                      <CreatePollPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/polls/:pollId" element={
                    <ProtectedRoute>
                      <PollDetailPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/friends" element={
                    <ProtectedRoute>
                      <FriendsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  } />
                </Routes>
              </Router>
            </NotificationProvider>
          </ChatProvider>
        </FriendProvider>
      </GroupProvider>
    </AuthProvider>
  );
}

export default App;
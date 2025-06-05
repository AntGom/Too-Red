import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PublicLayout from "../components/layout/public/PublicLayout";
import Login from "../components/user/Login/Login";
import RecoverRequest from "../components/user/RecoverAccount/RecoverRequest.jsx";
import RecoverAccount from "../components/user/RecoverAccount/RecoverAccount.jsx";
import Register from "../components/user/Register/Register";
import ConfirmAccount from "../components/user/Register/ConfirmAccount";
import RecoverPassword from "../components/user/RecoverPassword";
import ResetPassword from "../components/user/ResetPassword";
import PrivateLayout from "../components/layout/private/PrivateLayout";
import Feed from "../components/publication/Feed";
import { AuthProvider } from "../context/AuthProvider";
import LogOut from "../components/user/LogOut";
import People from "../components/user/People";
import Config from "../components/user/EditProfile/Config";
import Following from "../components/follow/Following";
import Followers from "../components/follow/Followers.jsx";
import Profile from "../components/user/Profile/Profile.jsx";
import MyPublications from "../components/publication/MyPublications.jsx";
import ReportedPublications from "../components/publication/ReportedPublications/ReportedPublications.jsx";
import ReportedUsers from "../components/user/ReportedUsers.jsx";
import Chat from "../components/messages/Chat";
import { CountersProvider } from "../context/CountersContext.jsx";
import TaggedPublications from "../components/user/TaggedPublications.jsx";

const Routing = () => {
  return (
    <BrowserRouter>
      <CountersProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Login />} />
              <Route path="login" element={<Login />} />
              <Route path="/recover-request" element={<RecoverRequest />} />
              <Route path="/recover-account" element={<RecoverAccount />} />
              <Route path="register" element={<Register />} />
              <Route path="/confirm/:token" element={<ConfirmAccount />} />
              <Route path="recover-password" element={<RecoverPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
            </Route>

            <Route path="/social" element={<PrivateLayout />}>
              <Route index element={<Feed />} />
              <Route path="feed" element={<Feed />} />
              <Route path="logout" element={<LogOut />} />
              <Route path="people" element={<People />} />
              <Route path="config" element={<Config />} />
              <Route path="siguiendo/:userId" element={<Following />} />
              <Route path="seguidores/:userId" element={<Followers />} />
              <Route path="profile/:userId" element={<Profile />} />
              <Route path="publications/:userId" element={<MyPublications />} />
              <Route path="tagged/:userId" element={<TaggedPublications />} />
              <Route
                path="admin/reported-publications"
                element={<ReportedPublications />}
              />
              <Route path="admin/reported-users" element={<ReportedUsers />} />
              <Route path="messages" element={<Chat />} />
            </Route>

            <Route
              path="*"
              element={
                <>
                  <p>
                    <h1>Error 404 Page not found</h1>
                    <Link to="/">Volver al inicio</Link>
                  </p>
                </>
              }
            />
          </Routes>
        </AuthProvider>
      </CountersProvider>
    </BrowserRouter>
  );
};

export default Routing;

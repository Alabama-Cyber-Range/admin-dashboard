import { Routes, Route, Link, redirect, useNavigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from 'react';
import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import {
  ThemeProvider,
  Authenticator,
} from "@aws-amplify/ui-react";
import theme from "./theme";

import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Forms from "./pages/forms";
import EditForm from "./pages/forms/EditForm";

import AddSchoolForm from "./pages/forms/AddSchool";
import AddLearningPathForm from "./pages/forms/AddLearningPath";
import UpdateUserSchoolForm from "./pages/forms/UpdateUserSchool";
import UpdateLabSchoolForm from "./pages/forms/UpdateLabSchool";
import UpdateLabLearningPathForm from "./pages/forms/UpdateLabLearningPath";

import Modules from "./pages/modules";
import Users from "./pages/users";
import LearningPaths from "./pages/learningPaths";
import Schools from "./pages/schools";

import LearningPath from "./pages/learningPath";
import School from "./pages/school";
import User from "./pages/user";
import Module from "./pages/module";

import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import { AuthProvider } from './context/authContext';
import { fetchAuthSession } from "aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
      userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
      identityPoolId: import.meta.env.VITE_APP_IDENTITY_POOL_ID,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_APP_COGNITO_DOMAIN,
          scopes: [
            'phone',
            'email',
            'profile',
            'openid',
            'aws.cognito.signin.user.admin',
          ],
          redirectSignIn: [`${window.location.origin}/`],
          redirectSignOut: [window.location.origin],
          responseType: 'code' as const,
        },
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: import.meta.env.VITE_APP_GRAPHQL_API_URL,
      region: import.meta.env.VITE_APP_REGION,
      defaultAuthMode: 'userPool',
    }
  }

});

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { authStatus } = useAuthenticator();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // Add state for authorization

  useEffect(() => { // Use useEffect to call checkAuthAndGroup
    const check = async () => {
        const result = await checkAuthAndGroup();
        setIsAuthorized(result);
    }
    check();
  }, [authStatus]); // Run effect when authState changes

  const checkAuthAndGroup = async () => {
    try {
    const authSession = await fetchAuthSession();
    const groups = authSession.tokens?.idToken?.payload['cognito:groups'] as string[];
      const allowedGroups = ['admin'];

      if (!groups || !groups.some(group => allowedGroups.includes(group))) {
        signOut();
        navigate('/');
        return false;
      }
      return true;
    } catch (error) {
      navigate('/');
      return false;
    }
  };

  if (authStatus === 'authenticated' && isAuthorized === true) { // Check both authState and isAuthorized
    return <>{children}</>;
  } else if (authStatus === 'authenticated' && isAuthorized === null){
      return null;
  } else {
    return null; // Don't render anything if not authenticated or not authorized
  }
}

async function authLoader() {
  try {
    await getCurrentUser();
    return redirect('/');
  } catch (error) {
    return null;
  }
}

const formFields = {
  signIn: {
    username: {
      label: 'Email',
      placeholder: 'Enter your Email',
    },
  },
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Authenticator
          hideSignUp={true}
          formFields={formFields}
          // components={components}
          >
          <AuthProvider>
          <div>
            {/* Routes nest inside one another. Nested route paths build upon
                parent route paths, and nested route elements render inside
                parent route elements. See the note about <Outlet> below. */}
            <Routes>
              <Route path="/" element={<Layout />} loader={authLoader}>

                {/* <Route index element={<Dashboard />} loader={protectedLoader} /> */}
                <Route index element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
{/*
                <Route path="forms" element={<Forms />} loader={protectedLoader} />
                <Route path="edit-form" element={<EditForm />} loader={protectedLoader} />
                <Route path="add-school" element={<AddSchoolForm />} loader={protectedLoader} />
                <Route path="add-learning-path" element={<AddLearningPathForm />} loader={protectedLoader} />
                <Route path="update-user-school/:userId" element={<UpdateUserSchoolForm />} loader={protectedLoader} />
                <Route path="update-module-school/:moduleId" element={<UpdateLabSchoolForm />} loader={protectedLoader} />
                <Route path="update-module-learning-path/:moduleId" element={<UpdateLabLearningPathForm />} loader={protectedLoader} />

                <Route path="profile" element={<Profile />} loader={protectedLoader} />
                <Route path="modules" element={<Modules />} loader={protectedLoader} />
                <Route path="users" element={<Users />} loader={protectedLoader} />
                <Route path="learning-paths" element={<LearningPaths />} loader={protectedLoader} />
                <Route path="schools" element={<Schools />} loader={protectedLoader} />

                <Route path="modules/:moduleId" element={<Module />} loader={protectedLoader} />
                <Route path="users/:userId" element={<User />} loader={protectedLoader} />
                <Route path="learning-paths/:pathId" element={<LearningPath />} loader={protectedLoader} />
                <Route path="schools/:schoolId" element={<School />} loader={protectedLoader} /> */}

                {/* <Route path="*" element={<NoMatch />} loader={protectedLoader} /> */}
                <Route path="*" element={
                    <ProtectedRoute>
                      <NoMatch />
                    </ProtectedRoute>
                  } />
              </Route>
            </Routes>
          </div>
          </AuthProvider>
        </Authenticator>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
function signOut() {
  throw new Error("Function not implemented.");
}


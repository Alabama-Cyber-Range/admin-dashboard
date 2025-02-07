import { Routes, Route, Link, useNavigate } from "react-router-dom";
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

function ProtectedLayout({ children }: { children: ReactNode }) {
  const { authStatus } = useAuthenticator();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const result = await checkAuthAndGroup();
      setIsAuthorized(result);
      setIsLoading(false);
    };
    check();
  }, [authStatus]);

  const checkAuthAndGroup = async () => {
    try {
      const authSession = await fetchAuthSession();
      const groups = authSession.tokens?.idToken?.payload['cognito:groups'] as string[];
      const allowedGroups = ['admin'];

      if (!groups ||!groups.some(group => allowedGroups.includes(group))) {
        signOut(); // Make sure signOut is defined (even if it's a stub)
        navigate('/');
        return false;
      }
      return true;
    } catch (error) {
      navigate('/');
      return false;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (authStatus === 'authenticated' && isAuthorized === true) {
    return <Layout>{children}</Layout>; // Only render Layout when authorized
  } else {
    return null; // Don't render Layout if not authenticated or authorized
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
            <Routes>
              <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>}/>

              <Route path="forms" element={<ProtectedLayout><Forms /></ProtectedLayout>}/>
              <Route path="edit-form" element={<ProtectedLayout><EditForm /></ProtectedLayout>}/>
              <Route path="add-school" element={<ProtectedLayout><AddSchoolForm /></ProtectedLayout>}/>
              <Route path="add-learning-path" element={<ProtectedLayout><AddLearningPathForm /></ProtectedLayout>}/>
              <Route path="update-user-school/:userId" element={<ProtectedLayout><UpdateUserSchoolForm /></ProtectedLayout>}/>
              <Route path="update-module-school/:moduleId" element={<ProtectedLayout><UpdateLabSchoolForm /></ProtectedLayout>}/>
              <Route path="update-module-learning-path/:moduleId" element={<ProtectedLayout><UpdateLabLearningPathForm /></ProtectedLayout>}/>

              <Route path="profile" element={<ProtectedLayout><Profile /></ProtectedLayout>}/>
              <Route path="modules" element={<ProtectedLayout><Modules /></ProtectedLayout>}/>
              <Route path="users" element={<ProtectedLayout><Users /></ProtectedLayout>}/>
              <Route path="learning-paths" element={<ProtectedLayout><LearningPaths /></ProtectedLayout>}/>
              <Route path="schools" element={<ProtectedLayout><Schools /></ProtectedLayout>}/>

              <Route path="modules/:moduleId" element={<ProtectedLayout><Module /></ProtectedLayout>}/>
              <Route path="users/:userId" element={<ProtectedLayout><User /></ProtectedLayout>}/>
              <Route path="learning-paths/:pathId" element={<ProtectedLayout><LearningPath /></ProtectedLayout>}/>
              <Route path="schools/:schoolId" element={<ProtectedLayout><School /></ProtectedLayout>}/>

              <Route path="*" element={<ProtectedLayout><NoMatch /></ProtectedLayout>} />
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

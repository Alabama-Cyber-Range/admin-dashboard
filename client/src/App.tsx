import { Routes, Route, Link, redirect } from "react-router-dom";
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

import ModulesTable from "./components/Table/ModulesTable";
import UsersTable from "./components/Table/UsersTable";
import LearningPathsTable from "./components/Table/LearningPathsTable";
import SchoolsTable from "./components/Table/SchoolsTable";

import LearningPath from "./pages/learningPath";
import School from "./pages/school";
import User from "./pages/user";

import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import { AuthProvider } from './context/authContext';

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

async function protectedLoader() {
  try {
    await getCurrentUser();
    return null;
  } catch (error) {
    return redirect('/');
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
                <Route index element={<Dashboard />} loader={protectedLoader} />
                <Route path="forms" element={<Forms />} loader={protectedLoader} />
                <Route path="edit-form" element={<EditForm />} loader={protectedLoader} />
                <Route path="profile" element={<Profile />} loader={protectedLoader} />
                <Route path="modules" element={<ModulesTable />} loader={protectedLoader} />
                <Route path="users" element={<UsersTable />} loader={protectedLoader} />
                <Route path="learning-paths" element={<LearningPathsTable />} loader={protectedLoader} />
                <Route path="schools" element={<SchoolsTable />} loader={protectedLoader} />

                {/* <Route path="modules/:id" element={<ModulesTable />} loader={protectedLoader} /> */}
                {/* <Route path="users/:id" element={<UsersTable />} loader={protectedLoader} /> */}
                <Route path="learning-paths/:pathId" element={<LearningPath />} loader={protectedLoader} />
                <Route path="schools/:schoolId" element={<School />} loader={protectedLoader} />
                <Route path="users/:userId" element={<User />} loader={protectedLoader} />

                <Route path="*" element={<NoMatch />} loader={protectedLoader} />
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

import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { ConfigProvider } from "antd/lib";
import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { authProvider, dataProvider, liveProvider } from "./providers";
import { Home, ForgotPassword, Register, Login, CompanyPage } from "./pages";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp, theme } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
// import { authProvider } from "./authProvider";
import { ColorModeContextProvider } from "./contexts/color-mode";
import Layout from "./components/layout";
import { resources } from "./config/resources";
import CreateComapny from "./pages/Companies/create";
import CompanyEdit from "./pages/Companies/edit";
import TaskList from "./pages/Tasks/list";
import { TasksCreatePage } from "./pages/Tasks/creates";
import TaskEditPage from "./pages/Tasks/edit";
import CalenderPage from "./pages/CalendarPage";
const API_URL = "https://your-graphql-url/graphql";

// const client = new GraphQLClient(API_URL);
// const gqlDataProvider = dataProvider(client);

function App() {
  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <AntdApp>
          <DevtoolsProvider>
            <ConfigProvider
              theme={{
                // 1. Use dark algorithm
                algorithm: theme.darkAlgorithm,
              }}
            >
              <Refine
                dataProvider={dataProvider}
                liveProvider={liveProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                resources={resources}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "REpzas-wwicrS-QfRw4X",
                }}
              >
                <Routes>
                  {/* <Route index element={<WelcomePage />} /> */}
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-layout"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <Layout>
                          <Outlet />
                        </Layout>
                      </Authenticated>
                    }
                  >
                    <Route index element={<Home />} />
                    <Route path="/calendar" element={<CalenderPage />} />
                    <Route path="/companies">
                      <Route index element={<CompanyPage />} />
                      <Route
                        path="/companies/new"
                        element={<CreateComapny />}
                      />
                      <Route
                        path="/companies/edit/:id"
                        element={<CompanyEdit />}
                      />
                    </Route>
                    {/* <Route"> */}
                    <Route
                      path="/tasks"
                      element={
                        <TaskList>
                          <Outlet />
                        </TaskList>
                      }
                    />
                    <Route path="/tasks/new" element={<TasksCreatePage />} />
                    <Route path="/tasks/edit/:id" element={<TaskEditPage />} />
                  </Route>
                  
                  {/* </Route> */}
                </Routes>
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
            </ConfigProvider>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;

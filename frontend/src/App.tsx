import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import { Toaster } from 'sonner';
import { Dashboard } from './pages/Dashboard';
import { CreateRequestType } from './pages/CreateRequestType';
import { EditRequestType } from './pages/EditRequestType';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          fontSize: 14,
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateRequestType />} />
            <Route path="/edit/:id" element={<EditRequestType />} />
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;

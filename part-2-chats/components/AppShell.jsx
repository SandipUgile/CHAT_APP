import { Outlet } from 'react-router-dom';
import LeftPanel from './LeftPanel';

const AppShell = () => (
  <div className="app-shell">
    <div className="left-panel">
      <LeftPanel />
    </div>
    <div className="right-panel">
      <Outlet />
    </div>
  </div>
);

export default AppShell;

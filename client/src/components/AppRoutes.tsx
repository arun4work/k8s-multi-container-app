import { Route, Routes } from 'react-router-dom';
import Layout from '../Layout';
import Fib from './Fib';
import OtherPage from './OtherPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Fib />} />
        <Route path="other" element={<OtherPage />} />
      </Route>
    </Routes>
  );
}

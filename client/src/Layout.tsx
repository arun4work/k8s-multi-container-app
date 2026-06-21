// import { useQuery } from '@tanstack/react-query';
// import { valueQueries } from './api/queries';
import styled from '@emotion/styled';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';

const MainContent = styled.main`
  padding: 2rem;
  min-height: calc(100vh - 140px);
  background-color: #f9fafb;
`;

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Layout() {
  // const { data, isPending, error } = useQuery(valueQueries.healthCheck());

  // if (isPending) return <span>Loading...</span>;
  // if (error) return <span>Error: {error.message}</span>;
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
}

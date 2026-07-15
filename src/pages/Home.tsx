import React from 'react';
import { Hero } from '../components/home/Hero';
import { PageTransition } from '../components/layout/PageTransition';

export const Home: React.FC = () => {
  return (
    <PageTransition className="home-page">
      <Hero />
    </PageTransition>
  );
};

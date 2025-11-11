import React from 'react';
import Sidebar from '../components/Sidebar';

function Home() {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Dobrodošli u Event Planner</h1>
      <p className="lead text-center">
        Ovo je početna stranica React aplikacije.
      </p>
      <div className="text-center mt-4">
        <button className="btn btn-primary">Klikni me</button>
      </div>
    </div>
  );
}

export default Home;

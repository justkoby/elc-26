import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Partners from './components/Partners';
import InfoBar from './components/InfoBar';
import GalleryStrip from './components/GalleryStrip';
import About from './components/About';
import CohortStatement from './components/CohortStatement';
import Programme from './components/Programme';
import Tracks from './components/Tracks';
import Assembly from './components/Assembly';
import Who from './components/Who';
import Ambassadors from './components/Ambassadors';
import FAQ from './components/FAQ';
import Register from './components/Register';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <Partners />
      <InfoBar />
      <GalleryStrip />
      <About />
      <CohortStatement />
      <Programme />
      <Tracks />
      <Assembly />
      <Who />
      <Ambassadors />
      <FAQ />
      <Register />
      <Footer />
    </div>
  );
}

export default App;

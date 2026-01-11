import Hero from "../components/HeroSection";
import Nav from "../components/Navbar";
import HomeVideo from "../components/HomeVideo";
import About from "../components/AboutSection";
import Houses from "../components/Houses";
import Events from "../components/Events";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";
import Popup from "../components/Popup";
import Scoreboard from "./Scoreboard";
import ComingSoon from "../components/ComingSoon";

export default function Home() {
  return (
    <div>
      <Nav />
      <Hero />
      <About />
      <Houses />
      <Events />
      <Gallery />
      <Footer />
      <Popup />
      {/* <ComingSoon /> */}
    </div>
  );
}

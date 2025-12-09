import Hero from "../components/HeroSection";
import Nav from "../components/Navbar";
import HomeVideo from "../components/HomeVideo";
import About from "../components/AboutSection";
import Houses from "../components/Houses";
import Events from "../components/Events";

export default function Home() {
  return (
    <div>
      <Nav />
      <Hero />
      

      {/* Hide on mobile, show only on sm and above */}
      {/* <div className="hidden sm:block">
        <HomeVideo />
      </div> */}
      <About />
      <Houses />
      <Events />
    </div>
  );
}

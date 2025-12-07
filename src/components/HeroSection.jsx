import { FiChevronDown } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative w-full h-screen bg-primary flex items-center justify-center text-center">
    <h1 className="
      absolute inset-0 flex items-center justify-center
      font-mont text-white z-30
      text-[9vw]
      md:text-[11vw]
      xl:text-[13vw]
      tracking-tight
      leading-none
    ">
      BHARATHAM26
    </h1>


      <img
        src='images/hero.jpg'
        alt="Hero"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-auto h-auto z-20"
      />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream z-30">
        <span className="tracking-[0.15em] uppercase font-opensans text-base md:text-lg">
          Scroll
        </span>
        <FiChevronDown className="text-3xl animate-bounce" />
      </div>
    </section>
  );
}

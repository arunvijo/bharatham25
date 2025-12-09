export default function About() {
  return (
    <section className="w-full px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

<div className="relative w-[70%] mx-auto">
  {/* FLORAL – stuck to left side of main image */}
<img
  src="/images/floral.png"
  alt=""
  className="
    absolute 
    top-1/2 -translate-y-1/2 
    left-0 -translate-x-full
    w-[80px] sm:w-[140px] lg:w-[180px]
    pointer-events-none
    z-[20]
  "
/>


  {/* SHADOW (responsive diagonal offset) */}
  <img
    src="/images/combined.png"
    alt=""
    className="
      absolute top-0 left-0 

      translate-x-[10px] translate-y-[8px]
      sm:translate-x-[14px] sm:translate-y-[12px]
      lg:translate-x-[20px] lg:translate-y-[18px]

      brightness-0
      w-full h-auto object-cover
      pointer-events-none
    "
  />

  {/* REAL IMAGE with border */}
  <img
    src="/images/combined.png"
    alt="About Bharatham"
    className="
      relative w-full h-auto object-cover
      border-[6px] border-black
    "
  />
</div>


        {/* RIGHT — TEXT */}
        <div className="flex flex-col">
        <h2
        className="font-mont text-5xl md:text-6xl font-bold text-black mb-8 text-left 
                    [text-shadow:_4px_4px_0_#F4F437]"
        >
        ABOUT<br/>BHARATHAM
        </h2>


          <p className="font-opensans text-black text-lg leading-relaxed text-left md:text-left">
            Bharatham is the annual cultural extravaganza of Rajagiri School of Engineering and Technology, where students represent their houses <b> — Mughals, Rajputs, Spartans, Vikings, and Aryans —</b> and compete across music, dance, theatre, and other cultural events. It’s a <b>celebration of talent, unity, and vibrant campus spirit.</b>
          </p>
        </div>

      </div>
    </section>
  );
}

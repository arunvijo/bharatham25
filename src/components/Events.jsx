export default function Events() {
  const events = [
    { title: "Pre Events", img: "/images/events/pre events.png" },
    { title: "Group Events", img: "/images/events/group.png" },
    { title: "Combined Events", img: "/images/events/combined.png" },
    { title: "Individual Events", img: "/images/events/individual.png" },
  ];

  return (
    <section className="w-full bg-white">
      {/* PARTITION SVG AT TOP */}
      <div className="w-full">
        <img
          src="/images/partition.svg"
          alt=""
          className="w-full h-auto"
        />
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* EVENTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
          {events.map((event) => (
            <div
              key={event.title}
              className="flex flex-col items-center text-center"
            >
              {/* IMAGE */}
              <img
                src={event.img}
                alt={event.title}
                className="w-full h-auto"
              />

              {/* TITLE */}
              <h3 className="mt-6 font-mont text-2xl text-primary">
                {event.title}
              </h3>

              {/* EXPLORE BUTTON */}
              <button
                className="
                  relative mt-6
                  w-[130px]
                  sm:w-[150px]
                  aspect-[169/45]
                  group cursor-pointer select-none
                "
              >
                {/* SHADOW */}
                <img
                  src="/images/loginbtn.svg"
                  alt=""
                  className="
                    absolute inset-0 w-full h-full
                    translate-x-[6px] translate-y-[4px]
                    brightness-0
                    pointer-events-none
                  "
                />

                {/* BUTTON SVG */}
                <svg
                  className="
                    absolute inset-0 w-full h-full
                    transition-transform duration-200
                    group-hover:translate-x-[6px]
                    group-hover:translate-y-[4px]
                  "
                  viewBox="0 0 169 45"
                >
                  <path
                    className="transition-colors duration-200 fill-yellow"
                    d="M11.3188 33.8038C4.7163 33.8038 11.4732 25.4955 1.31175 22.6755C0.906093 22.5634 0.886183 22.4512 1.31175 22.3379C11.6051 19.6189 4.71132 11.1962 11.3188 11.1962C11.3188 5.56528 20.9228 1 32.769 1L133.726 1C145.572 1 155.176 5.56528 155.176 11.1962C163.593 11.1962 161.224 17.7435 167.901 22.3648C168.038 22.4602 168.028 22.5544 167.901 22.6497C161.557 27.3709 163.586 33.8038 155.176 33.8038C155.176 39.4347 145.572 44 133.726 44L32.769 44C20.9228 44 11.3188 39.4347 11.3188 33.8038Z"
                    stroke="#271811"
                    strokeWidth="2"
                  />
                </svg>

                {/* TEXT */}
                <span
                  className="
                    absolute inset-0 flex items-center justify-center
                    transition-transform duration-200
                    group-hover:translate-x-[6px]
                    group-hover:translate-y-[4px]
                    font-mont text-sm md:text-base
                    tracking-wide text-black
                    pointer-events-none
                  "
                >
                  EXPLORE
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

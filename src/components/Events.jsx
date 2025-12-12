import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Events() {
  const navigate = useNavigate();

  const events = [
    { title: "Pre Events", img: "/images/events/pre-events.svg", category: "PRE EVENTS" },
    { title: "Group Events", img: "/images/events/group.svg", category: "GROUP EVENTS" },
    { title: "Combined Events", img: "/images/events/combined.svg", category: "COMBINED EVENTS" },
    { title: "Individual Events", img: "/images/events/individual.svg", category: "INDIVIDUAL EVENTS" },
  ];

  const handleExplore = (category) => {
    navigate('/events', { state: { category } });
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 15 },
    },
  };

  return (
    <section className="relative w-full bg-[#FDFBF7] text-stone-900 overflow-hidden">
      
      {/* Background Pattern (Mandala Texture) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(circle, #D97706 1px, transparent 1px)`, 
          backgroundSize: '30px 30px' 
        }}
      />

      {/* PARTITION SVG AT TOP */}
      <div className="w-full relative z-10 -mt-1">
        <img
          src="/images/partition.svg"
          alt=""
          className="w-full h-auto"
        />
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-desi-saffron font-bold tracking-[0.3em] text-sm uppercase block mb-2">
              Competitions
            </span>
            <h2 className="font-qawatone text-5xl md:text-7xl text-black">
              MAIN EVENTS
            </h2>
            <div className="w-24 h-1 bg-desi-saffron mx-auto mt-4 rounded-full"></div>
          </motion.div>
        </div>

        {/* EVENTS GRID */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              variants={cardVariants}
              className="flex flex-col items-center text-center group"
            >
              {/* IMAGE CONTAINER */}
              <div
                className="relative w-full overflow-visible
                          max-h-[360px] sm:max-h-[420px] md:max-h-[520px]
                          transition-transform duration-700 ease-in-out group-hover:scale-[1.06]"
              >
                <img
                  src={event.img}
                  alt={event.title}
                  className="w-full h-full object-contain"
                  style={{ display: "block" }}
                />
              </div>


              {/* TITLE */}
              <h3 className="mt-6 font-qawatone text-3xl text-black group-hover:text-desi-saffron transition-colors duration-300">
                {event.title}
              </h3>

              {/* EXPLORE BUTTON */}
<button
  onClick={() => handleExplore(event.category)}
  className="
    relative mt-4 
    w-[140px] md:w-[160px] 
    aspect-[169/58] 
    group/explore 
    cursor-pointer select-none
  "
>
  {/* SHADOW — must move FARTHER (same as login button) */}
  <img
    src="/images/loginbtn.svg"
    alt=""
    className="
      absolute inset-0 w-full h-full
      translate-x-[4px] translate-y-[3px]
      brightness-0 saturate-[1000%]
      pointer-events-none
    "
  />

  {/* MAIN BUTTON — moves slightly (covers shadow!) */}
  <svg
    className="
      absolute inset-0 w-full h-full
      transition-transform duration-200 ease-out
      group-hover/explore:translate-x-[4px]
      group-hover/explore:translate-y-[3px]
    "
    viewBox="0 0 169 45"
  >
    <path
      className="transition-colors duration-200 fill-yellow group-hover/explore:fill-desi-saffron"
      d="M11.3188 33.8038C4.7163 33.8038 11.4732 25.4955 1.31175 22.6755C0.906093 22.5634 0.886183 22.4512 1.31175 22.3379C11.6051 19.6189 4.71132 11.1962 11.3188 11.1962C11.3188 5.56528 20.9228 1 32.769 1L133.726 1C145.572 1 155.176 5.56528 155.176 11.1962C163.593 11.1962 161.224 17.7435 167.901 22.3648C168.038 22.4602 168.028 22.5544 167.901 22.6497C161.557 27.3709 163.586 33.8038 155.176 33.8038C155.176 39.4347 145.572 44 133.726 44L32.769 44C20.9228 44 11.3188 39.4347 11.3188 33.8038Z"
      stroke="#271811"
      strokeWidth="2"
    />
  </svg>

  {/* TEXT — must follow the main button */}
  <div
    className="
      absolute inset-0 flex items-center justify-center
      transition-transform duration-200 ease-out
      group-hover/explore:translate-x-[4px]
      group-hover/explore:translate-y-[3px]
      pointer-events-none
    "
  >
    <span className="font-mont text-m font-bold tracking-widest text-black">
      EXPLORE
    </span>
  </div>
</button>



            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* BOTTOM DECORATIVE SVG */}
      <div className="w-full relative z-10 translate-y-1">
        <svg 
          width="1440" height="31" viewBox="0 0 1440 31" 
          className="w-full h-auto rotate-180 block fill-primary"
          preserveAspectRatio="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1413.44 -47C1434.74 -46.9998 1452 -29.7345 1452 -8.4375C1452 12.8594 1434.74 30.1239 1413.44 30.124C1399.55 30.124 1387.37 22.7776 1380.58 11.7578C1379.02 9.22376 1373.98 9.22376 1372.42 11.7578C1365.63 22.7776 1353.45 30.124 1339.56 30.124C1325.9 30.1239 1313.89 23.0145 1307.04 12.293C1305.56 9.96679 1301.44 9.96679 1299.96 12.293C1293.11 23.0145 1281.1 30.1239 1267.44 30.124C1253.55 30.124 1241.37 22.7776 1234.58 11.7578C1233.02 9.22376 1227.98 9.22376 1226.42 11.7578C1219.63 22.7776 1207.45 30.124 1193.56 30.124C1179.9 30.1239 1167.89 23.0145 1161.04 12.293C1159.56 9.96679 1155.44 9.96679 1153.96 12.293C1147.11 23.0145 1135.1 30.1239 1121.44 30.124C1107.55 30.124 1095.37 22.7776 1088.58 11.7578C1087.02 9.22376 1081.98 9.22376 1080.42 11.7578C1073.63 22.7776 1061.45 30.124 1047.56 30.124C1033.9 30.1239 1021.89 23.0145 1015.04 12.293C1013.56 9.96679 1009.44 9.96679 1007.96 12.293C1001.11 23.0145 989.104 30.1239 975.438 30.124C961.546 30.124 949.371 22.7776 942.584 11.7578C941.023 9.22376 935.977 9.22376 934.416 11.7578C927.629 22.7776 915.454 30.124 901.562 30.124C887.756 30.1239 875.645 22.8695 868.833 11.9648C867.309 9.52594 862.749 9.53355 861.233 11.9775C854.435 22.9438 842.29 30.2479 828.438 30.248C814.546 30.248 802.371 22.9016 795.584 11.8818C794.023 9.34778 788.977 9.34778 787.416 11.8818C780.629 22.9016 768.454 30.248 754.562 30.248C738.975 30.2479 725.551 21.0004 719.471 7.69336C713.364 20.9334 699.976 30.1239 684.438 30.124C670.546 30.124 658.371 22.7776 651.584 11.7578C650.023 9.22376 644.977 9.22376 643.416 11.7578C636.629 22.7776 624.454 30.124 610.562 30.124C596.896 30.1239 584.892 23.0145 578.044 12.293C576.558 9.96679 572.442 9.96679 570.956 12.293C564.108 23.0145 552.104 30.1239 538.438 30.124C524.546 30.124 512.371 22.7776 505.584 11.7578C504.023 9.22376 498.977 9.22376 497.416 11.7578C490.629 22.7776 478.454 30.124 464.562 30.124C450.896 30.1239 438.892 23.0145 432.044 12.293C430.558 9.96679 426.442 9.96679 424.956 12.293C418.108 23.0145 406.104 30.1239 392.438 30.124C378.546 30.124 366.371 22.7776 359.584 11.7578C358.023 9.22376 352.977 9.22376 351.416 11.7578C344.629 22.7776 332.454 30.124 318.562 30.124C304.896 30.1239 292.892 23.0145 286.044 12.293C284.558 9.96679 280.442 9.96679 278.956 12.293C272.108 23.0145 260.104 30.1239 246.438 30.124C232.546 30.124 220.371 22.7776 213.584 11.7578C212.023 9.22376 206.977 9.22376 205.416 11.7578C198.629 22.7776 186.454 30.124 172.562 30.124C158.756 30.1239 146.645 22.8695 139.833 11.9648C138.309 9.52594 133.749 9.53355 132.233 11.9775C125.435 22.9438 113.29 30.2479 99.4385 30.248C85.5463 30.248 73.3713 22.9016 66.584 11.8818C65.0232 9.34778 59.9768 9.34778 58.416 11.8818C51.6287 22.9016 39.4537 30.248 25.5615 30.248C4.26465 30.2479 -12.9998 12.9834 -13 -8.31348C-13 -29.6105 4.26455 -46.8758 25.5615 -46.876C39.4538 -46.876 51.6287 -39.5288 58.416 -28.5088C59.9768 -25.975 65.0232 -25.975 66.584 -28.5088C73.3713 -39.5288 85.5462 -46.876 99.4385 -46.876C113.243 -46.8759 125.354 -39.6214 132.166 -28.7168C133.69 -26.2777 138.25 -26.2852 139.766 -28.7295C146.565 -39.6959 158.71 -46.9999 172.562 -47C186.454 -47 198.629 -39.6528 205.416 -28.6328C206.977 -26.099 212.023 -26.099 213.584 -28.6328C220.371 -39.6528 232.546 -47 246.438 -47C260.104 -46.9999 272.108 -39.8898 278.956 -29.168C280.442 -26.8419 284.558 -26.8419 286.044 -29.168C292.892 -39.8898 304.896 -46.9999 318.562 -47C332.454 -47 344.629 -39.6528 351.416 -28.6328C352.977 -26.099 358.023 -26.099 359.584 -28.6328C366.371 -39.6528 378.546 -47 392.438 -47C406.104 -46.9999 418.108 -39.8898 424.956 -29.168C426.442 -26.8419 430.558 -26.8419 432.044 -29.168C438.892 -39.8898 450.896 -46.9999 464.562 -47C478.454 -47 490.629 -39.6528 497.416 -28.6328C498.977 -26.099 504.023 -26.099 505.584 -28.6328C512.371 -39.6528 524.546 -47 538.438 -47C552.104 -46.9999 564.108 -39.8898 570.956 -29.168C572.442 -26.8419 576.558 -26.8419 578.044 -29.168C584.892 -39.8898 596.896 -46.9999 610.562 -47C624.454 -47 636.629 -39.6528 643.416 -28.6328C644.977 -26.099 650.023 -26.099 651.584 -28.6328C658.371 -39.6528 670.546 -47 684.438 -47C700.024 -46.9999 713.448 -37.7526 719.528 -24.4463C725.635 -37.6861 739.025 -46.8759 754.562 -46.876C768.454 -46.876 780.629 -39.5288 787.416 -28.5088C788.977 -25.975 794.023 -25.975 795.584 -28.5088C802.371 -39.5288 814.546 -46.876 828.438 -46.876C842.243 -46.8759 854.354 -39.6214 861.166 -28.7168C862.69 -26.2777 867.25 -26.2852 868.766 -28.7295C875.565 -39.6959 887.71 -46.9999 901.562 -47C915.454 -47 927.629 -39.6528 934.416 -28.6328C935.977 -26.099 941.023 -26.099 942.584 -28.6328C949.371 -39.6528 961.546 -47 975.438 -47C989.104 -46.9999 1001.11 -39.8898 1007.96 -29.168C1009.44 -26.8419 1013.56 -26.8419 1015.04 -29.168C1021.89 -39.8898 1033.9 -46.9999 1047.56 -47C1061.45 -47 1073.63 -39.6528 1080.42 -28.6328C1081.98 -26.099 1087.02 -26.099 1088.58 -28.6328C1095.37 -39.6528 1107.55 -47 1121.44 -47C1135.1 -46.9999 1147.11 -39.8898 1153.96 -29.168C1155.44 -26.8419 1159.56 -26.8419 1161.04 -29.168C1167.89 -39.8898 1179.9 -46.9999 1193.56 -47C1207.45 -47 1219.63 -39.6528 1226.42 -28.6328C1227.98 -26.099 1233.02 -26.099 1234.58 -28.6328C1241.37 -39.6528 1253.55 -47 1267.44 -47C1281.1 -46.9999 1293.11 -39.8898 1299.96 -29.168C1301.44 -26.8419 1305.56 -26.8419 1307.04 -29.168C1313.89 -39.8898 1325.9 -46.9999 1339.56 -47C1353.45 -47 1365.63 -39.6528 1372.42 -28.6328C1373.98 -26.099 1379.02 -26.099 1380.58 -28.6328C1387.37 -39.6528 1399.55 -47 1413.44 -47Z" />
        </svg>
      </div>

    </section>
  );
}
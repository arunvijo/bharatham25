import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Credits() {
    const navigate = useNavigate();

  const credits = {
    developers: [
      "Arun Vijo Tharakan",
      "Abhishikth S Mattom",
    ],
    designers: [
      "Abhishikth S Mattom",
      "Mevin Manuel",
      "Nitika Ann Jacob",
    ],
    illustrators: [
      "Sutheerth A",
      "Abhinav S",
      "Angel Rodrigues",
      "Neha Benny",
      "Aryasree Nambiar",
      "Alna Jaison",
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
          <div className="fixed top-2 right-0 z-[60] px-6 sm:px-10 md:px-12">
          <button
              onClick={() => navigate(-1)}
              className="group relative cursor-pointer select-none"
              title="Go Back"
          >
              {/* SVG Button Container */}
              <div className="relative w-[120px] md:w-[140px] aspect-[169/58]">
                  
                  {/* Shadow/Base Image */}
                  <img 
                      src="/images/loginbtn.svg" 
                      alt="" 
                      className="absolute inset-0 w-full h-full translate-x-[4px] translate-y-[3px] pointer-events-none brightness-0 saturate-[1000%] transition-transform duration-200" 
                  />
                  
                  {/* Main SVG Shape */}
                  <svg 
                      className="absolute inset-0 w-full h-full transition-transform duration-200 group-hover:translate-x-[4px] group-hover:translate-y-[3px]" 
                      viewBox="0 0 169 45"
                  >
                      <path 
                          className="transition-colors duration-200 fill-[#FDFBF7] group-hover:fill-yellow" 
                          d="M11.3188 33.8038C4.7163 33.8038 11.4732 25.4955 1.31175 22.6755C0.906093 22.5634 0.886183 22.4512 1.31175 22.3379C11.6051 19.6189 4.71132 11.1962 11.3188 11.1962C11.3188 5.56528 20.9228 1 32.769 1L133.726 1C145.572 1 155.176 5.56528 155.176 11.1962C163.593 11.1962 161.224 17.7435 167.901 22.3648C168.038 22.4602 168.028 22.5544 167.901 22.6497C161.557 27.3709 163.586 33.8038 155.176 33.8038C155.176 39.4347 145.572 44 133.726 44L32.769 44C20.9228 44 11.3188 39.4347 11.3188 33.8038Z" 
                          stroke="#271811" 
                          strokeWidth="2" 
                      />
                  </svg>
                  
                  {/* Text Label */}
                  <div className="absolute inset-0 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-[4px] group-hover:translate-y-[3px]">
                      <span className="font-mont text-xs sm:text-sm md:text-lg font-bold tracking-wide text-black group-hover:text-black pointer-events-none">
                          GO BACK
                      </span>
                  </div>
              </div>
          </button>
      </div>
      <div className="min-h-screen bg-cream text-black relative overflow-hidden py-16 md:py-24">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: `radial-gradient(circle, #D97706 1px, transparent 1px)`, 
            backgroundSize: '30px 30px' 
          }}
        />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          
          {/* Page Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 md:mb-24"
          >
            <span className="text-[#D97706] font-bold tracking-[0.3em] text-xs sm:text-sm uppercase block mb-2">
              The Website Team
            </span>
            <h1 className="font-qawatone text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-stone-900">
              CREDITS
            </h1>
            <div className="w-24 h-1 bg-[#D97706] mx-auto mt-4 rounded-full"></div>
          </motion.div>

          {/* DEVELOPERS SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 md:mb-20"
          >
            <div className="text-center mb-8 md:mb-12">
              <span className="text-[#D97706] font-bold tracking-[0.3em] text-xs sm:text-sm uppercase block mb-2">
                The Builders
              </span>
              <h2 className="font-qawatone text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-stone-900">
                DEVELOPERS
              </h2>
              <div className="w-24 h-1 bg-[#D97706] mx-auto mt-4 rounded-full"></div>
            </div>

            <motion.div 
              className="flex flex-wrap justify-center items-center gap-4 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {credits.developers.map((name, index) => (
                <motion.div
                  key={`${name}-${index}`}
                  variants={itemVariants}
                  className="bg-white border-4 border-black px-6 py-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <span className="font-mont font-semibold text-lg text-black whitespace-nowrap">
                    {name}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Spinner after Developers */}
            <div className="flex justify-center mt-12">
              <img 
                src="/images/spinner.svg" 
                alt="Spinner" 
                className="h-16 w-16 sm:h-20 sm:w-20 animate-spinSlow"
              />
            </div>
          </motion.div>

          {/* DESIGNERS SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 md:mb-20"
          >
            <div className="text-center mb-8 md:mb-12">
              <span className="text-[#D97706] font-bold tracking-[0.3em] text-xs sm:text-sm uppercase block mb-2">
                The Visionaries
              </span>
              <h2 className="font-qawatone text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-stone-900">
                DESIGNERS
              </h2>
              <div className="w-24 h-1 bg-[#D97706] mx-auto mt-4 rounded-full"></div>
            </div>

            <motion.div 
              className="flex flex-wrap justify-center items-center gap-4 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {credits.designers.map((name, index) => (
                <motion.div
                  key={`${name}-${index}`}
                  variants={itemVariants}
                  className="bg-white border-4 border-black px-6 py-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <span className="font-mont font-semibold text-lg text-black whitespace-nowrap">
                    {name}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Spinner after Designers */}
            <div className="flex justify-center mt-12">
              <img 
                src="/images/spinner.svg" 
                alt="Spinner" 
                className="h-16 w-16 sm:h-20 sm:w-20 animate-spinSlow"
              />
            </div>
          </motion.div>

          {/* ILLUSTRATORS SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-8 md:mb-12">
              <span className="text-[#D97706] font-bold tracking-[0.3em] text-xs sm:text-sm uppercase block mb-2">
                The Artists
              </span>
              <h2 className="font-qawatone text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-stone-900">
                ILLUSTRATORS
              </h2>
              <div className="w-24 h-1 bg-[#D97706] mx-auto mt-4 rounded-full"></div>
            </div>

            <motion.div 
              className="flex flex-wrap justify-center items-center gap-4 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {credits.illustrators.map((name, index) => (
                <motion.div
                  key={`${name}-${index}`}
                  variants={itemVariants}
                  className="bg-white border-4 border-black px-6 py-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <span className="font-mont font-semibold text-lg text-black whitespace-nowrap">
                    {name}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Final Spinner */}
            <div className="flex justify-center mt-12">
              <img 
                src="/images/spinner.svg" 
                alt="Spinner" 
                className="h-16 w-16 sm:h-20 sm:w-20 animate-spinSlow"
              />
            </div>
          </motion.div>

          {/* Footer Message */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-center mt-16 md:mt-24"
          >
            <p className="font-opensans text-stone-600 text-lg md:text-xl italic">
              Made with ❤️ for Bharatham'26
            </p>
          </motion.div>

        </div>
      </div>
        <Footer />
    </>
  );
}
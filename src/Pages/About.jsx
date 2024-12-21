import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const About = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  const credits = {
    developers: [
      { name: "John Neil Tamondong", role: "Lead Developer" },
      { name: "Jecho Torrefranca", role: "Developer" },
      { name: "Rafael Ramos", role: "Developer" },
      { name: "Miko Calderon", role: "Developer" },      
    ],
    assets: [
      { name: "Medieval Fantasy Music Pack", author: "Epic Sound Studios", license: "Commercial License" },
      { name: "Fantasy Character Assets", author: "Digital Art Foundry", license: "CC BY 4.0" },
      { name: "Environmental Art Pack", author: "Mystic Games", license: "Purchased License" }
    ],
    specialThanks: [
      "Our amazing community of beta testers",
      "The Fantasy Game Dev Discord",
      "Our supportive families"
    ]
  };

  return (
    <motion.div
      className="min-h-screen w-screen flex flex-col relative bg-black"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black/90" />

      {/* Content Container */}
      <motion.div 
        className="relative z-10 max-w-4xl mx-auto w-full px-4 py-12 text-white"
        variants={contentVariants}
      >
        {/* Header */}
        <h1 className="font-breatheFire text-5xl md:text-7xl text-center mb-12 gradient-text">
          The Path Unfolds
        </h1>

        {/* Credits Sections */}
        <div className="space-y-12">
          {/* Development Team */}
          <section className="space-y-4">
            <h2 className="font-morris text-3xl md:text-4xl mb-6 text-purple-300">Development Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {credits.developers.map((dev, index) => (
                <div key={index} className="bg-purple-900/30 p-4 rounded-lg backdrop-blur-sm">
                  <h3 className="font-morris text-xl text-purple-200">{dev.name}</h3>
                  <p className="text-gray-300">{dev.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Assets & Resources */}
          <section className="space-y-4">
            <h2 className="font-morris text-3xl md:text-4xl mb-6 text-purple-300">Assets & Resources</h2>
            <div className="space-y-4">
              {credits.assets.map((asset, index) => (
                <div key={index} className="bg-purple-900/30 p-4 rounded-lg backdrop-blur-sm">
                  <h3 className="font-morris text-xl text-purple-200">{asset.name}</h3>
                  <p className="text-gray-300">By {asset.author}</p>
                  <p className="text-gray-400 text-sm">{asset.license}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Special Thanks */}
          <section className="space-y-4">
            <h2 className="font-morris text-3xl md:text-4xl mb-6 text-purple-300">Special Thanks</h2>
            <div className="bg-purple-900/30 p-6 rounded-lg backdrop-blur-sm">
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {credits.specialThanks.map((thanks, index) => (
                  <li key={index}>{thanks}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Back Button */}
        <Link to="/">
          <motion.button
            className="fixed bottom-8 right-8 py-4 px-8 text-white rounded-full group overflow-hidden flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative text-2xl font-morris z-10">Back to Title</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent to-[#8a6fff] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default About;
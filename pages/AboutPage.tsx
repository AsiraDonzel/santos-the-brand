import React, { useRef, useState, useEffect } from 'react';
import { motion, animate } from 'framer-motion';
import TextReveal from '../components/TextReveal';
import PageTransition from '../components/PageTransition';
import SpotlightEffect from '../components/SpotlightEffect';

const VALUES = [
  {
    title: "Grace & Grit",
    description: "SANTOS is built on the belief that grace gives purpose, but grit sustains growth. We honor the balance between humility and hard work.",
    tagline: "“Grace made me, grit kept me.”"
  },
  {
    title: "Purpose-Driven Identity",
    description: "Every piece tells a story. SANTOS designs with meaning, ensuring that fashion is not just worn, but felt."
  },
  {
    title: "Resilience & Growth",
    description: "SANTOS celebrates transformation. We stand for those who rise despite imperfections, obstacles, or setbacks."
  },
  {
    title: "Community & Unity",
    description: "More than a brand, SANTOS is a movement. We create spaces where creatives, athletes, and dreamers feel seen and empowered."
  },
  {
    title: "Cultural Authenticity",
    description: "Rooted in Nigeria and connected to the world, SANTOS honors culture, heritage, and global expression."
  },
  {
    title: "Inclusivity & Expression",
    description: "SANTOS is not for everyone. We have a culture ."
  },
  {
    title: "Creative Excellence",
    description: "From concept to execution, SANTOS values originality and innovation. Each collection challenges norms and elevates confidence."
  },
  {
    title: "Impact Beyond Fashion",
    description: "We measure success by influence. Through charity and showcases, we use fashion as a platform for social impact."
  }
];

// Double the array for a seamless infinite loop
const INFINITE_VALUES = [...VALUES, ...VALUES];

const AboutPage = () => {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    // We animate to -50% because the list is doubled. 
    // Once it reaches -50%, it looks exactly like 0%, allowing a seamless loop.
    const controls = animate(0, -50, {
      duration: 40, // Adjust for speed
      ease: "linear",
      repeat: Infinity,
      onUpdate: (latest) => setPosition(latest),
    });
    return () => controls.stop();
  }, []);

  return (
    <PageTransition>
      <div className="bg-white min-h-screen pt-28 lg:pt-36">

        {/* --- SECTION 1: HERO SPLIT --- */}
        <div className="flex flex-col lg:flex-row lg:min-h-[calc(100vh-10rem)] max-w-[1440px] mx-auto px-6 lg:px-12 gap-8 lg:gap-12 pb-12">
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24 bg-stone-50 rounded-sm">
            <div className="max-w-xl">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs font-bold uppercase tracking-[0.3em] text-primary-500 mb-6 block"
              >
                Since 1985
              </motion.span>
              <TextReveal className="font-serif text-5xl md:text-7xl text-primary-950 mb-8 leading-tight">
                The Santos Story
              </TextReveal>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="space-y-6 text-slate-600 text-lg leading-relaxed font-light"
              >
                <p className="font-medium text-primary-900 italic">
                  Santos isn’t just a clothing brand, it’s a movement. Built on purpose, resilience, and community, Santos represents the grind, the growth, and the stories behind every win.
                </p>
                <p>
                  The name Santos was coined from the Spanish and Portuguese word meaning “saints” or “the chosen ones.” It reflects the idea that even imperfect people can rise, transform, and walk with purpose.
                </p>
                <p>
                  Founded in 2024, SANTOS was born from a simple truth: opportunities may open doors, but grit keeps you standing. That spirit lives in our tagline, <span className="italic text-primary-600 font-normal">“Grace made me, grit kept me.”</span>
                </p>
              </motion.div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-full relative overflow-hidden bg-stone-900 group rounded-sm">
            <SpotlightEffect className="absolute inset-0 w-full h-full">
              <motion.img
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop"
                alt="SANTOS Editorial Model"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[3s] ease-out"
              />
            </SpotlightEffect>
            {/* Subtle Vignette for Editorial Look */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-black/5 to-black/30 z-40 mix-blend-multiply opacity-80 transition-opacity duration-700 group-hover:opacity-100" />
          </div>
        </div>

        {/* --- SECTION 2: THE JOURNEY --- */}
        <section className="py-24 px-6 md:px-12 bg-white">
          <div className="max-w-4xl mx-auto border-l border-primary-100 pl-8 md:pl-16 space-y-16">
            <div className="space-y-4">
              <h4 className="text-sm uppercase tracking-widest text-primary-400 font-bold">The Collections</h4>
              <p className="text-2xl md:text-4xl font-serif text-primary-950 leading-snug">
                Since its launch, SANTOS has released three collections — <span className="text-primary-600">The Sacred Collection</span>, Bold Visionaries, and The New Curriculum.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 font-light leading-relaxed">
              <p>
                Santos is a brand for everyone. It transcends gender, background, and status, bringing together individuals who believe in self-expression, resilience, and unity. Beyond clothing, Santos has grown a supportive community that empowers creatives, athletes, and dreamers to push forward despite obstacles.
              </p>
              <p>
                In 2025, SANTOS made a powerful cultural impact beyond fashion. In October, we hosted a two-day charity sports event; in November, a runway fashion showcase; and in December, we closed the year with an exclusive Private Cake Fest.
              </p>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: CORE VALUES (Infinite Repetition Loop) --- */}
        <section className="py-32 overflow-hidden bg-primary-950 text-white">
          <div className="max-w-[1440px] mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <TextReveal className="font-serif text-4xl md:text-6xl text-white">
              Our Core Values
            </TextReveal>
            <p className="text-primary-300 max-w-sm font-light uppercase tracking-widest text-[10px]">
              Resilience • Identity • Community • Impact
            </p>
          </div>

          <div className="relative">
            <motion.div
              style={{ x: `${position}%` }}
              className="flex gap-8 w-max px-6"
            >
              {INFINITE_VALUES.map((value, idx) => (
                <div
                  key={idx}
                  className="w-[300px] md:w-[400px] bg-white/5 backdrop-blur-sm border border-white/10 p-8 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-primary-500 font-mono text-sm mb-4 block">0{(idx % 8) + 1}</span>
                    <h3 className="font-serif text-2xl mb-4 text-primary-100">{value.title}</h3>
                    <p className="text-white/60 leading-relaxed font-light text-sm">
                      {value.description}
                    </p>
                  </div>
                  {value.tagline && (
                    <p className="mt-8 text-primary-400 italic text-sm border-t border-white/10 pt-4">
                      {value.tagline}
                    </p>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* --- SECTION 4: THE TEAM --- */}
        <section className="py-32 px-6 bg-stone-50">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
              <div className="lg:col-span-2">
                <h2 className="font-serif text-4xl text-primary-950 mb-4">The Visionary</h2>
                <p className="text-primary-500 uppercase tracking-widest text-xs font-bold">Anekwe Paschal</p>
              </div>
              <div className="lg:col-span-3 text-lg text-slate-700 leading-relaxed font-light space-y-8">
                <p>
                  A stylist and fashion designer from Nigeria, Paschal built SANTOS to blend grace, grit, and culture—proving fashion can be meaningful, inclusive, and impactful.
                </p>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4 border-b border-slate-200 pb-2">The Core Team</p>
                  <p className="text-slate-500 text-base">
                    Ndubuisi Henry, Ndubuisi Ikenna, Ene Reginald, and Eze Henry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FOOTER QUOTE --- */}
        <section className="py-32 px-6 flex items-center justify-center bg-white text-center border-t border-gray-100">
          <div className="max-w-3xl">
            <p className="font-serif text-3xl md:text-5xl text-primary-950 leading-tight italic opacity-80">
              "We don't just design clothes. We curate moments of confidence."
            </p>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default AboutPage;
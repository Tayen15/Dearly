"use client";

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

interface TypewriterLetterProps {
  title: string;
  content: string;
}

export default function TypewriterLetter({ title, content }: TypewriterLetterProps) {
  return (
    <div className="w-full max-w-3xl mx-auto p-8 md:p-16 flex flex-col items-center">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="font-heading font-bold text-3xl md:text-5xl text-primary text-center mb-12 tracking-tight"
      >
        {title}
      </motion.h1>
      
      <div className="font-caveat text-2xl md:text-4xl leading-relaxed md:leading-loose text-foreground whitespace-pre-wrap w-full">
        <TypeAnimation
          sequence={[
            1500, // wait 1.5s before typing
            content,
          ]}
          wrapper="div"
          speed={50}
          cursor={true}
          repeat={0}
          className="inline-block"
        />
      </div>
    </div>
  );
}

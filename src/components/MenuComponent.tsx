import { ReactElement, useState } from "react";
import { motion } from "framer-motion";
import { Spin as Hamburger } from 'hamburger-react'

export const MenuComponent = ({ content, constraintRef }: { content: ReactElement<any,any>, constraintRef: React.RefObject<HTMLDivElement> }) => {

  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [menuContent, setMenuContent] = useState<ReactElement<any,any> | null>(content);

  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 100,
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        overflow: 'hidden',
        padding: '1rem',
      }}
    >
      <motion.button
        drag
        whileDrag={{ scale: 1.1 }}
        dragConstraints={constraintRef}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setTimeout(() => setDragging(false), 100)}
        onClick={() => dragging ? null : setOpen(!open)}
        style={{
          position: 'absolute',
          top: '1.75rem',
          left: '1.75rem',
          width: 'fit-content',
          height: 'fit-content',
          borderRadius: '50%',
          border: '2px solid black',
          zIndex: 101,
          opacity: 0.9,
        }}
      >
        <Hamburger toggled={open} toggle={setOpen} distance="sm" size={20} direction="right" />
      </motion.button>
      <motion.div
        animate={{
          height: open ? '100%' : '0%',
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '1rem',
          border: '1px solid black',
          backdropFilter: 'blur(5px)',
          boxShadow: '0 0 10px 0 rgba(0,0,0,0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: 0.75,
        }}
      >
        {menuContent}
      </motion.div>
    </motion.div>
  );
};
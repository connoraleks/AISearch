import { ReactElement, useState } from "react";
import { motion } from "framer-motion";
import {GiHamburgerMenu} from 'react-icons/gi';

export const MenuComponent = ({ content, constraintRef }: { content: ReactElement<any,any>, constraintRef: React.RefObject<HTMLDivElement> }) => {
    const [open, setOpen] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [menuContent, setMenuContent] = useState<ReactElement<any,any> | null>(content);

    return (
      <motion.button
        drag
        whileDrag={{ scale: 1.1 }}
        dragConstraints={constraintRef}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setTimeout(() => setDragging(false), 100)}
        animate={{
          scale: open ? 1.1 : 1,
          borderRadius: open ? "1rem" : "50%",
          width: open ? "20rem" : "4rem",
          height: open ? "20rem" : "4rem",
          padding: open ? "2rem" : "0",
          backgroundColor: open ? "gray" : "white",
        }}
        style={{
          position: "absolute",
          top: '1rem',
          left: '1rem',
          bottom: '1rem',
          zIndex: 10,
          borderRadius: open ? "1rem" : "50%",
          border: '1px solid black',
          boxShadow: '0 0 10px 0 rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)',
          opacity: 0.9,
        }}
        onClick={() => dragging ? null : setOpen(!open)}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {open ? 
          <motion.div
            animate={{
              opacity: open ? 1 : 0,
              scale: open ? 1 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1rem',
              boxShadow: '0 0 10px 0 rgba(0,0,0,0.5)',
              opacity: 0.9,
            }}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              e.nativeEvent.stopImmediatePropagation();
            }}
            onPointerDownCapture={e => e.stopPropagation()}
          >
            {menuContent}
          </motion.div>
          :
          <motion.div
            animate={{
              opacity: !open ? 1 : 0,
              scale: !open ? 1 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <GiHamburgerMenu size={30} />
          </motion.div>
            }
      </ motion.button>
    );
  };


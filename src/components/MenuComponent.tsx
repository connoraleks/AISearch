import { ReactElement, useState } from "react";
import { motion } from "framer-motion";
import { Spin as Hamburger } from 'hamburger-react'

export const MenuComponent = ({ content, constraintRef }: { content: ReactElement<any,any>[], constraintRef: React.RefObject<HTMLDivElement> }) => {

  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const springTransition = {
    type: 'spring',
    damping: 20,
    stiffness: 100,
    restDelta: 0.5,
  }


  return (
    <motion.div
      id="menu"
      drag
      whileDrag={{ scale: 1.1 }}
      dragConstraints={constraintRef}
      onDragStart={(event) => {
        const target = event.target as HTMLElement;
        console.log('target', target)
        // if the targets id is not 'menu' or 'menu-button' or 'hamburger-react' then don't drag, search three levels up to see if any of the parents are the menu otherwise don't drag
        if(target.id === 'menu' || target.id === 'menu-button' || target.id === 'menu-content' || target.className === 'hamburger-react') {
          console.log('dragging')
          setDragging(true);
        } else {
          event.stopPropagation();
          event.preventDefault();
        }

      }}
      onDragEnd={() => setTimeout(() => setDragging(false), 200)}
      style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      variants={{
        open: {
          border: '2px solid black',
          borderRadius: '5%',
          opacity: 1,
          backgroundColor: 'rgba(0,0,0,0.9)',
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 20,
          },
        },
        closed: {
          border: '2px solid black',
          borderRadius: '50%',
          opacity: 0.9,
          backgroundColor: 'rgba(255,255,255,0.9)',
          transition: {
            delay: 0.5,
            type: 'spring',
            stiffness: 100,
            damping: 20,
          },
        },
      }}
      animate={open ? 'open' : 'closed'}
      initial={false}
    >
      {/* menu button */}
      <motion.button
        id="menu-button"
        onClick={(e) => {
          if (!dragging) {
            e.stopPropagation();
            e.preventDefault();
            setOpen(!open);
          }
        }}
        style={{
          zIndex: 101,
        }}
        variants={{
          open: {
            padding: '1rem',
            color: 'white',
            transition: {
              ...springTransition,
            },
          },
          closed: {
            padding: '0rem',
            color: 'black',
            transition: {
              delay: 0.5,
              ...springTransition,
            },
          },
        }}
      >
        <Hamburger toggled={open} size={20} rounded label='Show menu' />
      </motion.button>
      {/* menu content */}
      <motion.div
        id="menu-content"
        onPointerDownCapture={e => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 100,
          backgroundColor: 'rgba(255,255,255,0.9)',
        }}
        variants={{
          open: {
            padding: '1rem',
            width: '15rem',
            height: '17rem',
            transition: {
              ...springTransition,
            },
          },
          closed: {
            backgroundColor: 'rgba(0,0,0,0)',
            padding: '0rem',
            width: '0rem',
            height: '0rem',
            transition: {
              ...springTransition,
              stiffness: springTransition.stiffness * 2,
            },
          },
        }}
        animate={open ? 'open' : 'closed'}
        initial={false}
      >
        {/* For each item in the content array, render it as a row in the menu that slides in one after the other from left, and then out to the left when the menu is closed */}
        {content.map((item, index) => (
          <motion.div
            onDragStart={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
            id="menu-content"
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: 'auto',
              flex: '1 1 auto',
            }}
            variants={{
              open: {
                opacity: 1,
                x: ['-20rem', '0rem'],
                transition: {
                  delay: 1 + index * 0.1,
                  ...springTransition,
                },
              },
              closed: {
                opacity: 0,
                transition: {
                  ...springTransition,
                  stiffness: springTransition.stiffness * 16,
                },
              },
            }}
            animate={open ? 'open' : 'closed'}
            initial={false}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
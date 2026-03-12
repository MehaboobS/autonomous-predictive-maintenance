import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const innerRef = useRef(null);
  const outerRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const outer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const moveMouse = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Inner circle moves instantly
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    window.addEventListener("mousemove", moveMouse);

    const animateOuter = () => {
      // Smooth lag effect
      outer.current.x += (mouse.current.x - outer.current.x) * 0.1;
      outer.current.y += (mouse.current.y - outer.current.y) * 0.1;

      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outer.current.x}px, ${outer.current.y}px)`;
      }

      requestAnimationFrame(animateOuter);
    };

    animateOuter();

    return () => {
      window.removeEventListener("mousemove", moveMouse);
    };
  }, []);

  return (
    <>
      {/* Outer Lag Circle (Smaller Now) */}
      <div
        ref={outerRef}
        className="fixed pointer-events-none z-50
        w-10 h-10 rounded-full border-2 border-yellow-400
        backdrop-blur-md"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Inner Fast Circle */}
      <div
        ref={innerRef}
        className="fixed pointer-events-none z-50
        w-3 h-3 rounded-full bg-yellow-400"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
};

export default CustomCursor;
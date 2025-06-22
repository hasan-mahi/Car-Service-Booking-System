// src/js/useScrollDirection.js
import { useEffect, useState } from "react";

export default function useScrollDirection({ threshold = 0, hideDelay = 200 } = {}) {
  const [scrollDir, setScrollDir] = useState("up");
  let lastScrollY = window.scrollY;
  let timeoutId = null;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (Math.abs(currentScrollY - lastScrollY) > threshold) {
        if (currentScrollY > lastScrollY && currentScrollY > threshold) {
          setScrollDir("down");
        } else {
          setScrollDir("up");
        }
        lastScrollY = currentScrollY;
      }

      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastScrollY = window.scrollY;
      }, hideDelay);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [threshold, hideDelay]);

  return scrollDir;
}

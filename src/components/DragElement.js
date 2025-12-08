import React, { useRef, useState, useEffect, useCallback } from "react";

/**
 * Horizontal draggable slider
 * Props:
 *  - children: slider items (prefer a list of same-width items)
 *  - itemWidth (optional): pixels, used for buttons scroll. If not provided, component will estimate.
 *  - gap (optional): spacing in px between items (for calc)
 *  - snap (optional): "start" | "center" | "none" (defaults "start")
 */
export default function HorizontalDraggableSlider({
  children,
  itemWidth = 260,
  gap = 16,
  snap = "start",
}) {
  const scrollerRef = useRef(null);
  const isPointerDown = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  // For focus/keyboard
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Keep children count and refs
  const childCount = React.Children.count(children);

  // pointer down -> start dragging
  const onPointerDown = (e) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    isPointerDown.current = true;
    // capture pointer for consistent move/up
    try { e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId); } catch {}
    startX.current = e.pageX - scroller.offsetLeft;
    startScrollLeft.current = scroller.scrollLeft;
    scroller.classList.add("dragging");
  };

  // pointer move -> update scroll position while dragging
  const onPointerMove = (e) => {
    const scroller = scrollerRef.current;
    if (!scroller || !isPointerDown.current) return;
    e.preventDefault(); // prevent native selection
    const x = e.pageX - scroller.offsetLeft;
    const walk = (x - startX.current) * 1; // multiplier — 1 is fine
    scroller.scrollLeft = startScrollLeft.current - walk;
  };

  // pointer up/cancel -> stop dragging
  const endDrag = (e) => {
    const scroller = scrollerRef.current;
    isPointerDown.current = false;
    if (!scroller) return;
    try { e.target.releasePointerCapture && e.target.releasePointerCapture(e.pointerId); } catch {}
    scroller.classList.remove("dragging");
  };

  // Prev / Next scroll by one item
  const scrollByItem = useCallback((dir = 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const scrollAmount = itemWidth + gap;
    scroller.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
  }, [itemWidth, gap]);

  // Keyboard navigation for accessibility (left/right arrow)
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollByItem(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollByItem(-1);
      }
    };
    scroller.addEventListener("keydown", onKey);
    return () => scroller.removeEventListener("keydown", onKey);
  }, [scrollByItem]);

  // optional: wheel to scroll horizontally when Shift or on desktop wheel move
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onWheel = (e) => {
      // if vertical wheel, convert to horizontal scroll for better UX
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault();
        scroller.scrollBy({ left: e.deltaY, behavior: "auto" });
      }
    };
    scroller.addEventListener("wheel", onWheel, { passive: false });
    return () => scroller.removeEventListener("wheel", onWheel);
  }, []);

  // quick helper to jump to item index
  const scrollToIndex = (idx) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const targetLeft = idx * (itemWidth + gap);
    scroller.scrollTo({ left: targetLeft, behavior: "smooth" });
    setFocusedIndex(idx);
    // focus for a11y: find nth-child
    const item = scroller.children[idx];
    item && item.focus && item.focus();
  };

  return (
    <div className="relative">
      {/* Prev / Next buttons */}
      {/* <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20">
        <button
          aria-label="Previous"
          onClick={() => scrollByItem(-1)}
          className="p-2 bg-white shadow rounded-full"
        >
          ◀
        </button>
      </div> */}

      {/* <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20">
        <button
          aria-label="Next"
          onClick={() => scrollByItem(1)}
          className="p-2 bg-white shadow rounded-full"
        >
          ▶
        </button>
      </div> */}

      {/* The scroller */}
      <div
        ref={scrollerRef}
        role="list"
        tabIndex={0}                        // keyboard focus
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        style={{
          display: "flex",
          gap: `${gap}px`,
          overflowX: "auto",
          scrollSnapType: snap !== "none" ? `x mandatory` : "none",
          WebkitOverflowScrolling: "touch",
          padding: "12px",
          // hide default scrollbar for most browsers (still accessible)
          scrollbarWidth: "thin",
        }}
        className="no-scrollbar"
      >
        {React.Children.map(children, (child, idx) => (
          <div
            role="listitem"
            tabIndex={-1}
            onFocus={() => setFocusedIndex(idx)}
            onClick={() => scrollToIndex(idx)}
            style={{
              flex: "0 0 auto",              // prevents shrinking
              width: `${itemWidth}px`,
              scrollSnapAlign: snap,
              cursor: "grab",
            }}
            className="rounded"
          >
            {child}
          </div>
        ))}
      </div>

      {/* Dots / pager */}
      {/* <div className="flex justify-center gap-2 mt-3">
        {Array.from({ length: childCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to item ${i + 1}`}
            className={`w-2 h-2 rounded-full ${i === focusedIndex ? "bg-black" : "bg-gray-300"}`}
          />
        ))}
      </div> */}

      {/* Inline styles to help hide scrollbar on Webkit (optional) */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { height: 8px; }
        .no-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.25); border-radius: 8px; }
        .no-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .dragging { cursor: grabbing !important; user-select: none; }
      `}</style>
    </div>
  );
}

import React from "react";

const InteractiveHoverButton = React.forwardRef(
  ({ text = "Button", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`group relative w-38 cursor-pointer overflow-hidden rounded-full border border-white bg-[#02040D] py-2.5 text-center font-semibold text-white transition-colors duration-300 group-hover:text-black ${className}`}
        {...props}
      >
        <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
          {text}
        </span>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 scale-100 rounded-full bg-blue-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-white group-hover:left-0 group-hover:right-auto group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:translate-y-0 group-hover:scale-[1.8]"></div>
      </button>
    );
  }
);
InteractiveHoverButton.displayName = "InteractiveHoverButton";

export default InteractiveHoverButton;
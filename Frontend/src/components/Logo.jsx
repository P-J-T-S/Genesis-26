import React from "react";
import logoSrc from "../assets/bmc_swm_logo.svg";

const Logo = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={logoSrc} alt="BMC SWM Logo" className="w-8 h-8" />
      <span className="font-bold text-lg text-primary-700">BMC SWM</span>
    </div>
  )
}

export default Logo
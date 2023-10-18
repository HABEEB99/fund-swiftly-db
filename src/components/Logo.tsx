import { PenTool } from "lucide-react";
import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center justify-center space-x-2 text-btn font-bold group"
    >
      <PenTool className="group-hover:animate-spin" />
      <span>TakeNote</span>
    </Link>
  );
};

export default Logo;

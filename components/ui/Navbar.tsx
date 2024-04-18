import Image from "next/image";
import Link from "next/link";
import React from "react";
import MobileNav from "./MobileNav";

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
            <Link href="/" className="flex items-center gap-1">
                <Image
                    src="/icons/logo.svg"
                    width={32}
                    height={32}
                    alt="logo"
                    className="max-sm:size-10"
                />
                <p className="text-[26px] font-extrabold text-white max-sm:hidden">ConferenceApp</p>
            </Link>

            <div className="flex justify-between">
              {/* sheet otomatık olarak mobil ekranda gozukuyor */}
                <MobileNav />
            </div>
        </nav>
    );
};

export default Navbar;
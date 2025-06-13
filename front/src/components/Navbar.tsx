import Link from "next/link";
// import DesktopNavbar from "./DesktopNavbar";
// import MobileNavbar from "./MobileNavbar";
import { Button } from "./ui/button";

async function Navbar() {
  // mirame si esta login, si no lo esta no pases el user al dektopnavbar

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary font-mono tracking-wider">
              CMS
            </Link>
          </div>

          <Link href="/auth">
            <Button variant="outline">
              Login
            </Button>
          </Link>
          {/* <DesktopNavbar /> */}
          {/* <MobileNavbar /> */}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;

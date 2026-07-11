import { GlassCapsule } from "./GlassCapsule";
import { Logo } from "./Logo";
import { NavigationItems } from "./NavigationItems";
import { ContactButton } from "./ContactButton";

export function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-6 z-50 flex justify-center px-4">
      <GlassCapsule>
        <div className="flex items-center gap-2 pr-2">
          <Logo />
          <div className="mx-2 h-4 w-px bg-white/20" />
          <NavigationItems />
          <div className="mx-2 h-4 w-px bg-white/20" />
          <ContactButton />
        </div>
      </GlassCapsule>
    </nav>
  );
}

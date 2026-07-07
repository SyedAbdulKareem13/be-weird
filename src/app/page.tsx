import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import CommandPalette from "@/components/CommandPalette";
import KonamiWatcher from "@/components/KonamiWatcher";
import Nav from "@/components/Nav";
import CautionTape from "@/components/CautionTape";
import Specimen from "@/components/sections/Specimen";
import FieldNotes from "@/components/sections/FieldNotes";
import Instruments from "@/components/sections/Instruments";
import Exhibits from "@/components/sections/Exhibits";
import Incidents from "@/components/sections/Incidents";
import BadgeSection from "@/components/sections/BadgeSection";
import ContactLab from "@/components/sections/ContactLab";
import ArchiveFooter from "@/components/sections/ArchiveFooter";

export default function Home() {
  return (
    <>
      <Preloader />
      <CustomCursor />
      <CommandPalette />
      <KonamiWatcher />
      <Nav />
      <main id="main">
        <Specimen />
        <FieldNotes />
        <CautionTape />
        <Instruments />
        <Exhibits />
        <Incidents />
        <CautionTape text="⚠ RESTRICTED AREA ⚠ PHYSICS AHEAD ⚠ YANK RESPONSIBLY" />
        <BadgeSection />
        <ContactLab />
      </main>
      <ArchiveFooter />
    </>
  );
}

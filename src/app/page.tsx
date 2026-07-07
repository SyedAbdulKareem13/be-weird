import CautionTape from "@/components/CautionTape";
import BoringResume from "@/components/BoringResume";
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
      <main id="main">
        {/* THE ARCHIVE — weird mode */}
        <div data-weird-page>
          <Specimen />
          <FieldNotes />
          <CautionTape />
          <Instruments />
          <Exhibits />
          <Incidents />
          <CautionTape text="⚠ RESTRICTED AREA ⚠ PHYSICS AHEAD ⚠ YANK RESPONSIBLY" />
          <BadgeSection />
          <ContactLab />
        </div>
        {/* THE DOCUMENT — boring mode (CSS gates which tree is visible) */}
        <BoringResume />
      </main>
      <div data-weird-page>
        <ArchiveFooter />
      </div>
    </>
  );
}

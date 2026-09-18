import { useRef, useState } from 'react';
import RouteScale from '../components/route/RouteScale.jsx';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import RouteSectionShell from '../components/route/RouteSectionShell.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Distances from '../components/Distances.jsx';
import Mission from '../components/Mission.jsx';
import VideoSection from '../components/VideoSection.jsx';
import ParticipantsSection from '../components/ParticipantsSection.jsx';
import RouteSection from '../components/RouteSection.jsx';
import InstagramCTA from '../components/InstagramCTA.jsx';
import RegistrationForm from '../components/RegistrationForm.jsx';
import Footer from '../components/Footer.jsx';
import { useCampaignSettings } from '../hooks/useCampaignSettings.js';

export default function Home() {
  const { settings } = useCampaignSettings();
  const [distance, setDistance] = useState('7 km');
  const pageRef = useRef(null);

  return (
    <div ref={pageRef} className="relative flex min-h-screen flex-col">
      <RouteScale containerRef={pageRef} />
      <Header />
      <Hero />

      <RouteSectionShell id="voortgang" label="De stand" side="right">
        <h2 className="u-wide text-[clamp(26px,4vw,40px)] font-extrabold leading-[0.95] text-ink">
          Wat we tot nu toe ophaalden
        </h2>
        <p className="mt-5 max-w-prose text-[17px] leading-[1.6]">
          Alles wat binnenkomt gaat naar het jongerenwerk van The Mall. De teller loopt mee zolang
          de inschrijving open is.
        </p>
        <div className="mt-10">
          <ProgressBar
            raised={settings.raisedAmount}
            goal={settings.goalAmount}
            stretch={settings.stretchGoal}
          />
        </div>
      </RouteSectionShell>

      <Distances onChoose={setDistance} />
      <Mission />
      <VideoSection />
      <ParticipantsSection />
      <RouteSection />
      <InstagramCTA />

      <RouteSectionShell id="inschrijven" label="Inschrijven" tone="finish" align="center">
        <h2 className="u-wide text-center text-[clamp(30px,5vw,52px)] font-extrabold leading-[0.92] text-white">
          Kom naar de start op 14 november
        </h2>
        <p className="mx-auto mt-5 max-w-prose text-center text-[17px] leading-[1.6] text-white/70">
          Vul je gegevens in, dan nemen we contact met je op over de voorbereiding en je eigen
          deelnemerspagina.
        </p>
        <div className="mt-10">
          <RegistrationForm distance={distance} onDistanceChange={setDistance} />
        </div>
      </RouteSectionShell>

      <Footer />
    </div>
  );
}

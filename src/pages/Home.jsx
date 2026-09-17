import { useState } from 'react';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Hero />

      <Section id="voortgang" label="De stand">
        <h2 className="col-span-12 wide text-[28px] font-black leading-[0.95] md:col-span-5 md:text-[40px]">
          Wat we tot nu toe ophaalden
        </h2>
        <p className="col-span-12 mt-4 self-end text-[17px] leading-[1.6] md:col-span-4 md:col-start-9 md:mt-0">
          Alles wat binnenkomt gaat naar het jongerenwerk van The Mall. De teller loopt mee zolang
          de inschrijving open is.
        </p>
        <div className="col-span-12 mt-12 md:col-span-9">
          <ProgressBar
            raised={settings.raisedAmount}
            goal={settings.goalAmount}
            stretch={settings.stretchGoal}
          />
        </div>
      </Section>

      <Distances onChoose={setDistance} />
      <Mission />
      <VideoSection />
      <ParticipantsSection />
      <RouteSection />
      <InstagramCTA />

      <Section id="inschrijven" label="Inschrijven" tone="dark">
        <h2 className="col-span-12 wide text-[34px] font-black leading-[0.9] text-white md:col-span-7 md:text-[56px]">
          Kom naar de start op 14 november
        </h2>
        <p className="col-span-12 mt-5 self-end text-[17px] leading-[1.6] text-white/70 md:col-span-4 md:col-start-9 md:mt-0">
          Vul je gegevens in, dan nemen we contact met je op over de voorbereiding en je eigen
          deelnemerspagina.
        </p>
        <div className="tick-rule tick-rule-light col-span-12 mt-10" aria-hidden="true" />
        <div className="col-span-12 mt-10 md:col-span-7">
          <RegistrationForm distance={distance} onDistanceChange={setDistance} />
        </div>
      </Section>

      <Footer />
    </div>
  );
}

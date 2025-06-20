import React, { useState } from "react";
import FirstImpressionUI from "./components/FirstImpressionUI";
import HandshakeOnboarding from "./components/HandshakeOnboarding";
import MainDashboard from "./components/MainDashboard";

export type UserProfile = {
  creativeName: string;
  role: string;
  quirk: string;
  joinDate: string;
};

export default function App() {
  const [userEntry, setUserEntry] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Step 1: Initial prompt for new user
  if (!userEntry) {
    return <FirstImpressionUI onDone={name => setUserEntry(name)} />;
  }
  // Step 2: Handshake onboarding
  if (!profile) {
    return (
      <HandshakeOnboarding
        initialName={userEntry}
        onComplete={profile => setProfile(profile)}
      />
    );
  }
  // Step 3: Main app/dashboard
  return <MainDashboard profile={profile} />;
}
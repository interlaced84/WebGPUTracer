import React, { useState } from "react";
import { UserProfile } from "../App";

export default function HandshakeOnboarding({
  initialName,
  onComplete
}: {
  initialName: string;
  onComplete: (profile: UserProfile) => void;
}) {
  const [creativeName, setCreativeName] = useState(initialName);
  const [role, setRole] = useState("");
  const [quirk, setQuirk] = useState("");
  const [step, setStep] = useState(0);

  function handleNext() {
    setStep(step + 1);
  }
  function handleFinish() {
    onComplete({
      creativeName,
      role,
      quirk,
      joinDate: new Date().toISOString().slice(0, 10)
    });
  }

  return (
    <div className="handshake-container">
      {step === 0 && (
        <>
          <h2>👋 Welcome, {creativeName}!</h2>
          <p>
            Before we start, let’s make you official.<br />
            What creative name would you like to use?
          </p>
          <input
            value={creativeName}
            onChange={e => setCreativeName(e.target.value)}
            autoFocus
          />
          <button onClick={handleNext} disabled={!creativeName.trim()}>Next</button>
        </>
      )}
      {step === 1 && (
        <>
          <h2>What’s your role?</h2>
          <input
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="e.g. Code Wizard"
            autoFocus
          />
          <button onClick={handleNext} disabled={!role.trim()}>Next</button>
        </>
      )}
      {step === 2 && (
        <>
          <h2>Do you have a quirk? <span style={{fontWeight: 'normal'}}>(optional but fun!)</span></h2>
          <input
            value={quirk}
            onChange={e => setQuirk(e.target.value)}
            placeholder="e.g. Writes only at night"
            autoFocus
          />
          <button onClick={handleFinish}>Finish</button>
        </>
      )}
    </div>
  );
}
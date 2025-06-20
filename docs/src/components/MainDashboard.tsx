import React from "react";
import { UserProfile } from "../App";

export default function MainDashboard({ profile }: { profile: UserProfile }) {
  return (
    <div className="dashboard-container">
      <h1>🌟 Welcome, {profile.creativeName}!</h1>
      <p>
        <strong>Role:</strong> {profile.role || "Not specified"}<br />
        <strong>Quirk:</strong> {profile.quirk || "None"}<br />
        <strong>Joined:</strong> {profile.joinDate}
      </p>
      <p>
        <em>This is your NovaRay dashboard. Expand me with widgets, agent lists, creative projects, and more!</em>
      </p>
    </div>
  );
}
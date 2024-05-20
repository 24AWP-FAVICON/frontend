import React from "react";
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from "./Section3";

function Sections() {
  return (
    <div>
      <main className="flex-grow">
        <Section1 />
        <Section2 />
        <Section3 />
      </main>
    </div>
  );
}

export default Sections;
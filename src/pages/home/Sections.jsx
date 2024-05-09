import React from "react";
import Section1 from './Section1';
import Section2 from './Section2';

function Sections() {
  return (
    <div>
      <main className="flex-grow">
        <Section1 />
        <Section2 />
      </main>
    </div>
  );
}

export default Sections;
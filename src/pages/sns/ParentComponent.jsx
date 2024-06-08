import React, { useState } from "react";
import ChatList from "./ChatList";

function ParentComponent() {
  const [selectedChatSender, setSelectedChatSender] = useState("");

  return (
    <div>
      <ChatList setSelectedChatSender={setSelectedChatSender} />
    </div>
  );
}

export default ParentComponent;

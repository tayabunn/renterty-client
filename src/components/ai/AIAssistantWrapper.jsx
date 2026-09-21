"use client";

import dynamic from "next/dynamic";

const AIAssistantComponent = dynamic(() => import("./AIAssistant"), {
  ssr: false,
});

export default function AIAssistant() {
  return <AIAssistantComponent />;
}

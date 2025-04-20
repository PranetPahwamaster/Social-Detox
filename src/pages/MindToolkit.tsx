
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BreatheTool from "@/components/tools/BreatheTool";
import ZenSoundsTool from "@/components/tools/ZenSoundsTool";
import DumpZoneTool from "@/components/tools/DumpZoneTool";
import DistractTool from "@/components/tools/DistractTool";

const MindToolkit = () => {
  const { tool } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tool || "breathe");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/toolkit/${value}`, { replace: true });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mind Toolkit</h1>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="breathe">🫁 Breathe</TabsTrigger>
          <TabsTrigger value="sounds">🎧 Sounds</TabsTrigger>
          <TabsTrigger value="dump">📝 Dump</TabsTrigger>
          <TabsTrigger value="distract">🧩 Distract</TabsTrigger>
        </TabsList>
        
        <TabsContent value="breathe" className="mt-4">
          <BreatheTool />
        </TabsContent>
        
        <TabsContent value="sounds" className="mt-4">
          <ZenSoundsTool />
        </TabsContent>
        
        <TabsContent value="dump" className="mt-4">
          <DumpZoneTool />
        </TabsContent>
        
        <TabsContent value="distract" className="mt-4">
          <DistractTool />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MindToolkit;

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GoogleDocsGroups() {
  const [groups, setGroups] = useState({});
  const [docLink, setDocLink] = useState("");
  const [groupName, setGroupName] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const storedGroups = JSON.parse(localStorage.getItem("docGroups")) || {};
    setGroups(storedGroups);
  }, []);

  useEffect(() => {
    localStorage.setItem("docGroups", JSON.stringify(groups));
  }, [groups]);

  const addDocument = () => {
    if (!docLink || !groupName || !fileName) return;
    setGroups((prev) => {
      const updated = {
        ...prev,
        [groupName]: [...(prev[groupName] || []), { link: docLink, name: fileName }],
      };
      return updated;
    });
    setDocLink("");
    setGroupName("");
    setFileName("");
  };

  const removeDocument = (group, index) => {
    setGroups((prev) => {
      const updatedGroup = [...prev[group]];
      updatedGroup.splice(index, 1);
      const updated = { ...prev, [group]: updatedGroup };
      if (updated[group].length === 0) delete updated[group];
      return updated;
    });
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold">Google Docs Group Manager</h1>
      <Input placeholder="File Name" value={fileName} onChange={(e) => setFileName(e.target.value)} />
      <Input placeholder="Google Docs Link" value={docLink} onChange={(e) => setDocLink(e.target.value)} />
      <Input placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
      <Button onClick={addDocument}>Add Document</Button>
      
      <div className="mt-6 space-y-4">
        {Object.keys(groups).map((group) => (
          <Card key={group} className="p-4">
            <h2 className="font-semibold">{group}</h2>
            <CardContent>
              {groups[group].map((doc, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p className="text-blue-500 underline">
                    <a href={doc.link} target="_blank" rel="noopener noreferrer">{doc.name}</a>
                  </p>
                  <Button onClick={() => removeDocument(group, index)} variant="destructive">Remove</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

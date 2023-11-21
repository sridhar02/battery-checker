import { useEffect, useState } from "react";

import BatteryData from "./battery-data.json";
import { SchoolDetail } from "./Components/SchoolDetails";

import { aggregateBySchool, calculateBatteryUsage } from "./utils";

function App() {
  const [batteryData, setBatteryData] = useState([]);
  const [schoolSummary, setSchoolSummary] = useState({});

  useEffect(() => {
    const fetchedBatteryData = BatteryData;
    setBatteryData(fetchedBatteryData);

    const unhealthyDevices = calculateBatteryUsage(fetchedBatteryData);
    const issuesBySchool = aggregateBySchool(
      fetchedBatteryData,
      unhealthyDevices
    );
    setSchoolSummary(issuesBySchool);
  }, []);

  return (
    <div className="p-4">
      <h1 className="m-4 text-3xl font-bold">Field Support for Batteries</h1>
      {Object.keys(schoolSummary).length > 0 ? (
        Object.keys(schoolSummary).map((schoolId) => (
          <SchoolDetail
            key={schoolId}
            schoolId={schoolId}
            schoolSummary={schoolSummary[schoolId]}
          />
        ))
      ) : (
        <p>Loading data or no issues found...</p>
      )}
    </div>
  );
}

export default App;

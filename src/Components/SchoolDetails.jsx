export const SchoolDetail = ({ schoolId, schoolSummary }) => (
  <div className="mb-4 p-4 border rounded shadow">
    <h2 className="font-bold text-lg">School ID: {schoolId}</h2>
    <p>Good Devices: {schoolSummary.goodCount}</p>
    <p>Bad Devices: {schoolSummary.badCount}</p>
    {schoolSummary.badCount > 0 && (
      <div>
        <h3 className="font-bold">Bad Devices Serial Numbers:</h3>
        <ul>
          {schoolSummary.badDevices.map((serialNumber) => (
            <li key={serialNumber} className="text-red-500">
              {serialNumber}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

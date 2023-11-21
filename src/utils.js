export const calculateBatteryUsage = (batteryData) => {
  const deviceUsage = {};

  batteryData.forEach(({ serialNumber, batteryLevel, timestamp }) => {
    if (!deviceUsage[serialNumber]) {
      deviceUsage[serialNumber] = { levels: [], totalUsage: 0, count: 0 };
    }
    deviceUsage[serialNumber].levels.push({ batteryLevel, timestamp });
  });

  Object.keys(deviceUsage).forEach((serial) => {
    const { levels } = deviceUsage[serial];
    levels.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    for (let i = 1; i < levels.length; i++) {
      const timeDiff =
        (new Date(levels[i].timestamp) - new Date(levels[i - 1].timestamp)) /
        (1000 * 60 * 60 * 24);
      const batteryDiff = levels[i - 1].batteryLevel - levels[i].batteryLevel;

      if (batteryDiff > 0) {
        deviceUsage[serial].totalUsage += batteryDiff;
        deviceUsage[serial].count += timeDiff;
      }
    }
  });

  const result = {};
  for (const [serial, data] of Object.entries(deviceUsage)) {
    if (data.count > 0) {
      const averageUsage = (data.totalUsage / data.count) * 100;
      if (averageUsage > 30) {
        result[serial] = averageUsage;
      }
    }
  }

  return result;
};

export const aggregateBySchool = (batteryData, unhealthyDevices) => {
  const schoolDeviceIssues = {};

  batteryData.forEach(({ academyId, serialNumber }) => {
    if (!schoolDeviceIssues[academyId]) {
      schoolDeviceIssues[academyId] = { good: new Set(), bad: new Set() };
    }

    if (unhealthyDevices[serialNumber]) {
      schoolDeviceIssues[academyId].bad.add(serialNumber);
    } else {
      schoolDeviceIssues[academyId].good.add(serialNumber);
    }
  });

  const schoolSummary = {};
  Object.keys(schoolDeviceIssues).forEach((academyId) => {
    const { good, bad } = schoolDeviceIssues[academyId];
    schoolSummary[academyId] = {
      goodCount: good.size,
      badCount: bad.size,
      badDevices: Array.from(bad),
    };
  });

  return schoolSummary;
};

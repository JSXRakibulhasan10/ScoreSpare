export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "live":
    case "in_play":
      return "bg-red-500 animate-pulse";
    case "finished":
    case "ft":
    case "full_time":
      return "bg-gray-500";
    case "half_time":
    case "ht":
      return "bg-orange-500";
    case "scheduled":
      return "bg-blue-500";
    case "postponed":
      return "bg-yellow-500";
    default:
      return "bg-gray-400";
  }
};

export const formatStatus = (status, time) => {
  switch (status?.toLowerCase()) {
    case "live":
    case "in_play":
      return time ? `${time}'` : "LIVE";
    case "finished":
    case "ft":
    case "full_time":
      return "FT";
    case "half_time":
    case "ht":
      return "HT";
    case "scheduled":
      return "Scheduled";
    case "postponed":
      return "Postponed";
    default:
      return status || "Unknown";
  }
};

export const getScoreDisplay = (score) => {
  if (score?.current && typeof score.current === "string") {
    const parts = score.current.split(" - ");
    return parts.length === 2 ? [parts[0].trim(), parts[1].trim()] : ["0", "0"];
  }
  if (score?.home !== undefined && score?.away !== undefined) {
    return [score.home.toString(), score.away.toString()];
  }
  return ["0", "0"];
};

export const isLiveMatch = (status) => {
  return ["live", "in_play", "half_time", "ht"].includes(status?.toLowerCase());
};
import { useState, useEffect } from 'react';
import { getLiveMatches } from '../services/footballApi';

export const useMatchData = (activeLeague) => {
  const [allMatches, setAllMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMatches = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await getLiveMatches();
      
      if (data.success) {
        setAllMatches(data.matches || []);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error(data.message || "API returned success: false");
      }
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError(`Failed to load matches: ${err.message}`);
      setAllMatches([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(() => fetchMatches(true), 60000);
    return () => clearInterval(interval);
  }, [activeLeague]);

  return { allMatches, loading, error, lastUpdated, refreshing, fetchMatches };
};
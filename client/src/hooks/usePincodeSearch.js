import { useState, useCallback, useRef } from "react";
import { fetchPincode, fetchSuggestions } from "../utils/api";

export const usePincodeSearch = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestTimeout = useRef(null);

  const search = useCallback(async (pincode) => {
    const pin = pincode || query;
    if (!pin.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSuggestions([]);
    setShowSuggestions(false);

    try {
      const data = await fetchPincode(pin.trim());
      setResult(data);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.suggestion ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleQueryChange = useCallback(async (value) => {
    setQuery(value);

    if (suggestTimeout.current) clearTimeout(suggestTimeout.current);

    if (value.length >= 3) {
      suggestTimeout.current = setTimeout(async () => {
        try {
          const suggs = await fetchSuggestions(value);
          setSuggestions(suggs);
          setShowSuggestions(suggs.length > 0);
        } catch {
          setSuggestions([]);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  const selectSuggestion = useCallback((pincode) => {
    setQuery(String(pincode));
    setSuggestions([]);
    setShowSuggestions(false);
    search(String(pincode));
  }, [search]);

  const clear = useCallback(() => {
    setQuery("");
    setResult(null);
    setError(null);
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  return {
    query,
    result,
    error,
    loading,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    search,
    handleQueryChange,
    selectSuggestion,
    clear,
  };
};

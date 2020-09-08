import { useState, useEffect } from "react";

export const useLocalStorage = (key) => {
  const initial = localStorage.getItem(key);
  const [storage, setStateStorage] = useState(JSON.parse(initial));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storage));
  }, [storage, key]);

  return [storage, setStateStorage];
};

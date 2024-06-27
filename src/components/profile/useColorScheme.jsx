import { useEffect, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import createPersistedState from "use-persisted-state";
const useColorSchemeState = createPersistedState("colorScheme");

export function useColorScheme() {
    const systemPrefersDark = useMediaQuery(
        { 
        query: "(prefers-color-scheme: dark)",
        },
        undefined
    );

    const [storedIsDark, setStoredIsDark] = useColorSchemeState();
  
  // Default isDark to false if there's no stored preference and the system doesn't prefer dark mode
    const isDark = useMemo(() => {
        if (storedIsDark === undefined) {
        return !systemPrefersDark; // Default to light mode if system doesn't prefer dark
        }
        return storedIsDark;
    }, [storedIsDark, systemPrefersDark]);

    useEffect(() => { 
        if (isDark) {
            console.log("Adding 'dark' class to body element");
            document.body.classList.add("dark");
        } else {
            console.log("Removing 'dark' class from body element");
            document.body.classList.remove("dark");
        }
    }, [isDark]);

    const setIsDark = value => {
        setStoredIsDark(value);
    };

    return {
        isDark,
        setIsDark,
    };
}
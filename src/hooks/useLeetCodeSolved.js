import { useEffect, useState } from "react";
import { fetchLeetCodeSolved } from "../services/leetcode.js";

const LOADING = { status: "loading", data: null, error: null };

/**
 * Async state for the Quick Stats "DSA Problems" count.
 *
 *   loading → { status: "loading" }         render "—" with a pulse
 *   success → { status: "success", data }   render data.solved (may be stale)
 *   error   → { status: "error", error }    render "—", page keeps working
 *
 * The fetch is intentionally not awaited by the rest of the page: About (and
 * the portfolio) render immediately and this value fills in when it arrives.
 */
export default function useLeetCodeSolved() {
  const [state, setState] = useState(LOADING);

  useEffect(() => {
    let active = true;

    fetchLeetCodeSolved()
      .then((data) => {
        if (active) setState({ status: "success", data, error: null });
      })
      .catch((error) => {
        if (!active) return;
        // Make the failure loud during development without breaking the page.
        if (import.meta.env?.DEV) {
          console.warn("[QuickStats] Could not load the LeetCode solved count:", error);
        }
        setState({ status: "error", data: null, error });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}

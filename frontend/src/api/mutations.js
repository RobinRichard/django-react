import { useReducer, useCallback, useMemo, useEffect, useRef } from "react";

import { useQuery, START } from "./index";

const initialOptions = {};
const initialDeserialze = res => res.json();

const createInitialMutationState = ({
  url = null,
  options = initialOptions,
} = {}) => {
  return {
    url,
    started: false,
    options,
  };
};

const mutationReducer = (state, action) => {
  switch (action.type) {
    case START:
      return {
        ...state,
        url: action.payload.url,
        options: action.payload.options,
        started: true,
      };
    default:
      throw new Error(`Invalid action type ${action.type}`);
  }
};

export const useMutation = ({
  url: defaultUrl,
  options: defaultOptions = initialOptions,
  deserialize = initialDeserialze,
}) => {
  const [{ started, url, options }, dispatch] = useReducer(
    mutationReducer,
    { url: defaultUrl, options: defaultOptions },
    createInitialMutationState
  );

  const [queryState, { refetch, reset }] = useQuery({
    url: started ? url : null,
    options,
    deserialize,
  });

  const fire = useCallback(
    (nextUrl, partialOptions) => {
      dispatch({
        type: "START",
        payload: {
          url: nextUrl ? nextUrl : url,
          options: partialOptions
            ? {
                ...defaultOptions,
                ...partialOptions,
              }
            : defaultOptions,
        },
      });
    },
    [dispatch, url, defaultOptions]
  );

  const mutationActions = useMemo(
    () => ({
      refetch,
      fire,
      reset,
    }),
    [refetch, fire, reset]
  );

  return [queryState, mutationActions];
};

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [callback, delay]);
}

// inspired by https://codesandbox.io/s/92n5zmoq2y?from-embed
import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import PropTypes from "prop-types";

// So we can test this file, import ourself - https://github.com/facebook/jest/issues/936#issuecomment-214939935
import * as apis from "./index";

const initialState = { loading: false, data: null, error: null };

export const START = "START";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";
export const STATUS_CODE_ERROR = "STATUS_CODE_ERROR";
const RESET = "RESET";

// IE checking code, used to add no-cache to APIQuery
const isIE = /MSIE|Trident/.test(window.navigator.userAgent);

const queryReducer = (state, action) => {
  switch (action.type) {
    case START:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case SUCCESS:
      return {
        ...state,
        data: action.data,
        resultCode: action.resultCode,
        url: action.url,
        options: action.options,
        loading: false,
        error: null,
      };
    case ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
        data: action.data ? action.data : null,
      };
    case RESET:
      return initialState;
    default:
      throw new Error(`Received invalid action type ${action.type}`);
  }
};

const defaultOptions = { validStatusCodes: [200] };
const defaultDeserialize = res => res.json();

const fire = ({ url, dispatch, deserialize, options }) => {
  const abortController = new window.AbortController();
  dispatch({ type: START });
  let data;
  const dataPromise = (async () => {
    try {
      const res = await fetch(url, {
        ...options,
        signal: abortController.signal,
      });
      data = await deserialize(res);
      if (options.validStatusCodes.indexOf(res.status) === -1) {
        throw new Error(STATUS_CODE_ERROR);
      }
      dispatch({ type: SUCCESS, data, resultCode: res.status, url, options });
      return data;
    } catch (error) {
      console.log("An error occured making a query!");
      console.log(error.message);
      dispatch({ type: ERROR, error: error.message, data: data ? data : null });
    }
  })();

  return {
    dataPromise,
    abort: () => abortController.abort(),
  };
};

export const useQuery = ({
  url,
  options = defaultOptions,
  deserialize = defaultDeserialize,
}) => {
  const [queryState, dispatch] = useReducer(queryReducer, initialState);

  // IE cache busting
  if (isIE) {
    if (!options.headers) {
      options.headers = {};
    }
    if (!options.No_IE_Cache_Busting) {
      options.headers = {
        "Cache-control": "no-cache, no-store, must-revalidate",
        Expires: 0,
        ...options.headers,
      };
    }
  }

  useEffect(() => {
    if (!url) {
      dispatch({ type: RESET });
      return;
    }
    const { abort } = fire({ url, dispatch, deserialize, options });
    return abort;
  }, [url, options, deserialize]);

  const refetch = useCallback(() => {
    const { dataPromise } = fire({ url, dispatch, deserialize, options });
    return dataPromise;
  }, [url, options, deserialize]);
  const reset = useCallback(() => dispatch({ type: RESET }), [dispatch]);

  const queryActions = useMemo(() => ({ refetch, reset, options }), [
    refetch,
    reset,
    options,
  ]);
  return [queryState, queryActions];
};

const options = {
  headers: {
    "Content-Type": "application/json",
  },
  validStatusCodes: [200],
};

export const APIQuery = props => {
  /*
  A React component that makes an API Query.
  Automatically uses the user Token if it is set in cookies.
  Automatically resolves the BaseURl from configuration.
  Takes an object with the following properties:
  - path: the *relative* path (minus the domain) for the API query you want to make.
  - successState: the components to render when the query is finished. Is passed any extra props and API data.
  - loadingState: the component to show when the API query is loading.
  - errorState: the component to show when the API query fails. Receives error object.
  */
  const {
    SuccessState,
    LoadingState,
    ErrorState,
    path,
    ValidStatusCodes,
    ...rest
  } = props;

  // Allow different valid status codes to be passed
  if (
    ValidStatusCodes &&
    Array.isArray(ValidStatusCodes) &&
    ValidStatusCodes.length
  ) {
    options.validStatusCodes = ValidStatusCodes;
  }

  const [{ data, loading, error }] = apis.useQuery({
    url: `${path}`,
    options,
  });

  if (loading) {
    return <LoadingState {...rest} />;
  }
  if (error) {
    return <ErrorState {...rest} error={error} />;
  }
  if (data) {
    return <SuccessState {...rest} data={data} />;
  }
  return null;
};

APIQuery.propTypes = {
  SuccessState: PropTypes.func.isRequired,
  LoadingState: PropTypes.func.isRequired,
  ErrorState: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  NoLoginAs: PropTypes.bool,
  ValidStatusCodes: PropTypes.array,
};

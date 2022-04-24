declare global {
  var kvelte: {
    [path: string]: {
      dependencies: string[],
      ssr: string,
    };
  };
}

export {}
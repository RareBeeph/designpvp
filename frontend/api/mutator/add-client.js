module.exports = inputSchema => {
  const paths = {};
  for (const [path, methods] of Object.entries(inputSchema.paths)) {
    const newPath = path.replace('{client}', 'browser');
    paths[newPath] = {};
    for (const [method, operation] of Object.entries(methods)) {
      paths[newPath][method] = {
        ...operation,
        parameters: (operation.parameters ?? []).filter(p => p.name !== 'client'),
      };
    }
  }
  return { ...inputSchema, paths };
};

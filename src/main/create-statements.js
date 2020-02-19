const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

export const createImportStatements = fns => {
  const groupByimportFile = groupBy('location');
  const groupedByLocation = groupByimportFile(fns.importedFns);

  const statements = Object.keys(groupedByLocation)
    .map(groupKey => {
      const defaultFn = groupedByLocation[groupKey].find(g => g.isDefault);
      const namedFns = groupedByLocation[groupKey].filter(g => !g.isDefault);

      return `import ${defaultFn ? defaultFn.name + ', ' : ''}{ ${namedFns
        .map(fn => fn.name)
        .join(', ')} } from '${groupKey}';`;
    })
    .join('');

  return statements;
};

export const createMockFileStatements = fns => {
  const groupByimportFile = groupBy('location');
  const groupedByLocation = groupByimportFile(fns.importedFns);

  const statements = Object.keys(groupedByLocation)
    .map(groupKey => {
      return `mockFunctions(require('${groupKey}'));`;
    })
    .join('');

  return statements;
};

const findImportedDependencies = (fns, functionName, importsUsed) => {
  let fnsUsed = importsUsed || [];

  if (functionName === 'default') {
    const fn = fns.defaultFn;
    fnsUsed.push(...fn.importedFns);
    fn.importedFns.forEach(intFn =>
      fnsUsed.push(...findImportedDependencies(fns, intFn, fnsUsed))
    );
    fn.internalFns.forEach(intFn =>
      fnsUsed.push(...findImportedDependencies(fns, intFn, fnsUsed))
    );
  }

  const namedFn = Object.keys(fns.namedFns).find(fn => fn === functionName);
  const internalFn = Object.keys(fns.internalFns).find(
    fn => fn === functionName
  );

  if (namedFn || internalFn) {
    const fn = fns.namedFns[namedFn] || fns.internalFns[internalFn];
    fnsUsed.push(...fn.importedFns);
    fn.importedFns.forEach(intFn =>
      fnsUsed.push(...findImportedDependencies(fns, intFn, fnsUsed))
    );
    fn.internalFns.forEach(intFn =>
      fnsUsed.push(...findImportedDependencies(fns, intFn, fnsUsed))
    );
  }

  return [...new Set(fnsUsed)];
};

export const createDefaultDescribe = fns => {
  const importsUsedNames = findImportedDependencies(fns, 'default');

  return `${
    fns.defaultFn
      ? `describe('defaultExport', () => {${createIt(
          'default',
          importsUsedNames
        )}});`
      : ''
  }`;
};

export const createNamedDescribes = fns => {
  return Object.keys(fns.namedFns)
    .map(fnName => {
      const importsUsedNames = findImportedDependencies(fns, fnName);
      return `${
        fns.defaultFn
          ? `describe('${fnName}', () => {${createIt(
              fnName,
              importsUsedNames
            )}});`
          : ''
      }`;
    })
    .join('');
};

export const createIt = (name, fns) => {
  return `it('returns true when ${fns.join(', ')} is true', () => {${
    fns.length ? fns.map(fn => `setMockValue(${fn}, true);`).join(``) : ''
  }expect(subjectUnderTest.${name}()).toEqual(true);});`;
};

export const createSubjectUnderTestStatement = filename => {
  const filenameParts = filename.split('/');
  const file = filenameParts.pop();
  return `import * as subjectUnderTest from './${file}';`;
};

export default (fns, filename) => {
  const importStatements = createImportStatements(fns);
  const mockStatements = createMockFileStatements(fns);

  const defaultDescribe = createDefaultDescribe(fns);
  const nameDescribes = createNamedDescribes(fns);

  const sutStatement = createSubjectUnderTestStatement(filename);

  return `import { mockFunctions, setMockValue } from 'mock-my-ride';

${mockStatements}
${importStatements}

${sutStatement}

${defaultDescribe}

${nameDescribes}`;
};

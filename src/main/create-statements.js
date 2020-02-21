import defaultConfig from '../config';

const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

export const createImportStatements = (fns, ignoreWrappers) => {
  const groupByimportFile = groupBy('location');
  const groupedByLocation = !ignoreWrappers
    ? groupByimportFile(fns.importedFns)
    : groupByimportFile(
        fns.importedFns.filter(
          fn => !defaultConfig.wrapperList.includes(fn.name)
        )
      );
  const statements = Object.keys(groupedByLocation)
    .map(groupKey => {
      let defaultFn = groupedByLocation[groupKey].find(g => g.isDefault);
      let namedFns = groupedByLocation[groupKey].filter(g => !g.isDefault);

      return `import ${
        defaultFn ? defaultFn.name + (namedFns.length ? ', ' : '') : ''
      }${
        namedFns.length ? `{ ${namedFns.map(fn => fn.name).join(', ')} }` : ''
      } from '${groupKey}';`;
    })
    .join('');

  return statements;
};

export const createMockFileStatements = (fns, ignoreWrappers) => {
  const groupByimportFile = groupBy('location');
  const groupedByLocation = !ignoreWrappers
    ? groupByimportFile(fns.importedFns)
    : groupByimportFile(
        fns.importedFns.filter(
          fn => !defaultConfig.wrapperList.includes(fn.name)
        )
      );

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

  // If not namedFn or internalFn then must be a call to a ref internal to the func
  // In this case we can ignore because other fns it calls will be picked up through
  // traverse process

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

export const createDefaultDescribe = (fns, ignoreWrappers) => {
  const importsUsedNames = findImportedDependencies(fns, 'default');
  return `${
    fns.defaultFn
      ? `describe('defaultExport', () => {${createIt(
          'default',
          importsUsedNames,
          ignoreWrappers
        )}});`
      : ''
  }`;
};

export const createNamedDescribes = (fns, ignoreWrappers) => {
  return Object.keys(fns.namedFns)
    .map(fnName => {
      const importsUsedNames = findImportedDependencies(fns, fnName);
      return `${
        fns.defaultFn
          ? `describe('${fnName}', () => {${createIt(
              fnName,
              importsUsedNames,
              ignoreWrappers
            )}});`
          : ''
      }`;
    })
    .join('');
};

const createReselectIt = (name, fns, ignoreWrappers) => {
  const resultFuncStatement = fns.length
    ? fns
        .map((fn, i) => (i !== 0 ? fn : undefined))
        .filter(Boolean)
        .join(', ')
    : '';
  return `it('returns true when ${fns
    .filter(fn => fn !== 'createSelector')
    .join(', ')} is true', () => {const testValue = 'foo'; ${
    fns.length
      ? fns
          .map(fn =>
            fn !== 'createSelector' ||
            (ignoreWrappers && !defaultConfig.wrapperList.includes(fn))
              ? `setMockValue(${fn}, true);`
              : ''
          )
          .join(``)
      : ''
  }expect(subjectUnderTest.${name}.resultFunc(${resultFuncStatement}, testValue).toEqual(true));});`;
};

export const createIt = (name, fns, ignoreWrappers) => {
  // Handle reselect resultFunc
  if (fns.length && fns[0] === 'createSelector') {
    return createReselectIt(name, fns, ignoreWrappers);
  }
  return `it('returns true when ${fns.join(', ')} is true', () => {${
    fns.length
      ? fns
          .map(fn => {
            if (ignoreWrappers && defaultConfig.wrapperList.includes(fn)) {
              return '';
            }
            return `setMockValue(${fn}, true);`;
          })
          .join(``)
      : ''
  }expect(subjectUnderTest.${name}()).toEqual(true);});`;
};

export const createSubjectUnderTestStatement = filename => {
  const filenameParts = filename.split('/');
  const file = filenameParts.pop();
  return `import * as subjectUnderTest from './${file}';`;
};

export default (fns, filename) => {
  const importStatements = createImportStatements(fns, true);
  const mockStatements = createMockFileStatements(fns, true);

  const defaultDescribe = createDefaultDescribe(fns, true);
  const nameDescribes = createNamedDescribes(fns, true);

  const sutStatement = createSubjectUnderTestStatement(filename);

  return `import { mockFunctions, setMockValue } from 'mock-my-ride';

${mockStatements}
${importStatements}

${sutStatement}

${defaultDescribe}

${nameDescribes}`;
};

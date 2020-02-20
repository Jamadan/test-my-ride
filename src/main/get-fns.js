import * as babel from '@babel/parser';
import traverse from '@babel/traverse';
import defaultConfig from '../config';

export default (filename, customWrapperList, ignoreWrappers = false) => {
  const ast = babel.parse(filename, {
    sourceType: 'module',
    plugins: [
      // enable jsx and ts syntax
      'jsx',
      'typescript'
    ]
  });

  const fns = {
    defaultFn: undefined,
    namedFns: {},
    importedFns: [],
    internalFns: {}
  };

  // Do the imports first as we need them for filtering later
  traverse(ast, {
    ImportDefaultSpecifier: path => {
      fns.importedFns.push({
        name: path.node.local.name,
        isDefault: true,
        location: path.parent.source.value
      });
    },
    ImportSpecifier: path => {
      fns.importedFns.push({
        name: path.node.local.name,
        isDefault: false,
        location: path.parent.source.value
      });
    }
  });

  const isImport = name => fns.importedFns.map(fn => fn.name).includes(name);

  const traverseInternal = (path, collections) =>
    traverse(
      path.node,
      {
        CallExpression: internalPath => {
          const wrapperList = customWrapperList || defaultConfig.wrapperList;

          if (
            internalPath.node.callee &&
            wrapperList.includes(internalPath.node.callee.name)
          ) {
            if (!ignoreWrappers) {
              if (isImport(internalPath.node.callee.name)) {
                collections.importedFns.push(internalPath.node.callee.name);
              } else {
                collections.internalFns.push(internalPath.node.callee.name);
              }
            }
            internalPath.node.arguments.forEach(arg => {
              if (isImport(arg.name)) {
                collections.importedFns.push(arg.name);
              } else {
                collections.internalFns.push(arg.name);
              }
            });
          } else {
            if (isImport(internalPath.node.callee.name)) {
              collections.importedFns.push(internalPath.node.callee.name);
            } else {
              collections.internalFns.push(internalPath.node.callee.name);
            }
          }
        }
      },
      path.scope,
      path
    );

  // Now get the exported members and the functions they use
  traverse(ast, {
    ExportDefaultDeclaration: path => {
      fns.defaultFn = { importedFns: [], internalFns: [] };
      traverseInternal(path, fns.defaultFn);
    },
    ExportNamedDeclaration: path => {
      const fn =
        path.node.declaration.declarations &&
        path.node.declaration.declarations[0].id.name;

      if (fn) {
        fns.namedFns[fn] = { importedFns: [], internalFns: [] };
        traverseInternal(path, fns.namedFns[fn]);
      }
    }
  });

  // Now get the internal member and the functions they use
  traverse(ast, {
    VariableDeclarator: path => {
      const exportedNames = Object.keys(fns.namedFns);
      const internalName = path.node.id.name;

      if (!exportedNames.includes(internalName)) {
        fns.internalFns[internalName] = { importedFns: [], internalFns: [] };
        traverseInternal(path, fns.internalFns[internalName]);
      }
    }
  });

  return fns;
};

import * as babel from '@babel/parser';
import traverse from '@babel/traverse';

export default filename => {
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

  const traverseInternal = (path, collections, pathName) =>
    traverse(
      path.node,
      {
        Identifier: internalPath => {
          if (internalPath.node.name !== pathName) {
            if (isImport(internalPath.node.name)) {
              !collections.importedFns.includes(internalPath.node.name) &&
                collections.importedFns.push(internalPath.node.name);
            } else {
              !collections.internalFns.includes(internalPath.node.name) &&
                collections.internalFns.push(internalPath.node.name);
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
      traverseInternal(path, fns.defaultFn, 'default');
    },
    ExportNamedDeclaration: path => {
      const fn =
        path.node.declaration.declarations &&
        path.node.declaration.declarations[0].id.name;

      if (fn) {
        fns.namedFns[fn] = { importedFns: [], internalFns: [] };
        traverseInternal(path, fns.namedFns[fn], fn);
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
        traverseInternal(path, fns.internalFns[internalName], internalName);
      }
    }
  });

  // Now filter through the internal declarations to remove the local vars
  const filterFns = (fns, internalFns) => {
    return internalFns.filter(fn => {
      return (
        Object.keys(fns.internalFns).includes(fn) ||
        Object.keys(fns.namedFns).includes(fn)
      );
    });
  };

  if (fns.defaultFn) {
    fns.defaultFn.internalFns = filterFns(fns, fns.defaultFn.internalFns);
  }
  Object.keys(fns.namedFns).forEach(fnName => {
    fns.namedFns[fnName].internalFns = filterFns(
      fns,
      fns.namedFns[fnName].internalFns
    );
  });
  Object.keys(fns.internalFns).forEach(fnName => {
    fns.internalFns[fnName].internalFns = filterFns(
      fns,
      fns.internalFns[fnName].internalFns
    );
  });

  // console.log(JSON.stringify(fns, null, 4));
  return fns;
};

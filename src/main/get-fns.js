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
  // console.log(parsed);

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

  // Now get the exported members and the functions they use
  traverse(ast, {
    ExportDefaultDeclaration: path => {
      fns.defaultFn = { importedFns: [], internalFns: [] };
      traverse(
        path.node,
        {
          CallExpression: path2 => {
            if (
              fns.importedFns
                .map(fn => fn.name)
                .includes(path2.node.callee.name)
            ) {
              fns.defaultFn.importedFns.push(path2.node.callee.name);
            } else {
              fns.defaultFn.internalFns.push(path2.node.callee.name);
            }
          }
        },
        path.scope,
        path
      );
    },
    ExportNamedDeclaration: path => {
      const fn =
        path.node.declaration.declarations &&
        path.node.declaration.declarations[0].id.name;

      if (fn) {
        fns.namedFns[fn] = { importedFns: [], internalFns: [] };
        traverse(
          path.node,
          {
            CallExpression: path2 => {
              if (
                fns.importedFns
                  .map(fn => fn.name)
                  .includes(path2.node.callee.name)
              ) {
                fns.namedFns[fn].importedFns.push(path2.node.callee.name);
              } else {
                fns.namedFns[fn].internalFns.push(path2.node.callee.name);
              }
            }
          },
          path.scope,
          path
        );
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
        traverse(
          path.node,
          {
            CallExpression: path2 => {
              if (
                fns.importedFns
                  .map(fn => fn.name)
                  .includes(path2.node.callee.name)
              ) {
                fns.internalFns[internalName].importedFns.push(
                  path2.node.callee.name
                );
              } else {
                fns.internalFns[internalName].internalFns.push(
                  path2.node.callee.name
                );
              }
            }
          },
          path.scope,
          path
        );
      }
    }
  });

  return fns;
};

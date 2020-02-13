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
    importedFns: []
  };

  // Do these first as we need them for filtering later
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

  traverse(ast, {
    ExportDefaultDeclaration: path => {
      fns.defaultFn = [];
      traverse(
        path.node,
        {
          CallExpression: path2 => {
            // We are only going to mock imports
            if (
              fns.importedFns
                .map(fn => fn.name)
                .includes(path2.node.callee.name)
            ) {
              fns.defaultFn.push(path2.node.callee.name);
            }
          }
        },
        path.scope,
        path
      );
    },
    ExportNamedDeclaration: path => {
      const fnName =
        path.node.declaration.declarations &&
        path.node.declaration.declarations[0].id.name;
      if (fnName) {
        fns.namedFns[fnName] = [];
        traverse(
          path.node,
          {
            CallExpression: path2 => {
              // We are only going to mock imports
              if (
                fns.importedFns
                  .map(fn => fn.name)
                  .includes(path2.node.callee.name)
              ) {
                fns.namedFns[fnName].push(path2.node.callee.name);
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

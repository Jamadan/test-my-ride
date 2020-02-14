import * as babel from '@babel/parser';
import traverse from '@babel/traverse';

export default (filename, fnName) => {
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
      if (!fnName || fnName === 'default') {
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
      }
    },
    ExportNamedDeclaration: path => {
      const fn =
        path.node.declaration.declarations &&
        path.node.declaration.declarations[0].id.name;

      if (
        fn &&
        (!fnName || fnName === path.node.declaration.declarations[0].id.name)
      ) {
        fns.namedFns[fn] = [];
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
                fns.namedFns[fn].push(path2.node.callee.name);
              }
            }
          },
          path.scope,
          path
        );
      }
    }
  });

  let requiredImports = fns.defaultFn ? fns.defaultFn : [];
  requiredImports = [
    ...requiredImports,
    ...Object.values(fns.namedFns).map(value => value)
  ];

  requiredImports = requiredImports.flat(Infinity);
  fns.importedFns = fns.importedFns.filter(fn =>
    requiredImports.includes(fn.name)
  );

  return fns;
};

export default (filename, fnName) => {
    function createTSSourceFile(root: any, fileStats: any) {
        return ts.createSourceFile(
          fileStats.name,
          readFileSync(`${root}/${fileStats.name}`).toString(),
          ts.ScriptTarget.ES2015,
          /*setParentNodes */ true
        );
      }
}
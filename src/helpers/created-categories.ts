/*
 * The names of the categories a test created and that still exist. The page object keeps it up to
 * date (create adds, delete removes, a saved rename replaces), and the fixture deletes whatever is
 * left when the test ends, whether it passed or failed.
 */
export class CreatedCategories {
  readonly names: Array<string> = [];

  /* The name the edit dialog was last opened with, so a save knows which category it renamed. */
  openedName = "";

  add = (name: string): void => {
    this.names.push(name);
  };

  rename = (oldName: string, newName: string): void => {
    const index = this.names.indexOf(oldName);
    if (index >= 0) this.names[index] = newName;
  };

  remove = (name: string): void => {
    const index = this.names.indexOf(name);
    if (index >= 0) this.names.splice(index, 1);
  };
}

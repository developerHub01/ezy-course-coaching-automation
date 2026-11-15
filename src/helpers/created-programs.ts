/*
 * The titles of the programs a test created and that still exist. The page objects keep it up to
 * date (create adds, delete removes, a saved rename replaces), and the fixture deletes whatever is
 * left when the test ends, whether it passed or failed.
 */
export class CreatedPrograms {
  readonly titles: Array<string> = [];

  /*
   * The title the edit form was last opened with. It lives here, and not in one page object, because
   * the list page and the test each hold their own edit page object, and a save must know the old title.
   */
  openedTitle = "";

  add = (title: string): void => {
    this.titles.push(title);
  };

  rename = (oldTitle: string, newTitle: string): void => {
    const index = this.titles.indexOf(oldTitle);
    if (index >= 0) this.titles[index] = newTitle;
  };

  remove = (title: string): void => {
    const index = this.titles.indexOf(title);
    if (index >= 0) this.titles.splice(index, 1);
  };
}

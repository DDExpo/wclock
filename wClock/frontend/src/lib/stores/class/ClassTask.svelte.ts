

export class Task {
  id: string;
  text = $state("task");
  checked = $state(false);
  timeSpent = $state("");

  constructor(id: string, text: string, checked: boolean, timeSpent: string) {
    this.id = id
    this.text = text
    this.checked = checked
    this.timeSpent = timeSpent
  };
};
